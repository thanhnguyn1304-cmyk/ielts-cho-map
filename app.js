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
      <div class="hero"><img src="assets/logo.png" alt=""><div><h1>IELTS cho Mập</h1><p>Cambridge IELTS 13 – 17 · Listening, Reading, Writing &amp; Speaking</p></div></div>
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
          const score = saved && saved.checked && saved.score != null ? `<span class="score">${saved.score}/40</span>` : "";
          card.querySelector(".skills").append(h(`<a class="skill" href="#/${b.id}/${t.n}/${sk}">${SKILL_NAMES[sk]}${score}</a>`));
        }
        grid.append(card);
      }
      sec.append(grid);
      wrap.append(sec);
    }
    app.replaceChildren(wrap);
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
  function renderQuiz(app, book, test, skill) {
    const data = test[skill];
    const sections = skill === "listening" ? data.parts : data.passages;
    const key = `ielts:${book.id}:${test.n}:${skill}`;
    const saved = store.get(key, {});
    const st = { part: saved.part || 0, answers: saved.answers || {}, checked: !!saved.checked, score: saved.score };
    const save = () => store.set(key, { part: st.part, answers: st.answers, checked: st.checked, score: st.score });
    const allQs = sections.flatMap(sectionQs);
    const label = skill === "listening" ? "Part" : "Passage";
    document.title = `C${book.id} T${test.n} ${SKILL_NAMES[skill]} · IELTS cho Mập`;

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
        const chip = h(`<button class="chip${i === st.part ? " on" : ""}">${label.toUpperCase()} ${i + 1}</button>`);
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
        b.classList.toggle("done", !st.checked && hasAnswer(q));
        b.classList.toggle("ok", st.checked && isRight(q));
        b.classList.toggle("bad", st.checked && !isRight(q));
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
        // "in either order": the k-th right pick counts for the k-th question
        const keys = mg.qs.map(x => norm(data.answers[x]));
        const picks = (st.answers["m" + mg.qs[0]] || []).map(norm);
        const hits = picks.filter(p => keys.includes(p)).length;
        return mg.qs.indexOf(q) < hits;
      }
      return hasAnswer(q) && variants(data.answers[q]).includes(norm(st.answers[q]));
    }
    function setAnswer(q, v) {
      st.answers[q] = v; save(); paintNums();
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
      if (g.image) body.append(h(`<img class="fig" src="${g.image}" alt="">`));

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
        inp.disabled = st.checked;
      });
      // radio mcq + pills
      root.querySelectorAll(".q[data-q]:not([data-multi])").forEach(qel => {
        const q = qel.dataset.q;
        qel.querySelectorAll(".opt, .pill").forEach(o => {
          o.classList.toggle("sel", st.answers[q] === o.dataset.v);
          o.onclick = (e) => {
            e.preventDefault();
            if (st.checked) return;
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
          if (st.checked) return;
          let p = picks().slice();
          if (p.includes(o.dataset.v)) p = p.filter(x => x !== o.dataset.v);
          else if (p.length < qs.length) p.push(o.dataset.v);
          st.answers[k] = p;
          qs.forEach((q, i) => st.answers[q] = p[i] || "");
          save(); paint(); paintNums();
        });
      });
      if (st.checked) markAll(root);
    }

    function markAll(root) {
      root.querySelectorAll(".gap[data-q]").forEach(gap => {
        const q = +gap.dataset.q, ok = isRight(q);
        gap.classList.add(ok ? "ok" : "bad");
        if (!ok && !gap.nextElementSibling?.classList.contains("key")) gap.insertAdjacentHTML("afterend", `<span class="key">→ ${esc(displayAns(data.answers[q]))}</span>`);
      });
      root.querySelectorAll(".q[data-q]").forEach(qel => {
        const multi = qel.dataset.multi;
        if (multi) {
          const qs = multi.split(",").map(Number), keys = qs.map(x => norm(data.answers[x]));
          qel.classList.add(qs.every(isRight) ? "ok" : "bad");
          qel.querySelectorAll(".opt").forEach(o => {
            const v = norm(o.dataset.v), picked = (st.answers["m" + qs[0]] || []).map(norm).includes(v);
            if (keys.includes(v)) o.classList.add("right"); else if (picked) o.classList.add("wrong");
          });
          return;
        }
        const q = +qel.dataset.q;
        if (qel.classList.contains("match-row")) { qel.classList.add(isRight(q) ? "ok" : "bad"); return; }
        qel.classList.add(isRight(q) ? "ok" : "bad");
        const key = variants(data.answers[q]);
        qel.querySelectorAll(".opt, .pill").forEach(o => {
          if (key.includes(norm(o.dataset.v))) o.classList.add("right");
          else if (st.answers[q] === o.dataset.v) o.classList.add("wrong");
        });
      });
    }

    function showPart(i) {
      st.part = i; save();
      const sec = sections[i], qs = sectionQs(sec);
      shell.querySelector(".ttl").textContent = `${label} ${i + 1}`;
      shell.querySelector(".range").textContent = `· Câu ${qs[0]}–${qs[qs.length - 1]}`;
      shell.querySelector(".sub").textContent = sec.title || "";
      const qPane = h(`<div class="pane"></div>`);
      sec.groups.forEach(g => qPane.append(renderGroup(g)));
      if (skill === "reading") {
        const pPane = h(`<div class="pane passage"></div>`);
        pPane.innerHTML = sec.text;
        panes.replaceChildren(pPane, qPane);
      } else {
        panes.replaceChildren(qPane);
        const src = encodeURI(book.audioDir + sec.audio);
        if (!audio.src.endsWith(src)) { audio.src = src; audio.load(); }
      }
      bindInputs(qPane);
      renderChips();
      qPane.scrollTop = 0;
    }

    function check() {
      st.checked = true;
      st.score = allQs.filter(isRight).length;
      save();
      showPart(st.part);
      showResult();
    }
    function showResult() {
      const m = h(`<div class="modal"><div class="modal-card">
        <img src="assets/logo.png" alt="">
        <div class="big">${st.score}/${allQs.length}</div>
        <div class="band">Band ước tính: <b>${bandFor(skill, st.score)}</b></div>
        <div class="btns"><button class="primary" data-a="review">Xem đáp án</button><button data-a="retry">Làm lại</button></div>
      </div></div>`);
      m.onclick = (e) => {
        const a = e.target.dataset.a;
        if (e.target === m || a === "review") m.remove();
        if (a === "retry") {
          m.remove();
          st.answers = {}; st.checked = false; st.score = null; save();
          store.del(key + ":time");
          startTimer(shell.querySelector(".timer"), key + ":time", skill === "reading" ? 3600 : 0);
          shell.querySelector(".check").textContent = "Kiểm Tra";
          showPart(0);
        }
      };
      document.body.append(m);
    }
    const checkBtn = shell.querySelector(".check");
    if (st.checked) checkBtn.textContent = "Kết quả";
    checkBtn.onclick = () => {
      if (st.checked) return showResult();
      const blank = allQs.filter(q => !hasAnswer(q)).length;
      if (blank && !confirm(`Còn ${blank} câu chưa làm. Vẫn kiểm tra?`)) return;
      checkBtn.textContent = "Kết quả";
      check();
    };

    showPart(Math.min(st.part, sections.length - 1));
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
  }

  // ---------- router ----------
  function route() {
    clearInterval(timerId);
    document.querySelectorAll(".modal").forEach(m => m.remove());
    const app = document.getElementById("app");
    const [, bid, tn, skill] = location.hash.split("/");
    const book = books.find(b => b.id === +bid);
    const test = book?.tests.find(t => t.n === +tn);
    if (!book || !test || !test[skill]) return renderHome(app);
    if (skill === "writing") return renderWriting(app, book, test);
    if (skill === "speaking") return renderSpeaking(app, book, test);
    renderQuiz(app, book, test, skill);
  }

  return {
    addBook(b) { books.push(b); },
    start() { applyPrefs(); window.addEventListener("hashchange", route); route(); }
  };
})();
