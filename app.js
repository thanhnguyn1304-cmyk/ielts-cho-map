/* IELTS cho Mập — test player. Book data files call IELTS.addBook({...}). */
const IELTS = (() => {
  const books = [];
  const ALL_BOOKS = [13, 14, 15, 16, 17];
  const SKILL_NAMES = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking" };

  // ---------- storage (never required to work) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const prefs = Object.assign({ theme: "default", font: "Lexend", size: 19 }, store.get("ielts:prefs", {}));
  function applyPrefs() {
    document.documentElement.dataset.theme = prefs.theme;
    document.documentElement.style.setProperty("--font", `"${prefs.font}", system-ui, sans-serif`);
    document.documentElement.style.setProperty("--size", prefs.size + "px");
    store.set("ielts:prefs", prefs);
  }

  // ---------- helpers ----------
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LETTERS = "ABCDEFGHIJ";
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const icon = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l14 8-14 8z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    phones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1v-6h3zM3 19a2 2 0 002 2h1v-6H3z"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4zM23 9l-6 6M17 9l6 6"/></svg>'
  };

  function norm(s) {
    // spaces are dropped so "87954 82361" == "8795482361"; currency signs are ignored
    return String(s ?? "").toLowerCase().replace(/[‘’`]/g, "'").replace(/[.,;:!?"£$€]/g, "").replace(/\s+/g, "");
  }
  function variants(ans) {
    const out = [];
    for (const alt of String(ans).split("|")) {
      let list = [alt];
      while (list.some(a => /\([^)]*\)/.test(a))) {
        list = list.flatMap(a => {
          const m = a.match(/\(([^)]*)\)/);
          return m ? [a.replace(m[0], m[1]), a.replace(m[0], "")] : [a];
        });
      }
      out.push(...list.map(norm));
    }
    return out;
  }
  const displayAns = (ans) => String(ans).split("|")[0];

  function bandFor(skill, score) {
    const L = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]];
    const R = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]];
    return (skill === "listening" ? L : R).find(([min]) => score >= min)[1];
  }

  // ---------- fireworks (canvas, ~4s) ----------
  function fireworks() {
    const cv = document.createElement("canvas");
    cv.className = "fireworks";
    document.body.append(cv);
    const ctx = cv.getContext("2d");
    const resize = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    resize();
    const colors = ["#f0b429", "#d9413f", "#f9c6d3", "#4f95f0", "#1fc77e", "#ff8fab", "#ffffff"];
    const parts = [];
    const burst = () => {
      const x = innerWidth * (0.15 + Math.random() * 0.7), y = innerHeight * (0.15 + Math.random() * 0.4);
      const c = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 70; i++) {
        const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 5;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: Math.random() < 0.25 ? "#fff" : c, r: 1.5 + Math.random() * 2 });
      }
    };
    let n = 0;
    const timer = setInterval(() => { burst(); if (++n >= 9) clearInterval(timer); }, 380);
    burst();
    const start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.06; p.x += p.vx; p.y += p.vy; p.life -= 0.012;
        if (p.life <= 0) continue;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (now - start < 5200) requestAnimationFrame(frame); else cv.remove();
    })(start);
  }

  // ---------- error log (wrong answers + her explanations) ----------
  const ERROR_TYPES = ["Nghe nhầm / không nghe kịp", "Chính tả / số / ngữ pháp", "Không biết từ vựng", "Không nhận ra paraphrase", "Bị đánh lạc hướng (distractor)", "Đọc sai yêu cầu / giới hạn từ", "Hết giờ / đoán", "Khác"];
  const errlog = {
    get: () => store.get("ielts:errlog", {}),
    put(e) { const all = errlog.get(); all[e.id] = { ...(all[e.id] || {}), ...e, created: all[e.id]?.created || Date.now() }; store.set("ielts:errlog", all); },
    del(id) { const all = errlog.get(); delete all[id]; store.set("ielts:errlog", all); }
  };

  // ---------- word notes ----------
  // Double-click a word -> pink highlight + note box. Click a pink word -> view/edit its note.
  // Notes are stored by character offset inside the pane, so they re-apply after re-render.
  function textNodes(root) {
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest("select, textarea, .note-pop") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    while (w.nextNode()) out.push(w.currentNode);
    return out;
  }
  function wrapAt(root, start, len, id) {
    let pos = 0;
    for (const n of textNodes(root)) {
      const L = n.data.length;
      if (start >= pos && start + len <= pos + L) {
        const r = document.createRange();
        r.setStart(n, start - pos); r.setEnd(n, start - pos + len);
        const m = document.createElement("mark");
        m.className = "note-mark"; m.dataset.note = id;
        r.surroundContents(m);
        return m;
      }
      pos += L;
    }
    return null;
  }
  function enableNotes(root, key) {
    let notes = store.get(key, []);
    const save = () => store.set(key, notes);
    for (const n of notes) wrapAt(root, n.start, n.len, n.id);

    root.addEventListener("dblclick", (e) => {
      if (e.target.closest("input, select, textarea, button, .note-mark")) return;
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const r = sel.getRangeAt(0);
      const node = r.startContainer;
      if (node.nodeType !== 3 || node !== r.endContainer || !root.contains(node)) return;
      let a = r.startOffset, b = r.endOffset;
      while (b > a && /[\s.,;:!?"')\]]/.test(node.data[b - 1])) b--;   // trim trailing space/punctuation
      while (a < b && /[\s"'(\[]/.test(node.data[a])) a++;
      if (b <= a) return;
      let start = 0;
      for (const n of textNodes(root)) { if (n === node) break; start += n.data.length; }
      start += a;
      sel.removeAllRanges();
      const note = { id: "n" + Date.now(), start, len: b - a, text: "" };
      const m = wrapAt(root, start, note.len, note.id);
      if (!m) return;
      notes.push(note); save();
      openNote(m, note, true);
    });
    root.addEventListener("click", (e) => {
      const m = e.target.closest(".note-mark");
      if (!m) return;
      e.preventDefault(); e.stopPropagation();
      const note = notes.find(n => n.id === m.dataset.note);
      if (note) openNote(m, note, false);
    }, true);

    function openNote(m, note, isNew) {
      closeNotePop();
      const word = m.textContent;
      const pop = h(`<div class="note-pop"><div class="note-word">${esc(word)}</div>
        <textarea placeholder="Ghi chú cho từ này…"></textarea>
        <div class="note-btns"><button data-a="del">Xoá</button><button data-a="ok" class="primary">Lưu</button></div></div>`);
      const ta = pop.querySelector("textarea");
      ta.value = note.text;
      ta.oninput = () => { note.text = ta.value; save(); };
      pop.querySelector('[data-a="ok"]').onclick = () => closeNotePop();
      pop.querySelector('[data-a="del"]').onclick = () => {
        notes = notes.filter(n => n !== note); save();
        m.replaceWith(...m.childNodes); root.normalize();
        closeNotePop();
      };
      document.body.append(pop);
      const rc = m.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = Math.min(Math.max(8, rc.left), innerWidth - pw - 8);
      let top = rc.bottom + 8;
      if (top + ph > innerHeight - 8) top = Math.max(8, rc.top - ph - 8);
      pop.style.left = left + "px"; pop.style.top = top + "px";
      if (isNew || !note.text) ta.focus();
      setTimeout(() => document.addEventListener("mousedown", outside), 0);
      function outside(ev) { if (!pop.contains(ev.target)) closeNotePop(); }
      pop._off = () => document.removeEventListener("mousedown", outside);
    }
  }
  function closeNotePop() {
    document.querySelectorAll(".note-pop").forEach(p => { p._off?.(); p.remove(); });
  }

  // which question numbers a group contains
  function groupQs(g) {
    if (g.type === "html") return [...g.html.matchAll(/\[\[(\d+)\]\]/g)].map(m => +m[1]);
    if (g.type === "multi") return g.qs.slice();
    return g.items.map(i => i.q);
  }
  const sectionQs = (sec) => sec.groups.flatMap(groupQs);

  // ---------- home ----------
  function renderHome(app) {
    document.title = "IELTS cho Mập";
    const wrap = h(`<div class="home">
      <div class="hero"><img src="assets/logo-cut.png" alt=""><div><h1>IELTS cho Mập</h1><p>Cambridge IELTS 13 – 17 · Listening, Reading, Writing &amp; Speaking</p></div><a class="hero-log" href="#/errors">📒 Sổ lỗi sai</a></div>
    </div>`);
    for (const id of ALL_BOOKS) {
      const b = books.find(x => x.id === id);
      const sec = h(`<section class="book"><h2>Cambridge IELTS ${id}</h2></section>`);
      if (!b) { sec.append(h(`<div class="soon">🎀 Đang cập nhật…</div>`)); wrap.append(sec); continue; }
      const grid = h(`<div class="tests"></div>`);
      for (const t of b.tests) {
        const card = h(`<div class="test-card"><h3>Test ${t.n}</h3><div class="skills"></div></div>`);
        for (const sk of Object.keys(SKILL_NAMES)) {
          if (!t[sk]) continue;
          const saved = store.get(`ielts:${b.id}:${t.n}:${sk}`, null);
          const score = saved && saved.score != null ? `<span class="score">${saved.score}/40</span>` : "";
          const link = h(`<a class="skill" href="#/${b.id}/${t.n}/${sk}">${SKILL_NAMES[sk]}${score}</a>`);
          if (sk === "listening" || sk === "reading") link.onclick = (e) => { e.preventDefault(); choosePart(b, t, sk); };
          card.querySelector(".skills").append(link);
          if (sk === "listening" || sk === "reading") {
            const ps = partScores(b, t, sk);
            if (ps.some(x => x)) card.querySelector(".skills").append(h(`<div class="part-scores">${ps.map((x, i) =>
              `<span class="ps${x ? "" : " none"}" title="${sk === "listening" ? "Part" : "Passage"} ${i + 1}">${sk === "listening" ? "P" : "R"}${i + 1}${x ? ` <b>${x.right}/${x.total}</b>` : " –"}</span>`).join("")}</div>`));
          }
        }
        grid.append(card);
      }
      sec.append(grid);
      wrap.append(sec);
    }
    app.replaceChildren(wrap);
  }

  // score per part: single-part practice if done, otherwise taken from the full-test check
  function partScores(b, t, sk) {
    const secs = sk === "listening" ? t.listening.parts : t.reading.passages;
    const full = store.get(`ielts:${b.id}:${t.n}:${sk}`, null);
    return secs.map((s, i) => {
      const qs = sectionQs(s);
      const one = store.get(`ielts:${b.id}:${t.n}:${sk}:p${i + 1}`, null);
      if (one && one.score != null) return { right: one.score, total: qs.length };
      if (full && full.marks && qs.some(q => full.marks[q] != null)) return { right: qs.filter(q => full.marks[q] === true).length, total: qs.length };
      return null;
    });
  }

  // ---------- error log page ----------
  function mdLite(s) {
    return esc(s).replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>").replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
  }
  function aiPrompt(entries) {
    const data = entries.map(e => ({
      book: `Cambridge ${e.book}`, test: e.test, skill: e.skill, part: e.part, question: e.q, context: e.question,
      first_wrong_answer: e.firstWrongAnswer, final_answer: e.yourAnswer, correct: e.correct,
      still_wrong: e.stillWrong, error_type: e.type || null, student_note: e.note || null
    }));
    return `Bạn là giáo viên IELTS. Dưới đây là sổ lỗi sai của một học viên (dạng JSON) khi làm đề Cambridge IELTS. ` +
      `Mỗi mục là một câu học viên làm sai (hoặc sai lần đầu rồi tự sửa), kèm loại lỗi và ghi chú tự giải thích của học viên nếu có.\n\n` +
      `Hãy phân tích bằng tiếng Việt:\n1. Các điểm yếu chính (xếp theo mức độ thường gặp), mỗi điểm kèm ví dụ cụ thể từ dữ liệu.\n` +
      `2. Dạng câu hỏi / dạng bẫy học viên hay mắc (vd: điền số, chính tả, paraphrase, distractor, map labelling...).\n` +
      `3. Kế hoạch luyện tập 2 tuần cụ thể, thực tế.\n4. 3 mẹo nhanh áp dụng ngay khi làm bài.\n` +
      `Viết ngắn gọn, thân thiện, dùng tiêu đề và gạch đầu dòng.\n\nDữ liệu:\n` + JSON.stringify(data, null, 1);
  }
  function renderErrors(app) {
    document.title = "Sổ lỗi sai · IELTS cho Mập";
    const all = Object.values(errlog.get()).sort((a, b) => (b.updated || b.created) - (a.updated || a.created));
    const byType = {};
    all.forEach(e => { const k = e.type || "Chưa phân loại"; byType[k] = (byType[k] || 0) + 1; });
    const wrap = h(`<div class="home errlog">
      <div class="hero"><img src="assets/logo-cut.png" alt=""><div><h1>Sổ lỗi sai</h1><p>${all.length} câu đã sai · ghi lại vì sao sai để tìm điểm yếu</p></div><a class="hero-log" href="#/">← Trang chủ</a></div>
      <section class="book ai-box">
        <h2>🤖 Phân tích điểm yếu bằng AI</h2>
        <div class="type-chips">${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span>${esc(k)} <b>${n}</b></span>`).join("") || '<span class="muted">Chưa có lỗi nào — làm bài rồi bấm “Xem đáp án” nhé.</span>'}</div>
        <div class="ai-actions">
          <button class="btnx primary" data-a="ai">Phân tích bằng Claude</button>
          <button class="btnx" data-a="copy">Copy prompt (dán vào claude.ai)</button>
          <button class="btnx" data-a="json">Tải file JSON</button>
          <button class="btnx" data-a="key">🔑 API key</button>
        </div>
        <div class="ai-out">${store.get("ielts:ai-last", "") ? mdLite(store.get("ielts:ai-last", "")) : ""}</div>
      </section>
      <section class="book"><h2>Danh sách lỗi</h2><div class="err-list"></div></section>
    </div>`);
    const list = wrap.querySelector(".err-list");
    if (!all.length) list.innerHTML = `<div class="soon">Chưa có lỗi nào.</div>`;
    for (const e of all) {
      const row = h(`<div class="err-row">
        <div class="err-head"><b>C${e.book} T${e.test} · ${SKILL_NAMES[e.skill]} ${e.skill === "listening" ? "Part" : "Passage"} ${e.part} · Q${e.q}</b>
          ${e.stillWrong ? '<span class="tag bad">sai</span>' : '<span class="tag ok">đã sửa</span>'}
          <button class="err-del" title="Xoá">✕</button></div>
        <div class="err-ctx">${esc(e.question || "")}</div>
        <div class="err-ans">${e.firstWrongAnswer ? `Lần đầu: <s>${esc(e.firstWrongAnswer)}</s> · ` : ""}${e.yourAnswer && e.stillWrong ? `Cuối: <s>${esc(e.yourAnswer)}</s> · ` : ""}Đáp án: <b>${esc(e.correct || "")}</b></div>
        <div class="rq-note"><select data-f="type"><option value="">Loại lỗi…</option>${ERROR_TYPES.map(x => `<option${e.type === x ? " selected" : ""}>${x}</option>`).join("")}</select>
          <textarea data-f="note" rows="2" placeholder="Vì sao sai?">${esc(e.note || "")}</textarea></div>
      </div>`);
      row.querySelectorAll("[data-f]").forEach(x => { const f = () => errlog.put({ id: e.id, [x.dataset.f]: x.value.trim(), updated: Date.now() }); x.oninput = f; x.onchange = f; });
      row.querySelector(".err-del").onclick = () => { if (confirm("Xoá lỗi này khỏi sổ?")) { errlog.del(e.id); row.remove(); } };
      list.append(row);
    }
    const out = wrap.querySelector(".ai-out");
    const current = () => Object.values(errlog.get());
    wrap.querySelector('[data-a="copy"]').onclick = async () => {
      try { await navigator.clipboard.writeText(aiPrompt(current())); alert("Đã copy! Mở claude.ai và dán vào là được."); }
      catch { prompt("Copy đoạn này:", aiPrompt(current())); }
    };
    wrap.querySelector('[data-a="json"]').onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(current(), null, 2)], { type: "application/json" }));
      a.download = "ielts-loi-sai.json"; a.click();
    };
    const askKey = () => {
      const k = prompt("Dán Anthropic API key (lưu trong trình duyệt này, không gửi đi đâu khác ngoài api.anthropic.com):", store.get("ielts:apikey", ""));
      if (k != null) store.set("ielts:apikey", k.trim());
      return store.get("ielts:apikey", "");
    };
    wrap.querySelector('[data-a="key"]').onclick = askKey;
    wrap.querySelector('[data-a="ai"]').onclick = async (ev) => {
      const entries = current();
      if (!entries.length) return alert("Chưa có lỗi nào để phân tích.");
      const key = store.get("ielts:apikey", "") || askKey();
      if (!key) return;
      const btn = ev.currentTarget; btn.disabled = true; btn.textContent = "Đang phân tích…";
      out.innerHTML = '<div class="muted">Claude đang đọc sổ lỗi…</div>';
      try {
        const { default: Anthropic } = await import("https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm");
        const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });
        const stream = client.beta.messages.stream({
          model: "claude-opus-5-5",
          max_tokens: 16000,
          output_config: { effort: "medium" },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          messages: [{ role: "user", content: aiPrompt(entries) }]
        });
        let text = "";
        stream.on("text", (d) => { text += d; out.innerHTML = mdLite(text); });
        const msg = await stream.finalMessage();
        if (msg.stop_reason === "refusal") throw new Error("Claude từ chối yêu cầu này.");
        text = msg.content.filter(b => b.type === "text").map(b => b.text).join("");
        out.innerHTML = mdLite(text);
        store.set("ielts:ai-last", text);
      } catch (err) {
        out.innerHTML = `<div class="bad-msg">Lỗi: ${esc(err.message || err)}${err.status === 401 ? " — API key sai, bấm 🔑 để nhập lại." : ""}</div>`;
      } finally { btn.disabled = false; btn.textContent = "Phân tích bằng Claude"; }
    };
    app.replaceChildren(wrap);
  }

  // Listening/Reading: pick the full test or a single part/passage
  function choosePart(b, t, sk) {
    const secs = sk === "listening" ? t.listening.parts : t.reading.passages;
    const label = sk === "listening" ? "Part" : "Passage";
    const base = `#/${b.id}/${t.n}/${sk}`;
    const scoreOf = (k, total) => { const s = store.get(k, null); return s && s.score != null ? `<span class="pick-score">${s.score}/${total}</span>` : ""; };
    const m = h(`<div class="modal"><div class="modal-card pick">
      <div class="pick-title">${esc(b.title)} · Test ${t.n}<br><b>${SKILL_NAMES[sk]}</b></div>
      <a class="pick-full" href="${base}">📝 Làm full test <small>(${label} 1–${secs.length} · 40 câu)</small>${scoreOf(`ielts:${b.id}:${t.n}:${sk}`, 40)}</a>
      <div class="pick-sub">hoặc luyện từng phần</div>
      <div class="pick-grid">${secs.map((s, i) => {
        const n = sectionQs(s).length;
        return `<a class="pick-part" href="${base}/p${i + 1}"><b>${label} ${i + 1}</b><small>${esc(s.title || "")}</small>${scoreOf(`ielts:${b.id}:${t.n}:${sk}:p${i + 1}`, n)}</a>`;
      }).join("")}</div>
      <button class="pick-close">Đóng</button>
    </div></div>`);
    m.onclick = (e) => { if (e.target === m || e.target.closest(".pick-close") || e.target.closest("a")) m.remove(); };
    document.body.append(m);
  }

  // ---------- shared top-bar pieces ----------
  function toolsHtml(extraRight) {
    const themes = [["default", "#fffaf8"], ["white", "#ffffff"], ["sepia", "#f5ecdf"], ["cream", "#fdf7e3"], ["mint", "#eaf4ec"], ["dark", "#24201f"]];
    return `<div class="tools">
      <span class="hide-sm">${themes.map(([k, c]) => `<button class="swatch${prefs.theme === k ? " on" : ""}" data-theme="${k}" title="${k}" style="background:${c}"></button>`).join(" ")}</span>
      <select class="sel" data-pref="font">
        ${[["Lexend", "Mặc định"], ["Merriweather", "Serif"], ["Nunito", "Nunito"]].map(([v, l]) => `<option value="${v}"${prefs.font === v ? " selected" : ""}>${l}</option>`).join("")}
      </select>
      <select class="sel" data-pref="size">
        ${[15, 16, 17, 18, 19, 20, 21, 23, 25].map(v => `<option value="${v}"${+prefs.size === v ? " selected" : ""}>${v}px</option>`).join("")}
      </select>
      <button class="ibtn hide-sm" data-act="full" title="Toàn màn hình">${icon.full}</button>
      <span class="timer">00:00</span>
      ${extraRight || ""}
    </div>`;
  }
  function wireTools(root) {
    root.querySelectorAll(".swatch").forEach(s => s.onclick = () => {
      prefs.theme = s.dataset.theme; applyPrefs();
      root.querySelectorAll(".swatch").forEach(x => x.classList.toggle("on", x === s));
    });
    root.querySelectorAll("select[data-pref]").forEach(s => s.onchange = () => { prefs[s.dataset.pref] = s.value; applyPrefs(); });
    const full = root.querySelector('[data-act="full"]');
    if (full) full.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  }
  let timerId = null;
  function startTimer(el, key, countdown) {
    clearInterval(timerId);
    const startAt = Date.now() - store.get(key, 0) * 1000;
    const tick = () => {
      const used = (Date.now() - startAt) / 1000;
      store.set(key, Math.floor(used));
      if (countdown) {
        const left = countdown - used;
        el.textContent = fmt(left);
        el.classList.toggle("low", left < 300);
      } else el.textContent = fmt(used);
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  // ---------- listening / reading ----------
  function renderQuiz(app, book, test, skill, mode, mode2) {
    const data = test[skill];
    // single-part practice: #/13/1/listening/p2 (results at .../p2/result); otherwise the full test
    const only = /^p\d$/.test(mode || "") ? +mode.slice(1) - 1 : null;
    const isResult = mode === "result" || mode2 === "result";
    const allSections = skill === "listening" ? data.parts : data.passages;
    const sections = only == null ? allSections : [allSections[only]];
    const num = (i) => (only == null ? i + 1 : only + 1);
    const basePath = `#/${book.id}/${test.n}/${skill}` + (only == null ? "" : `/p${only + 1}`);
    const key = `ielts:${book.id}:${test.n}:${skill}` + (only == null ? "" : `:p${only + 1}`);
    const saved = store.get(key, {});
    // marks: {q: true|false} from the last "Kiểm Tra" (answers stay hidden); revealed: user chose "Xem đáp án"
    const st = { part: saved.part || 0, answers: saved.answers || {}, marks: saved.marks || {}, wrongEver: saved.wrongEver || {}, revealed: !!saved.revealed, tries: saved.tries || 0, score: saved.score };
    const save = () => store.set(key, { part: st.part, answers: st.answers, marks: st.marks, wrongEver: st.wrongEver, revealed: st.revealed, tries: st.tries, score: st.score, checked: st.revealed });
    const locked = (q) => st.revealed || st.marks[q] === true;
    const allQs = sections.flatMap(sectionQs);
    const label = skill === "listening" ? "Part" : "Passage";
    document.title = `C${book.id} T${test.n} ${SKILL_NAMES[skill]}${only == null ? "" : ` ${label} ${only + 1}`} · IELTS cho Mập`;
    // band tables are for 40 questions; scale a single part up for an estimate
    const bandOf = (right) => bandFor(skill, Math.round(right * 40 / allQs.length));

    const shell = h(`<div class="shell">
      <div class="topbar">
        <div class="row">
          <a class="ibtn" href="#/" title="Quay lại">${icon.back}</a>
          <div class="parts"></div>
          ${toolsHtml('<button class="check">Kiểm Tra</button>')}
        </div>
        ${skill === "listening" ? `<div class="row">
          <button class="ibtn" data-act="mute" title="Tắt/mở tiếng">${icon.phones}</button>
          <button class="play" title="Phát">${icon.play}</button>
          <span class="time cur">00:00</span>
          <div class="seek"><i></i></div>
          <span class="time dur">00:00</span>
          <button class="ibtn" data-act="rate" title="Tốc độ">1x</button>
          <audio preload="metadata"></audio>
        </div>` : ""}
      </div>
      <div class="sheet">
        <div class="sheet-head">
          <div><b class="ttl"></b> <span class="range"></span><div class="sub"></div></div>
          <div class="src">${esc(book.title)} – Test ${test.n}</div>
        </div>
        <div class="panes"></div>
      </div>
    </div>`);
    app.replaceChildren(shell);
    wireTools(shell);
    startTimer(shell.querySelector(".timer"), key + ":time", skill === "reading" ? 3600 : 0);

    const partsEl = shell.querySelector(".parts");
    const panes = shell.querySelector(".panes");

    // ----- audio -----
    let audio = null;
    if (skill === "listening") {
      audio = shell.querySelector("audio");
      const playBtn = shell.querySelector(".play"), cur = shell.querySelector(".cur"), dur = shell.querySelector(".dur");
      const seek = shell.querySelector(".seek"), bar = seek.querySelector("i");
      const rates = [0.75, 1, 1.25, 1.5];
      playBtn.onclick = () => audio.paused ? audio.play() : audio.pause();
      audio.onplay = () => playBtn.innerHTML = icon.pause;
      audio.onpause = () => playBtn.innerHTML = icon.play;
      audio.onloadedmetadata = () => dur.textContent = fmt(audio.duration);
      audio.ontimeupdate = () => { cur.textContent = fmt(audio.currentTime); bar.style.width = (audio.currentTime / audio.duration * 100 || 0) + "%"; };
      audio.onended = () => { if (st.part < sections.length - 1) { showPart(st.part + 1); audio.play(); } };
      seek.onclick = (e) => { const r = seek.getBoundingClientRect(); if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration; };
      const rateBtn = shell.querySelector('[data-act="rate"]');
      rateBtn.onclick = () => { const i = (rates.indexOf(audio.playbackRate) + 1) % rates.length; audio.playbackRate = rates[i]; rateBtn.textContent = rates[i] + "x"; };
      const muteBtn = shell.querySelector('[data-act="mute"]');
      muteBtn.onclick = () => { audio.muted = !audio.muted; muteBtn.innerHTML = audio.muted ? icon.mute : icon.phones; };
    }

    // ----- top bar chips -----
    function renderChips() {
      partsEl.replaceChildren();
      sections.forEach((sec, i) => {
        const chip = h(`<button class="chip${i === st.part ? " on" : ""}">${label.toUpperCase()} ${num(i)}</button>`);
        chip.onclick = () => showPart(i);
        partsEl.append(chip);
        if (i !== st.part) return;
        for (const q of sectionQs(sec)) {
          const b = h(`<button class="qn" data-qn="${q}">${q}</button>`);
          b.onclick = () => goTo(q);
          partsEl.append(b);
        }
      });
      paintNums();
    }
    function paintNums() {
      partsEl.querySelectorAll(".qn").forEach(b => {
        const q = +b.dataset.qn;
        b.classList.toggle("done", st.marks[q] == null && hasAnswer(q));
        b.classList.toggle("ok", st.marks[q] === true);
        b.classList.toggle("bad", st.marks[q] === false);
      });
    }
    function goTo(q) {
      const idx = sections.findIndex(s => sectionQs(s).includes(q));
      if (idx !== st.part) showPart(idx);
      const el = panes.querySelector(`[data-q="${q}"]`);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus?.({ preventScroll: true }); }
    }

    // ----- answers -----
    const hasAnswer = (q) => st.answers[q] != null && String(st.answers[q]).trim() !== "";
    const multiGroups = sections.flatMap(s => s.groups).filter(g => g.type === "multi");
    function isRight(q) {
      const mg = multiGroups.find(g => g.qs.includes(q));
      if (mg) {
        return multiAssign(mg)[q].right;
      }
      return hasAnswer(q) && variants(data.answers[q]).includes(norm(st.answers[q]));
    }
    // "choose TWO, in either order": a pick that equals a question's key belongs to that question;
    // remaining (wrong) picks are handed to the unmatched questions in order.
    function multiAssign(g) {
      const picks = (st.answers["m" + g.qs[0]] || []).slice();
      const out = {}, left = [];
      const used = new Set();
      g.qs.forEach(q => {
        const k = norm(data.answers[q]);
        const hit = picks.find(p => norm(p) === k && !used.has(p));
        if (hit != null) { used.add(hit); out[q] = { right: true, pick: hit }; } else left.push(q);
      });
      const spare = picks.filter(p => !used.has(p));
      left.forEach((q, i) => { out[q] = { right: false, pick: spare[i] ?? "" }; });
      return out;
    }
    function setAnswer(q, v) {
      st.answers[q] = v; unmark(q); save(); paintNums();
    }
    // answer changed after a check -> drop its red mark until the next check
    function unmark(q) {
      if (st.marks[q] == null) return;
      delete st.marks[q];
      panes.querySelectorAll(`.gap[data-q="${q}"], .q[data-q="${q}"]`).forEach(el => {
        el.classList.remove("ok", "bad");
        el.querySelectorAll(".wrong").forEach(o => o.classList.remove("wrong"));
      });
    }

    // ----- group rendering -----
    function gapHtml(q, letters) {
      if (letters) {
        return `<span class="gap" data-q="${q}"><select data-q="${q}"><option value=""></option>${[...letters].map(l => `<option>${l}</option>`).join("")}</select></span>`;
      }
      return `<span class="gap" data-q="${q}"><input data-q="${q}" autocomplete="off" spellcheck="false"></span>`;
    }
    function boxHtml(g) {
      if (!g.box) return "";
      const isList = g.box.some(([, t]) => t.length > 28);
      return `<div class="box${isList ? " list" : ""}">${g.boxTitle ? `<div class="bt">${g.boxTitle}</div>` : ""}<div class="opts">${g.box.map(([k, t]) => `<div><span class="k">${k}</span>${t}</div>`).join("")}</div></div>`;
    }
    function renderGroup(g) {
      const qs = groupQs(g);
      const range = qs.length > 1 ? `Questions ${qs[0]}–${qs[qs.length - 1]}` : `Question ${qs[0]}`;
      const instr = g.instr.replace(/^Questions? [\d–-]+<br>/, "");
      const el = h(`<div class="group"><div class="group-head"><span class="title">${g.heading ? esc(g.heading) : range}</span></div><div class="group-body"><div class="instr">${g.heading ? range + "<br>" : ""}${instr}</div></div></div>`);
      const body = el.querySelector(".group-body");
      if (g.image) {
        const img = h(`<img class="fig" src="${g.image}" alt="" title="Bấm để phóng to">`);
        img.onclick = () => { const z = h(`<div class="fig-zoom"><img src="${g.image}" alt=""></div>`); z.onclick = () => z.remove(); document.body.append(z); };
        body.append(img);
      }

      if (g.type === "html") {
        body.insertAdjacentHTML("beforeend", boxHtml(g) + g.html.replace(/\[\[(\d+)\]\]/g, (_, q) => gapHtml(q, g.letters)));
      } else if (g.type === "mcq") {
        for (const it of g.items) {
          const q = h(`<div class="q" data-q="${it.q}" tabindex="-1"><div class="qt"><span class="num">${it.q}</span><div>${it.text}</div></div><div class="opts-list"></div></div>`);
          it.options.forEach((o, i) => q.querySelector(".opts-list").append(h(`<label class="opt" data-v="${LETTERS[i]}"><input type="radio" name="q${it.q}"><span class="L">${LETTERS[i]}</span><span>${o}</span></label>`)));
          body.append(q);
        }
      } else if (g.type === "choice") {
        for (const it of g.items) {
          const q = h(`<div class="q" data-q="${it.q}" tabindex="-1"><div class="qt"><span class="num">${it.q}</span><div>${it.text}</div></div><div class="pills">${g.choices.map(c => `<button class="pill" data-v="${c}">${c}</button>`).join("")}</div></div>`);
          body.append(q);
        }
      } else if (g.type === "match") {
        body.insertAdjacentHTML("beforeend", boxHtml(g));
        const letters = g.letters ? [...g.letters] : g.box.map(([k]) => k);
        for (const it of g.items) {
          body.append(h(`<div class="q match-row" data-q="${it.q}" tabindex="-1"><span class="num" style="flex:none;display:inline-grid;place-items:center;min-width:30px;height:30px;border-radius:8px;border:2px solid var(--frame);font-size:.7em;font-weight:700">${it.q}</span><span class="txt">${it.text}</span><span class="gap" data-q="${it.q}"><select data-q="${it.q}"><option value=""></option>${letters.map(l => `<option>${l}</option>`).join("")}</select></span></div>`));
        }
      } else if (g.type === "multi") {
        const q = h(`<div class="q" data-q="${g.qs[0]}" data-multi="${g.qs.join(",")}" tabindex="-1"><div class="qt"><span class="num">${g.qs.join("–")}</span><div>${g.text}</div></div><div class="opts-list"></div></div>`);
        g.options.forEach((o, i) => q.querySelector(".opts-list").append(h(`<label class="opt" data-v="${LETTERS[i]}"><input type="checkbox"><span class="L">${LETTERS[i]}</span><span>${o}</span></label>`)));
        body.append(q);
      }
      return el;
    }

    function bindInputs(root) {
      // text gaps + selects
      root.querySelectorAll("input[data-q], select[data-q]").forEach(inp => {
        const q = inp.dataset.q, gap = inp.closest(".gap");
        if (st.answers[q] != null) inp.value = st.answers[q];
        gap.classList.toggle("filled", !!inp.value);
        inp.addEventListener("input", () => { gap.classList.toggle("filled", !!inp.value); setAnswer(q, inp.value); });
        inp.addEventListener("change", () => { gap.classList.toggle("filled", !!inp.value); setAnswer(q, inp.value); });
        inp.disabled = locked(q);
      });
      // radio mcq + pills
      root.querySelectorAll(".q[data-q]:not([data-multi])").forEach(qel => {
        const q = qel.dataset.q;
        qel.querySelectorAll(".opt, .pill").forEach(o => {
          o.classList.toggle("sel", st.answers[q] === o.dataset.v);
          o.onclick = (e) => {
            e.preventDefault();
            if (locked(q)) return;
            st.answers[q] = st.answers[q] === o.dataset.v ? "" : o.dataset.v;
            qel.querySelectorAll(".opt, .pill").forEach(x => x.classList.toggle("sel", st.answers[q] === x.dataset.v));
            setAnswer(q, st.answers[q]);
          };
        });
      });
      // multi-select
      root.querySelectorAll(".q[data-multi]").forEach(qel => {
        const qs = qel.dataset.multi.split(",");
        const k = "m" + qs[0];
        const picks = () => st.answers[k] || [];
        const paint = () => qel.querySelectorAll(".opt").forEach(x => x.classList.toggle("sel", picks().includes(x.dataset.v)));
        paint();
        qel.querySelectorAll(".opt").forEach(o => o.onclick = (e) => {
          e.preventDefault();
          if (st.revealed || qs.every(q => st.marks[q] === true)) return;
          let p = picks().slice();
          if (p.includes(o.dataset.v)) p = p.filter(x => x !== o.dataset.v);
          else if (p.length < qs.length) p.push(o.dataset.v);
          st.answers[k] = p;
          qs.forEach((q, i) => { st.answers[q] = p[i] || ""; delete st.marks[q]; });
          qel.classList.remove("ok", "bad");
          save(); paint(); paintNums();
        });
      });
      markAll(root);
    }

    // Before reveal: only green/red from st.marks, never the key. After reveal: show keys too.
    function markAll(root) {
      const cls = (q) => st.marks[q] === true ? "ok" : st.marks[q] === false ? "bad" : null;
      root.querySelectorAll(".gap[data-q]").forEach(gap => {
        const q = +gap.dataset.q, c = cls(q);
        if (c) gap.classList.add(c);
        if (st.revealed && c !== "ok" && !gap.nextElementSibling?.classList.contains("key"))
          gap.insertAdjacentHTML("afterend", `<span class="key">→ ${esc(displayAns(data.answers[q]))}</span>`);
      });
      root.querySelectorAll(".q[data-q]").forEach(qel => {
        const multi = qel.dataset.multi;
        if (multi) {
          const qs = multi.split(",").map(Number), keys = qs.map(x => norm(data.answers[x]));
          if (qs.every(q => st.marks[q] != null)) qel.classList.add(qs.every(q => st.marks[q]) ? "ok" : "bad");
          qel.querySelectorAll(".opt").forEach(o => {
            const v = norm(o.dataset.v), picked = (st.answers["m" + qs[0]] || []).map(norm).includes(v);
            if (st.revealed && keys.includes(v)) o.classList.add("right");
            else if (picked && qs.some(q => st.marks[q] != null) && !keys.includes(v)) o.classList.add("wrong");
          });
          return;
        }
        const q = +qel.dataset.q, c = cls(q);
        if (c) qel.classList.add(c);
        if (qel.classList.contains("match-row")) return;
        const key = variants(data.answers[q]);
        qel.querySelectorAll(".opt, .pill").forEach(o => {
          if (st.revealed && key.includes(norm(o.dataset.v))) o.classList.add("right");
          else if (c === "bad" && st.answers[q] === o.dataset.v) o.classList.add("wrong");
          else if (c === "ok" && st.answers[q] === o.dataset.v) o.classList.add("right");
        });
      });
    }

    function showPart(i) {
      st.part = i; save();
      const sec = sections[i], qs = sectionQs(sec);
      shell.querySelector(".ttl").textContent = `${label} ${num(i)}`;
      shell.querySelector(".range").textContent = `· Câu ${qs[0]}–${qs[qs.length - 1]}`;
      shell.querySelector(".sub").textContent = sec.title || "";
      const qPane = h(`<div class="pane"></div>`);
      sec.groups.forEach(g => qPane.append(renderGroup(g)));
      closeNotePop();
      if (skill === "reading") {
        const pPane = h(`<div class="pane passage"></div>`);
        pPane.innerHTML = sec.text;
        panes.replaceChildren(pPane, qPane);
        enableNotes(pPane, `${key}:notes:p${i}`);
        pPane.addEventListener("scroll", closeNotePop);
      } else {
        panes.replaceChildren(qPane);
        const src = encodeURI(book.audioDir + sec.audio);
        if (!audio.src.endsWith(src)) { audio.src = src; audio.load(); }
      }
      bindInputs(qPane);
      enableNotes(qPane, `${key}:notes:q${i}`);
      qPane.addEventListener("scroll", closeNotePop);
      renderChips();
      qPane.scrollTop = 0;
    }

    const resultHash = `${basePath}/result`;
    // Kiểm Tra: mark right/wrong only — keys stay hidden so the learner can try again.
    function check() {
      allQs.forEach(q => { if (hasAnswer(q)) st.marks[q] = isRight(q); else delete st.marks[q]; if (st.marks[q] === false && st.wrongEver[q] == null) { const mg = multiGroups.find(g => g.qs.includes(q)); st.wrongEver[q] = String(mg ? multiAssign(mg)[q].pick : st.answers[q]); } });
      st.score = allQs.filter(isRight).length;
      st.tries++;
      save();
      showPart(st.part);
      showCheckPopup();
      if (only != null && st.tries === 1 && st.score / allQs.length >= 0.8) fireworks();
    }
    function reveal() {
      if (!confirm("Xem đáp án sẽ hiện toàn bộ đáp án đúng và transcript. Tiếp tục?")) return;
      allQs.forEach(q => { st.marks[q] = isRight(q); });
      st.score = allQs.filter(isRight).length;
      st.revealed = true; save();
      location.hash = resultHash;
    }
    function retry() {
      st.answers = {}; st.marks = {}; st.wrongEver = {}; st.revealed = false; st.tries = 0; st.score = null; st.part = 0; save();
      store.del(key + ":time");
      location.hash = basePath;
      route();
    }
    function showCheckPopup() {
      document.querySelectorAll(".modal").forEach(m => m.remove());
      const right = allQs.filter(q => st.marks[q] === true).length;
      const blank = allQs.filter(q => !hasAnswer(q)).length;
      const wrong = allQs.length - right - blank;
      const done = right === allQs.length;
      const m = h(`<div class="modal"><div class="modal-card">
        <img src="assets/logo-cut.png" alt="">
        <div class="big">${right}/${allQs.length}</div>
        <div class="band">${only == null ? `Band ước tính: <b>${bandOf(right).toFixed(1)}</b> · ` : `${label} ${only + 1} · `}lần thử ${st.tries}</div>
        <div class="mini-stats"><span class="c1">✓ ${right} đúng</span><span class="c3">✕ ${wrong} sai</span><span class="c2">– ${blank} bỏ trống</span></div>
        <p class="hint">${only != null && st.tries === 1 && right / allQs.length >= 0.8 ? "🎆 Lần đầu đã " + right + "/" + allQs.length + " – Mập đỉnh quá! 🎆<br>" : ""}${done ? "Đúng hết rồi! Giỏi quá 🎀" : "Câu <b style='color:var(--bad)'>đỏ</b> là câu sai — sửa lại rồi bấm <b>Kiểm Tra</b> lần nữa nhé. Đáp án vẫn được giấu."}</p>
        <div class="btns">
          ${done ? "" : `<button class="primary" data-a="fix">Sửa câu sai</button>`}
          <button data-a="reveal"${done ? ' class="primary"' : ""}>Xem đáp án & transcript</button>
        </div>
      </div></div>`);
      m.onclick = (e) => {
        const a = e.target.dataset.a;
        if (e.target === m || a === "fix") {
          m.remove();
          const firstBad = allQs.find(q => st.marks[q] === false);
          if (firstBad) goTo(firstBad);
        }
        if (a === "reveal") { m.remove(); reveal(); }
      };
      document.body.append(m);
    }
    const checkBtn = shell.querySelector(".check");
    if (st.revealed) checkBtn.textContent = "Kết quả";
    checkBtn.onclick = () => {
      if (st.revealed) { location.hash = resultHash; return; }
      const blank = allQs.filter(q => !hasAnswer(q)).length;
      if (st.tries === 0 && blank && !confirm(`Còn ${blank} câu chưa làm. Vẫn kiểm tra?`)) return;
      check();
    };

    if (isResult && st.revealed) { clearInterval(timerId); return renderResults(); }
    showPart(Math.min(st.part, sections.length - 1));

    // ---------- results page ----------
    // the line of question text around question q (blank shown as ______)
    function contextFor(g, q) {
      if (g.type === "mcq" || g.type === "choice" || g.type === "match") {
        const it = g.items.find(x => x.q === q);
        return it ? it.text.replace(/<[^>]+>/g, "") : "";
      }
      if (g.type === "multi") return g.text.replace(/<[^>]+>/g, "");
      const tmp = document.createElement("div");
      tmp.innerHTML = g.html.replace(/<i>Example<\/i>\s*<br>/g, "").replace(/<br\s*\/?>/g, " ").replace(/\[\[(\d+)\]\]/g, (_, n) => `<span class="ctx-gap" data-n="${n}"></span>`);
      const gap = tmp.querySelector(`.ctx-gap[data-n="${q}"]`);
      if (!gap) return "";
      let el = gap.closest("li, td, p, .flow > div, h4") || gap.parentElement;
      // nested list item: only its own line
      const copy = el.cloneNode(true);
      copy.querySelectorAll("ul, ol").forEach(x => x.remove());
      copy.querySelectorAll(".ctx-gap").forEach(x => x.replaceWith(x.dataset.n == q ? " ______ " : " … "));
      let txt = copy.textContent.replace(/\s+/g, " ").trim();
      if (el.tagName === "TD") {
        const label = el.parentElement.firstElementChild;
        if (label && label !== el) txt = label.textContent.replace(/\s+/g, " ").trim().replace(/:$/, "") + ": " + txt;
      }
      return txt;
    }
    // "B" -> "B. option text" for letter answers
    function explainLetter(g, q, letter) {
      if (!letter) return "";
      const L = String(letter).trim().toUpperCase();
      if (g.type === "mcq") { const it = g.items.find(x => x.q === q); const i = LETTERS.indexOf(L); return it && it.options[i] ? `${L}. ${it.options[i]}` : letter; }
      if (g.type === "multi") { const i = LETTERS.indexOf(L); return g.options[i] ? `${L}. ${g.options[i]}` : letter; }
      if (g.box) { const b = g.box.find(([k]) => k.toUpperCase() === L || k === letter); return b ? `${b[0]}. ${b[1]}` : letter; }
      return letter;
    }

    function renderResults() {
      document.title = `Kết quả ${SKILL_NAMES[skill]} · C${book.id} T${test.n}`;
      const right = allQs.filter(isRight).length;
      const skipped = allQs.filter(q => !hasAnswer(q)).length;
      const wrong = allQs.length - right - skipped;
      const band = bandOf(right);
      const pct = n => (n / allQs.length * 100).toFixed(1) + "%";
      const msg = band >= 7 ? "Xuất sắc! Mập giỏi quá trời luôn 🎀"
        : band >= 5.5 ? "Làm tốt lắm! Cố thêm chút nữa là lên band rồi 💪"
        : "Không sao đâu, ai giỏi IELTS cũng từng \"lụm\" điểm như này";
      const hasScript = skill === "listening" && sections.some(s => s.script);
      const leftLabel = skill === "listening" ? ["Câu transcript", "Toàn bộ script"] : ["Bài đọc", null];

      const page = h(`<div class="results">
        <div class="res-top">
          <div class="res-nav">
            <a class="res-back" href="${basePath}">← Quay về bài làm</a>
            <div class="res-actions"><a class="res-btn" href="#/">Trang chủ</a><button class="res-btn" data-a="retry">Làm lại</button></div>
          </div>
          <div class="res-hero">
            <div><div class="res-kicker">Kết quả bài · ${esc(book.title)} – Test ${test.n}</div><div class="res-title">${SKILL_NAMES[skill]}${only == null ? "" : ` · ${label} ${only + 1}`}</div></div>
            <div class="res-mascot"><div class="bubble">${msg}</div><img src="assets/logo-cut.png" alt=""></div>
          </div>
          <div class="res-stats${only == null ? "" : " three"}">
            <div class="stat"><span class="ic ok">✓</span><b>${right}</b><span>câu đúng</span><em class="c-ok">${pct(right)}</em></div>
            <div class="stat"><span class="ic skip">–</span><b>${skipped}</b><span>câu bỏ qua</span><em class="c-skip">${pct(skipped)}</em></div>
            <div class="stat"><span class="ic bad">✕</span><b>${wrong}</b><span>câu sai</span><em class="c-bad">${pct(wrong)}</em></div>
            ${only == null ? `<div class="stat"><span class="ic band">★</span><b>${band.toFixed(1)}</b><span>Band IELTS</span><em class="c-band">ước tính</em></div>` : ""}
          </div>
        </div>
        <div class="res-detail">
          <div class="res-tabbar"><span class="res-tab on">📖 Bài giải chi tiết</span></div>
          <div class="res-cols">
            <div class="res-left">
              <div class="res-subtabs">
                <button class="on" data-v="q">${skill === "listening" ? "🔊 " : "📄 "}${leftLabel[0]}</button>
                ${leftLabel[1] ? `<button data-v="all">📄 ${leftLabel[1]}</button>` : ""}
              </div>
              ${skill === "listening" ? `<div class="res-audio">
                <button class="play" title="Phát">${icon.play}</button>
                <button class="ibtn" data-act="back10" title="Lùi 10 giây">−10s</button>
                <span class="time cur">00:00</span>
                <div class="seek"><i></i></div>
                <span class="time dur">00:00</span>
                <button class="ibtn" data-act="rate" title="Tốc độ">1x</button>
                <audio preload="metadata"></audio>
              </div>` : ""}
              <div class="res-left-body"></div>
            </div>
            <div class="res-right">
              <div class="res-parts"></div>
              <div class="res-right-body"></div>
            </div>
          </div>
        </div>
      </div>`);
      app.replaceChildren(page);
      page.querySelector('[data-a="retry"]').onclick = () => { if (confirm("Xoá bài làm và làm lại từ đầu?")) retry(); };

      let part = 0, leftView = "q";
      const leftBody = page.querySelector(".res-left-body"), rightBody = page.querySelector(".res-right-body");
      const partsEl = page.querySelector(".res-parts");

      // audio replay for the part being reviewed
      const resAudio = page.querySelector(".res-audio audio");
      if (resAudio) {
        const bar = page.querySelector(".res-audio"), playBtn = bar.querySelector(".play");
        const cur = bar.querySelector(".cur"), dur = bar.querySelector(".dur");
        const seek = bar.querySelector(".seek"), fill = seek.querySelector("i");
        const rates = [0.75, 1, 1.25, 1.5];
        playBtn.onclick = () => resAudio.paused ? resAudio.play() : resAudio.pause();
        resAudio.onplay = () => playBtn.innerHTML = icon.pause;
        resAudio.onpause = () => playBtn.innerHTML = icon.play;
        resAudio.onloadedmetadata = () => dur.textContent = fmt(resAudio.duration);
        resAudio.ontimeupdate = () => { cur.textContent = fmt(resAudio.currentTime); fill.style.width = (resAudio.currentTime / resAudio.duration * 100 || 0) + "%"; };
        seek.onclick = (e) => { const r = seek.getBoundingClientRect(); if (resAudio.duration) resAudio.currentTime = (e.clientX - r.left) / r.width * resAudio.duration; };
        bar.querySelector('[data-act="back10"]').onclick = () => { resAudio.currentTime = Math.max(0, resAudio.currentTime - 10); };
        const rateBtn = bar.querySelector('[data-act="rate"]');
        rateBtn.onclick = () => { const i = (rates.indexOf(resAudio.playbackRate) + 1) % rates.length; resAudio.playbackRate = rates[i]; rateBtn.textContent = rates[i] + "x"; };
      }
      const loadPartAudio = () => {
        if (!resAudio) return;
        const src = encodeURI(book.audioDir + sections[part].audio);
        if (!resAudio.src.endsWith(src)) {
          const rate = resAudio.playbackRate;
          resAudio.src = src; resAudio.load(); resAudio.playbackRate = rate;
          page.querySelector(".res-audio .cur").textContent = "00:00";
          page.querySelector(".res-audio .seek i").style.width = "0";
        }
      };

      page.querySelectorAll(".res-subtabs button").forEach(b => b.onclick = () => {
        leftView = b.dataset.v;
        page.querySelectorAll(".res-subtabs button").forEach(x => x.classList.toggle("on", x === b));
        drawLeft();
      });

      function userAns(q, g) {
        if (g.type === "multi") {
          return multiAssign(g)[q].pick;
        }
        return st.answers[q] ?? "";
      }
      function drawLeft() {
        const sec = sections[part];
        if (skill === "reading") {
          leftBody.innerHTML = `<div class="res-passage">${sec.text}</div>`;
          return;
        }
        if (!hasScript || !sec.script) {
          leftBody.innerHTML = `<div class="res-empty">Transcript cho phần này đang được cập nhật…</div>`;
          return;
        }
        const tmp = document.createElement("div");
        tmp.innerHTML = sec.script;
        if (leftView === "all") {
          leftBody.innerHTML = `<div class="res-label">${label.toUpperCase()} ${num(part)}</div><div class="res-script">${sec.script}</div>`;
          return;
        }
        let out = `<div class="res-label">${label.toUpperCase()} ${num(part)}</div>`;
        for (const q of sectionQs(sec)) {
          const marks = [...tmp.querySelectorAll(`[data-q~="${q}"]`)];
          const lines = [...new Set(marks.map(m => m.closest("p") || m.parentElement))];
          const html = lines.length ? lines.map(l => {
            const c = l.cloneNode(true);
            c.querySelectorAll("[data-q]").forEach(x => { if (!x.dataset.q.split(" ").includes(String(q))) x.replaceWith(...x.childNodes); });
            return c.innerHTML;
          }).join(" … ") : `<span class="muted">(không có đoạn trích riêng)</span>`;
          out += `<div class="tq" data-tq="${q}"><span class="tq-n">Q${q}</span><p>${html}</p></div>`;
        }
        leftBody.innerHTML = out;
      }
      const entryInfo = {};
      function drawRight() {
        const sec = sections[part];
        const qs = sectionQs(sec);
        const ok = qs.filter(isRight).length;
        partsEl.innerHTML = `${sections.map((_, i) => `<button class="res-chip${i === part ? " on" : ""}" data-p="${i}">${label.toUpperCase()} ${num(i)}</button>`).join("")}<span class="res-line"></span><span class="res-count">${ok}/${qs.length} đúng</span>`;
        partsEl.querySelectorAll(".res-chip").forEach(b => b.onclick = () => { part = +b.dataset.p; draw(); });
        let out = "";
        for (const g of sec.groups) {
          const qs2 = groupQs(g);
          for (const q of qs2) {
            const status = isRight(q) ? "ok" : (g.type === "multi" ? ((st.answers["m" + g.qs[0]] || []).length ? "bad" : "skip") : (hasAnswer(q) ? "bad" : "skip"));
            const icon = { ok: "✓", bad: "✕", skip: "–" }[status];
            const ua = userAns(q, g);
            const key2 = displayAns(data.answers[q]);
            const isLetter = ["mcq", "multi", "match"].includes(g.type) || (g.type === "html" && g.letters);
            const keyShow = isLetter ? explainLetter(g, q, key2) : key2.replace(/\(([^)]*)\)/g, "$1");
            const alts = String(data.answers[q]).split("|");
            const keyFull = isLetter ? keyShow : alts.slice(0, 2).join(" / ");
            const uaShow = status === "skip" ? `<i>bỏ qua</i>` : `<span class="ua">${esc(ua)}</span>`;
            const firstWrong = st.wrongEver[q];
            const needNote = status === "bad" || firstWrong != null;
            const eid = `${book.id}-${test.n}-${skill}-${q}`;
            const ent = errlog.get()[eid] || {};
            const ctx = contextFor(g, q);
            out += `<div class="rq ${status}${firstWrong != null && status === "ok" ? " fixed" : ""}" data-rq="${q}">
              <div class="rq-head"><span class="rq-ic">${icon}</span><span class="rq-n">Q${q}</span>${status === "ok" ? "" : uaShow}<span class="rq-key">${esc(keyFull)}</span>${firstWrong != null && status === "ok" ? `<span class="rq-first">lần đầu sai: <s>${esc(firstWrong)}</s></span>` : ""}</div>
              <div class="rq-ctx">${esc(ctx)}</div>
              ${needNote ? `<div class="rq-note" data-eid="${eid}">
                <select data-f="type"><option value="">Loại lỗi…</option>${ERROR_TYPES.map(x => `<option${ent.type === x ? " selected" : ""}>${x}</option>`).join("")}</select>
                <textarea data-f="note" rows="2" placeholder="Vì sao sai? (vd: nghe nhầm 'fifteen' thành 'fifty', không biết từ 'irrigation'…)">${esc(ent.note || "")}</textarea>
              </div>` : ""}
            </div>`;
            entryInfo[eid] = { id: eid, book: book.id, test: test.n, skill, part: num(sections.indexOf(sec)), q, question: ctx,
              yourAnswer: status === "skip" ? "" : String(ua), firstWrongAnswer: firstWrong ?? null, correct: keyFull, stillWrong: status !== "ok" };
          }
        }
        rightBody.innerHTML = out;
        // every wrong / once-wrong question is logged automatically; note & type are added when she writes them
        rightBody.querySelectorAll(".rq-note").forEach(box => errlog.put({ ...entryInfo[box.dataset.eid] }));
        rightBody.querySelectorAll(".rq-note").forEach(box => {
          box.onclick = (e) => e.stopPropagation();
          const saveNote = () => {
            const f = {}; box.querySelectorAll("[data-f]").forEach(x => f[x.dataset.f] = x.value.trim());
            errlog.put({ ...entryInfo[box.dataset.eid], ...f, updated: Date.now() });
          };
          box.querySelectorAll("[data-f]").forEach(x => { x.oninput = saveNote; x.onchange = saveNote; });
        });
        rightBody.querySelectorAll(".rq").forEach(c => c.onclick = () => {
          const t = leftBody.querySelector(`[data-tq="${c.dataset.rq}"]`);
          if (!t) return;
          leftBody.querySelectorAll(".tq.hl").forEach(x => x.classList.remove("hl"));
          t.classList.add("hl");
          t.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      function draw() { loadPartAudio(); drawLeft(); drawRight(); leftBody.scrollTop = 0; rightBody.scrollTop = 0; }
      draw();
      window.scrollTo(0, 0);
    }
  }

  // ---------- writing ----------
  function renderWriting(app, book, test) {
    const key = `ielts:${book.id}:${test.n}:writing`;
    const saved = store.get(key, { task: 0, text: {} });
    document.title = `C${book.id} T${test.n} Writing · IELTS cho Mập`;
    const shell = h(`<div class="shell">
      <div class="topbar"><div class="row">
        <a class="ibtn" href="#/" title="Quay lại">${icon.back}</a>
        <div class="parts"></div>
        ${toolsHtml('<span class="wc timer-free"></span>')}
      </div></div>
      <div class="sheet">
        <div class="sheet-head"><div><b class="ttl"></b> <span class="range"></span></div><div class="src">${esc(book.title)} – Test ${test.n}</div></div>
        <div class="panes"></div>
      </div>
    </div>`);
    app.replaceChildren(shell);
    wireTools(shell);
    startTimer(shell.querySelector(".timer"), key + ":time", 3600);
    const show = (i) => {
      saved.task = i; store.set(key, saved);
      const t = test.writing[i];
      shell.querySelector(".ttl").textContent = `Writing Task ${t.task}`;
      shell.querySelector(".range").textContent = `· ${t.minutes} phút · tối thiểu ${t.words} từ`;
      const parts = shell.querySelector(".parts");
      parts.replaceChildren(...test.writing.map((w, j) => { const c = h(`<button class="chip${j === i ? " on" : ""}">TASK ${w.task}</button>`); c.onclick = () => show(j); return c; }));
      const left = h(`<div class="pane passage">${t.prompt}${t.image ? `<img class="fig" src="${t.image}" alt="" style="max-width:100%;display:block;margin:10px auto;background:#fff">` : ""}</div>`);
      const right = h(`<div class="pane"><div class="write-wrap"><textarea placeholder="Viết bài ở đây…"></textarea></div></div>`);
      const ta = right.querySelector("textarea"), wc = shell.querySelector(".wc");
      ta.value = saved.text[i] || "";
      const count = () => { const n = (ta.value.match(/\S+/g) || []).length; wc.textContent = `${n} từ`; wc.style.color = n >= t.words ? "var(--ok)" : ""; };
      ta.oninput = () => { saved.text[i] = ta.value; store.set(key, saved); count(); };
      count();
      shell.querySelector(".panes").replaceChildren(left, right);
      closeNotePop();
      enableNotes(left, `${key}:notes:${i}`);
    };
    show(saved.task || 0);
  }

  // ---------- speaking ----------
  function renderSpeaking(app, book, test) {
    document.title = `C${book.id} T${test.n} Speaking · IELTS cho Mập`;
    const shell = h(`<div class="shell">
      <div class="topbar"><div class="row">
        <a class="ibtn" href="#/" title="Quay lại">${icon.back}</a>
        <div class="parts"><span class="chip on">SPEAKING</span></div>
        ${toolsHtml()}
      </div></div>
      <div class="sheet">
        <div class="sheet-head"><div><b>Speaking</b> <span class="range">· Part 1 – 3</span></div><div class="src">${esc(book.title)} – Test ${test.n}</div></div>
        <div class="panes"><div class="pane"><div class="group"><div class="group-body">${test.speaking}</div></div></div></div>
      </div>
    </div>`);
    app.replaceChildren(shell);
    wireTools(shell);
    startTimer(shell.querySelector(".timer"), `ielts:${book.id}:${test.n}:speaking:time`, 0);
    enableNotes(shell.querySelector(".pane"), `ielts:${book.id}:${test.n}:speaking:notes`);
  }

  // ---------- router ----------
  function route() {
    clearInterval(timerId);
    closeNotePop();
    document.querySelectorAll(".modal").forEach(m => m.remove());
    const app = document.getElementById("app");
    if (location.hash === "#/errors") return renderErrors(app);
    const [, bid, tn, skill, mode, mode2] = location.hash.split("/");
    const book = books.find(b => b.id === +bid);
    const test = book?.tests.find(t => t.n === +tn);
    if (!book || !test || !test[skill]) return renderHome(app);
    if (skill === "writing") return renderWriting(app, book, test);
    if (skill === "speaking") return renderSpeaking(app, book, test);
    renderQuiz(app, book, test, skill, mode, mode2);
  }

  return {
    addBook(b) { books.push(b); },
    // attach Listening transcripts (one HTML string per part; answers wrapped in <b data-q="n">)
    addScripts(bookId, n, scripts) {
      const t = books.find(x => x.id === bookId)?.tests.find(x => x.n === n);
      if (t?.listening) scripts.forEach((s, i) => { if (t.listening.parts[i]) t.listening.parts[i].script = s; });
    },
    // attach a Reading test to an already-added book (data/cNN-reading.js)
    addReading(bookId, n, reading) {
      const b = books.find(x => x.id === bookId);
      let t = b.tests.find(x => x.n === n);
      if (!t) { t = { n }; b.tests.push(t); b.tests.sort((a, c) => a.n - c.n); }
      t.reading = reading;
    },
    start() { applyPrefs(); window.addEventListener("hashchange", route); route(); }
  };
})();
