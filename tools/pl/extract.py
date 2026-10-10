"""Stage 1: PDF -> page-numbered Markdown + images, using the cheapest tool that works.

Per page range:
  1. pages with a real text layer -> PyMuPDF (exact text, missing spaces rebuilt from glyph gaps)
  2. scanned pages -> local converters from pipeline.toml (docling / marker / rapidocr), in order,
     moving to the next one when a converter crashes or returns too little text.
Big PDFs are processed in chunks of `chunk_pages` pages. Results are cached per page in
work/<book>/pages/, so re-running never repeats finished pages.
"""
import io, json, os, re
import pymupdf

FOOTERS = [r"^The real IELTS - .*$", r"^Izone\.edu\.vn$", r"^\d{1,3}$"]


def page_lines(page, drop=FOOTERS):
    """(block number, text line) pairs rebuilt from glyph positions, adding the spaces the PDF
    forgot (common after Vietnamese letters). Lines matching any regex in `drop` are skipped."""
    out = []
    for b in page.get_text("rawdict")["blocks"]:
        for l in b.get("lines", []):
            s, last = "", None
            for sp in l["spans"]:
                for c in sp["chars"]:
                    if last is not None and c["c"] != " " and not s.endswith(" ") and c["bbox"][0] - last > sp["size"] * 0.15:
                        s += " "
                    s += c["c"]
                    last = c["bbox"][2]
            s = s.strip()
            if s and not any(re.match(f, s) for f in drop):
                out.append((b["number"], s))
    return out


def text_layer_md(page):
    blocks = {}
    for bn, line in page_lines(page):
        blocks.setdefault(bn, []).append(line)
    return "\n\n".join(" ".join(v) for _, v in sorted(blocks.items()))


def ink_ratio(page):
    """Share of dark pixels on a small grayscale render (0 = white page)."""
    pix = page.get_pixmap(matrix=pymupdf.Matrix(0.5, 0.5), colorspace=pymupdf.csGRAY)
    data = pix.samples
    return sum(1 for b in data if b < 215) / max(1, len(data))


def letters(s):
    return len(re.findall(r"[A-Za-zÀ-ỹ]", s))


# ------------------------------------------------------------------ scanned-page converters
def _chunk_pdf(doc, pages):
    sub = pymupdf.open()
    for p in pages:
        sub.insert_pdf(doc, from_page=p, to_page=p)
    return sub.tobytes()


def conv_docling(doc, pages, imgdir):
    from docling.document_converter import DocumentConverter, PdfFormatOption
    from docling.datamodel.base_models import InputFormat, DocumentStream
    from docling.datamodel.pipeline_options import PdfPipelineOptions
    opts = PdfPipelineOptions(do_ocr=True, do_table_structure=True, generate_picture_images=True)
    # scanned test pages often get classified as one big "picture": OCR everything, and export
    # the text found inside pictures too (traverse_pictures below)
    opts.ocr_options.force_full_page_ocr = True
    conv = DocumentConverter(format_options={InputFormat.PDF: PdfFormatOption(pipeline_options=opts)})
    res = conv.convert(DocumentStream(name="chunk.pdf", stream=io.BytesIO(_chunk_pdf(doc, pages))))
    d = res.document
    out = {}
    for i, p in enumerate(pages):
        out[p] = d.export_to_markdown(page_no=i + 1, traverse_pictures=True)
    for k, pic in enumerate(getattr(d, "pictures", []) or []):
        try:
            img = pic.get_image(d)
            pg = pages[pic.prov[0].page_no - 1] if pic.prov else pages[0]
            if img and img.width > 150:
                img.save(os.path.join(imgdir, f"p{pg + 1:03d}-docling-{k}.png"))
        except Exception:
            pass
    return out


_TIMEOUT = {}


def conv_marker(doc, pages, imgdir):
    """Marker 1.x lives in its own venv (tools/.venv-marker) because its torch/transformers
    pins clash with Docling's. Runs marker_single once on a chunk with page separators."""
    import subprocess, tempfile, shutil, glob
    tools = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    exe = os.path.join(tools, ".venv-marker", "Scripts", "marker_single.exe")
    if not os.path.exists(exe):
        raise RuntimeError("Marker not installed (expected tools/.venv-marker)")
    tmp = tempfile.mkdtemp()
    try:
        src = os.path.join(tmp, "chunk.pdf")
        open(src, "wb").write(_chunk_pdf(doc, pages))
        subprocess.run([exe, src, "--output_dir", tmp, "--paginate_output", "--output_format", "markdown"],
                       check=True, capture_output=True, timeout=_TIMEOUT.get("s", 600))
        md_path = glob.glob(os.path.join(tmp, "**", "*.md"), recursive=True)[0]
        md = open(md_path, encoding="utf-8").read()
        # paginated output: "{0}------…" before each page
        chunks = re.split(r"\n?\{(\d+)\}-{10,}\n", md)
        out = {}
        for k in range(1, len(chunks) - 1, 2):
            out[pages[int(chunks[k])]] = chunks[k + 1].strip()
        for img in glob.glob(os.path.join(os.path.dirname(md_path), "*.jpeg")) + glob.glob(os.path.join(os.path.dirname(md_path), "*.png")):
            m = re.search(r"_page_(\d+)_", os.path.basename(img))
            pg = pages[int(m.group(1))] if m and int(m.group(1)) < len(pages) else pages[0]
            shutil.copy(img, os.path.join(imgdir, f"p{pg + 1:03d}-marker-{os.path.basename(img)}"))
        return out
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


_RAPID = {}


def conv_rapidocr(doc, pages, imgdir, zoom=2):
    import numpy as np
    from rapidocr_onnxruntime import RapidOCR
    eng = _RAPID.setdefault("eng", RapidOCR())
    out = {}
    for p in pages:
        pix = doc[p].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3]
        res, _ = eng(img)
        rows = []
        for pts, text, _c in sorted(res or [], key=lambda r: (round(r[0][0][1] / 12), r[0][0][0])):
            rows.append(text)
        out[p] = "\n".join(rows)
    return out


CONVERTERS = {"docling": conv_docling, "marker": conv_marker, "rapidocr": conv_rapidocr}


# ------------------------------------------------------------------ main entry
def extract(pdf_path, workdir, kind, cfg, log, first=1, last=None):
    """Fill workdir/pages/pNNN.md for pages first..last (1-based). Returns {page: (tool, text)}."""
    ex = cfg["extract"]
    _TIMEOUT["s"] = ex.get("converter_timeout", 600)
    doc = pymupdf.open(pdf_path)
    last = min(last or len(doc), len(doc))
    pagedir, imgdir = os.path.join(workdir, "pages"), os.path.join(workdir, "images")
    os.makedirs(pagedir, exist_ok=True); os.makedirs(imgdir, exist_ok=True)
    result, scanned = {}, []
    for p in range(first - 1, last):
        cache = os.path.join(pagedir, f"p{p + 1:03d}.json")
        if os.path.exists(cache):
            result[p + 1] = tuple(json.load(open(cache, encoding="utf-8")))
            continue
        page = doc[p]
        raw = page.get_text()
        if letters(raw) >= ex["text_layer_min_chars"]:
            md = text_layer_md(page)
            for k, img in enumerate(page.get_images(full=True)):
                try:  # an odd image format must never stop the run
                    pix = pymupdf.Pixmap(doc, img[0])
                    if pix.width <= 150:
                        continue
                    if pix.colorspace is None or pix.colorspace.n not in (1, 3):
                        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
                    if pix.alpha:
                        pix = pymupdf.Pixmap(pix, 0)
                    pix.save(os.path.join(imgdir, f"p{p + 1:03d}-img{k}.png"))
                except Exception as e:
                    log(f"extract: skipped an image on page {p + 1} ({str(e)[:80]})")
            result[p + 1] = ("textlayer", md)
            json.dump(result[p + 1], open(cache, "w", encoding="utf-8"), ensure_ascii=False)
        else:
            scanned.append(p)
    if scanned:
        # blank / near-blank scanned pages: measured by ink coverage on a tiny render (milliseconds,
        # no OCR), so the slow converters never see them
        empty = [p for p in scanned if ink_ratio(doc[p]) < ex.get("blank_page_max_ink", 0.008)]
        for p in empty:
            result[p + 1] = ("blank", "")
            json.dump(result[p + 1], open(os.path.join(pagedir, f"p{p + 1:03d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
        if empty:
            log(f"extract: {len(empty)} near-empty page(s) skipped (covers/blank/pictures): {[p + 1 for p in empty][:12]}")
        scanned = [p for p in scanned if p not in empty]
    if scanned:
        log(f"extract: {len(scanned)} scanned page(s) -> converters {ex[kind]}")
    chunk = ex["chunk_pages"]
    for i in range(0, len(scanned), chunk):
        part = scanned[i:i + chunk]
        todo, best = list(part), {}
        for tool in ex[kind]:
            if not todo:
                break
            try:
                got = CONVERTERS[tool](doc, todo, imgdir)
            except Exception as e:
                log(f"extract: {tool} failed on pages {todo[0] + 1}-{todo[-1] + 1} ({type(e).__name__}: {str(e)[:120]}) -> next tool")
                continue
            for p in todo:
                if letters(got.get(p, "")) > letters(best.get(p, ("", ""))[1]):
                    best[p] = (tool, got[p])
            keep = [p for p in todo if letters(got.get(p, "")) >= ex["min_chars_per_page"]]
            for p in keep:
                result[p + 1] = (tool, got[p])
                json.dump(result[p + 1], open(os.path.join(pagedir, f"p{p + 1:03d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
            weak = [p for p in todo if p not in keep]
            log(f"extract: {tool} pages {todo[0] + 1}-{todo[-1] + 1}: {len(keep)} ok" + (f", {len(weak)} too little text -> next tool" if weak else ""))
            todo = weak
        for p in todo:  # no tool reached the threshold (e.g. a map page): keep the best text, flagged
            result[p + 1] = (best[p][0] + "-weak", best[p][1]) if p in best else ("none", "")
            json.dump(result[p + 1], open(os.path.join(pagedir, f"p{p + 1:03d}.json"), "w", encoding="utf-8"), ensure_ascii=False)
            log(f"extract: page {p + 1} has little text ({result[p + 1][0]}); kept and flagged")
    return result


def page_image(pdf_path, page_no, zoom=1.6):
    """PNG bytes of one page (for vision models when text extraction is not enough)."""
    doc = pymupdf.open(pdf_path)
    return doc[page_no - 1].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom)).tobytes("png")
