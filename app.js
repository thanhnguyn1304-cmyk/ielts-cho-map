/* IELTS cho Mập — test player. Book data files call IELTS.addBook({...}). */
const IELTS = (() => {
  const books = [];
  const BOOK_GROUPS = [
    { key: "cam", label: "📚 Cambridge", ids: [13, 14, 15, 16, 17, 18, 19, 20, 21] },
    { key: "vol", label: "🗂️ VOL", ids: [201, 202, 203, 204, 205, 206, 207, 208, 209] },
    { key: "recent", label: "📝 Recent Tests", ids: [101] }
  ];
  const ALL_BOOKS = BOOK_GROUPS.flatMap(g => g.ids);
  const bookShort = (id) => id >= 200 ? `VOL ${id - 200}` : id > 100 ? "Recent Tests" : `Cam ${id}`;
  const bookFull = (id) => id >= 200 ? `VOL ${id - 200}` : id > 100 ? "Recent Reading Tests" : `Cambridge ${id}`;
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
  const QUESTION_TYPE_OVERRIDES = {};

  const MATCHING_LABEL_OVERRIDES = {
    "13:2:listening:3": "Matching comments",
    "13:3:listening:2": "Matching benefits",
    "13:3:listening:3": "Matching problems",
    "13:4:listening:2": "Matching information",
    "14:1:listening:2": "Matching policy details",
    "14:1:listening:3": "Matching decisions",
    "14:2:listening:3": "Matching actions",
    "14:3:listening:2": "Matching people to outcomes",
    "14:3:listening:3": "Matching people to problems",
    "14:4:listening:1": "Matching facility details",
    "14:4:listening:2": "Matching excursion details",
    "14:4:listening:3": "Matching comments",
    "15:1:listening:3": "Matching research findings",
    "15:2:listening:3": "Matching novels to topics",
    "15:3:listening:3": "Matching decisions",
    "15:4:listening:3": "Matching people to topics",
    "16:2:listening:2": "Matching service details",
    "16:3:listening:2": "Matching job details",
    "16:4:listening:3": "Matching opinions",
    "17:1:listening:3": "Matching opinions",
    "17:2:listening:2": "Matching activities to locations",
    "17:2:listening:3": "Matching opinions",
    "17:3:listening:2": "Matching activity details",
    "17:3:listening:3": "Matching skill features",
    "17:4:listening:2": "Matching staff-retention methods to hotels",
    "17:4:listening:3": "Matching comments",
    "204:3:listening:2": "Matching collection information",
    "204:3:listening:3": "Matching analysis methods to features",
    "204:5:listening:2": "Matching building purposes",
    "204:5:listening:3": "Matching student comments",
    "204:6:listening:2": "Matching fire-safety comments",
    "204:6:listening:3": "Matching pigeon features",
    "204:7:listening:3": "Matching farmers' attitudes",
    "204:8:listening:3": "Matching interview problems",
    "204:10:listening:2": "Matching site information",
    "204:10:listening:3": "Matching writers' uses of walking",
    "204:1:listening:1": "Matching hotel details",
    "202:1:listening:3": "Matching recommendations to tasks",
    "202:2:listening:2": "Matching organisations to roles",
    "202:3:listening:3": "Matching statements to situations",
    "202:4:listening:1": "Matching museums to themes",
    "202:4:listening:2": "Matching locations to features",
    "202:4:listening:3": "Matching suggestions to topics",
    "202:5:listening:3": "Matching tools to tasks",
    "202:5:listening:4": "Matching speakers to opinions",
    "202:6:listening:3": "Matching research components to descriptions",
    "202:8:listening:3": "Matching pictures to descriptions",
    "202:9:listening:3": "Matching project aspects to opinions",
    "202:10:listening:2": "Matching statements to choirs",
    "202:10:listening:3": "Matching countries to attractions"
  };

  function questionTypeLabels(sec, book, test, skill, part) {
    const labels = [];
    const add = (label) => { if (!labels.includes(label)) labels.push(label); };
    const sectionOverride = QUESTION_TYPE_OVERRIDES[`${book.id}:${test.n}:${skill}:${part}`];
    if (sectionOverride) return [...new Set(sectionOverride)];
    for (const [groupIndex, g] of (sec.groups || []).entries()) {
      const groupOverride = QUESTION_TYPE_OVERRIDES[`${book.id}:${test.n}:${skill}:${part}:${groupIndex + 1}`];
      if (groupOverride) {
        for (const label of groupOverride) add(label);
        continue;
      }
      const instr = String(g.instr || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").toLowerCase();
      const detail = `${instr} ${String(g.heading || "").toLowerCase()} ${String(g.text || "").replace(/<[^>]*>/g, " ").toLowerCase()}`;
      if (/heading|headings/.test(detail) && /match|choose|list/.test(detail)) add("Matching headings");
      else if (/which paragraph|which section|paragraph contains|section contains|match.*information|information.*paragraph|match.*paragraph|match.*section/.test(detail)) add("Matching information");
      else if (/sentence endings|correct ending|match.*ending/.test(detail)) add("Matching sentence endings");
      else if (/match.*(person|people|researcher|expert|feature|statement)|which person|who.*agree|who.*believe/.test(detail)) add("Matching features");
      else if (/true.*false.*not given|true.*false.*no information|agree with the information/.test(detail)) add("True / False / Not Given");
      else if (/yes.*no.*not given|agree with the claims|views of the writer/.test(detail)) add("Yes / No / Not Given");
      else if (/label.*(map|plan)|(map|plan).*label/.test(detail)) add("Map / plan labelling");
      else if (/label.*diagram|diagram.*label/.test(detail)) add("Diagram labelling");
      else if (/complete.*(notes|form|table|flow.?chart|summary|sentences|sentence|record|outline)/.test(detail)) {
        let kind = detail.match(/(notes|form|table|flow.?chart|summary|sentences|sentence|record|outline)/)?.[1] || "";
        kind = kind.replace(/[-\s]?chart$/, " chart").replace(/sentences/, "sentence").replace(/\s+/g, " ").trim();
        add(kind ? `${kind[0].toUpperCase()}${kind.slice(1)} completion` : "Completion");
      } else if (/short.?answer|answer the questions below/.test(detail)) add("Short-answer questions");
      else if (g.type === "mcq") add("Multiple choice");
      else if (g.type === "multi") add("Multiple choice (select more than one)");
      else if (g.type === "choice") add("Multiple choice");
      else if (g.type === "match") add("Matching features");
      else if (g.type === "html") add("Gap-fill completion");
    }
    const specificMatch = MATCHING_LABEL_OVERRIDES[`${book.id}:${test.n}:${skill}:${part}`];
    if (specificMatch) {
      const genericIndex = labels.indexOf("Matching features");
      if (genericIndex >= 0) labels[genericIndex] = specificMatch;
      else add(specificMatch);
    }
    return labels;
  }

  function questionTypeCategory(label) {
    if (/^matching headings/i.test(label)) return "Matching headings";
    if (/^matching information/i.test(label)) return "Matching information";
    if (/^matching sentence endings/i.test(label)) return "Matching sentence endings";
    if (/^matching/i.test(label)) return "Matching features";
    if (/^true \/ false \/ not given/i.test(label)) return "True / False / Not Given";
    if (/^yes \/ no \/ not given/i.test(label)) return "Yes / No / Not Given";
    if (/^multiple choice \(select more than one\)/i.test(label)) return "Multiple choice (select more than one)";
    if (/^multiple choice/i.test(label)) return "Multiple choice";
    return label;
  }

  // ---------- home ----------
  // ---------- progress, streak, daily missions & score history helpers ----------
  const dateKey = (d = new Date()) => {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const today = () => dateKey(new Date());
  const MILESTONES = [
    { d: 1, icon: "🌱", title: "Yeahhhh nay Mập học rùi nè 🥺💗", desc: "Hoàn thành ngày học đầu tiên" },
    { d: 3, icon: "🔥", title: "Giỏi quáaa rùi Mậppp 😭💕", desc: "Giữ chuỗi 3 ngày liên tiếp" },
    { d: 7, icon: "🌸", title: "1 tuần luôn wowwww, em giỏi lắmmm 🥺💖", desc: "7 ngày học không nghỉ" },
    { d: 14, icon: "🎀", title: "Mập chăm quá Mập ơi anh yêu emmm 😭❤️", desc: "2 tuần bền bỉ luyện IELTS" },
    { d: 21, icon: "💎", title: "3 tuần luôn em giỏi quá huhu anh yêu em nhất 😭💗", desc: "21 ngày kiên trì mỗi ngày" },
    { d: 30, icon: "👑", title: "CHĂM ĐIÊN LUÔN I LOVE YOU SO MUCH 😭❤️‍🔥💖", desc: "30 ngày rực rỡ cùng IELTS" }
  ];

  // Cumulative mission targets per level:
  // Mission 1: 4 Listening parts, 2 Reading passages, 0 Writing
  // Mission 2: 6 Listening parts (4/6), 3 Reading passages (2/3), 1 Writing Task 1 (0/1)
  // Mission 3: 8 Listening parts (6/8), 4 Reading passages (3/4), 2 Writing tasks (1/2)
  // Mission k: (4 + 2*(k-1)) Listening, (2 + (k-1)) Reading, (k-1) Writing
  const MISSION_EMOJIS = ["🔥", "⭐", "🌸", "💎", "👑", "🚀", "🦄"];
  function missionEmoji(lvl) {
    if (lvl <= 0) return "🔥";
    return MISSION_EMOJIS[Math.min(lvl, MISSION_EMOJIS.length - 1)];
  }
  function missionSpec(lvl) {
    const k = Math.max(1, lvl);
    const l = 4 + 2 * (k - 1);
    const r = 2 + (k - 1);
    const w = k - 1;
    const wTitle = w === 1 ? "1 bài Writing Task 1" : `${w} bài Writing (Task 1 / Task 2)`;
    return { level: k, emoji: missionEmoji(k), l, r, w, wTitle };
  }
  function completedMissionLevel(dayObj) {
    if (!dayObj) return 0;
    const l = (dayObj.lParts || []).length;
    const r = (dayObj.rPassages || []).length;
    const w = dayObj.wTasks || 0;
    let lvl = 0;
    while (true) {
      const sp = missionSpec(lvl + 1);
      if (l >= sp.l && r >= sp.r && w >= sp.w) lvl++;
      else break;
    }
    if (lvl === 0 && dayObj.rewarded) return 1;
    return lvl;
  }

  function getShields() {
    const v = store.get("ielts:shields", null);
    if (v == null) { store.set("ielts:shields", 1); return 1; } // start with 1 free shield so she feels protected
    return v;
  }
  function markToday() {
    const t = today();
    const days = store.get("ielts:days", []);
    if (!days.includes(t)) { days.push(t); store.set("ielts:days", days.slice(-400)); }
    streakInfo(); // update best streak & shield state
  }
  function dailyState(day = today()) {
    const all = store.get("ielts:daily", {});
    const cur = Object.assign({ lParts: [], rPassages: [], wTasks: 0, maxLevel: 0, rewarded: false }, all[day] || {});
    return { all, cur };
  }
  function checkMissionLevelUp(all, cur, t) {
    const newLvl = completedMissionLevel(cur);
    const prevMax = cur.maxLevel || (cur.rewarded ? 1 : 0);
    let leveledUp = false;
    if (newLvl > prevMax) {
      const gained = newLvl - prevMax;
      cur.maxLevel = newLvl;
      cur.rewarded = true;
      leveledUp = true;
      store.set("ielts:shields", Math.min(3, getShields() + gained));
    }
    all[t] = cur;
    store.set("ielts:daily", all);
    return leveledUp;
  }
  function recordCompletion(book, test, skill, only, right, total, tries) {
    markToday();
    const t = today();
    const { all, cur } = dailyState(t);
    const secs = skill === "listening" ? test.listening.parts : test.reading.passages;
    const keys = only == null ? secs.map((_, i) => `${book.id}:${test.n}:p${i + 1}`) : [`${book.id}:${test.n}:p${only + 1}`];
    const target = skill === "listening" ? cur.lParts : cur.rPassages;
    for (const k of keys) if (!target.includes(k)) target.push(k);
    const missionJustDone = checkMissionLevelUp(all, cur, t);

    // Record in score history log
    const hist = store.get("ielts:history", []);
    const id = `${book.id}:${test.n}:${skill}` + (only == null ? "" : `:p${only + 1}`);
    const idx = hist.findIndex(x => x.id === id);
    const previous = idx >= 0 ? hist[idx] : null;
    const entry = {
      id, bookId: book.id, bookTitle: book.title, test: test.n, skill,
      part: only == null ? null : only + 1,
      partTitle: only == null ? "Full test" : (secs[only]?.title || `${skill === "listening" ? "Part" : "Passage"} ${only + 1}`),
      right, firstRight: previous?.firstRight ?? right, total, tries: tries || 1, ts: Date.now(), date: t
    };
    if (idx >= 0) hist[idx] = entry; else hist.unshift(entry);
    store.set("ielts:history", hist.slice(0, 500));
    if (missionJustDone) setTimeout(() => fireworks(), 300);
  }
  function dayStatusFor(d, sInfo, dailyAll) {
    const k = dateKey(d), iso = d.toISOString().slice(0, 10);
    const dayObj = dailyAll[k] || dailyAll[iso];
    const mLvl = completedMissionLevel(dayObj);
    const shielded = sInfo.shieldDays.has(k);
    const studied = sInfo.days.has(k) || sInfo.days.has(iso) || mLvl > 0 || (dayObj?.wTasks > 0) || shielded;
    const emoji = mLvl > 0 ? missionEmoji(mLvl) : studied ? "🔥" : "○";
    const title = mLvl > 0 ? `Hoàn thành Mission ${mLvl} (${emoji})` : shielded ? "Đã giữ lửa bằng 1 khiên bảo vệ (🔥 -1🛡️)" : studied ? "Đã học (🔥)" : "Chưa học";
    return { studied, mLvl, shielded, emoji, title };
  }
  function streakInfo() {
    const rawDays = store.get("ielts:days", []);
    const days = new Set(rawDays);
    const shieldDays = new Set(store.get("ielts:shieldDays", []));
    let shields = getShields();
    const t = today();
    const studiedToday = days.has(t);
    let n = 0;
    const d = new Date();
    if (!studiedToday) d.setDate(d.getDate() - 1);
    while (true) {
      const k = dateKey(d), iso = d.toISOString().slice(0, 10);
      if (days.has(k) || days.has(iso) || shieldDays.has(k)) {
        n++;
        d.setDate(d.getDate() - 1);
      } else {
        // check if the day right before this missed day was studied — if so, auto-use a shield to save her streak!
        const prev = new Date(d); prev.setDate(prev.getDate() - 1);
        const pk = dateKey(prev), piso = prev.toISOString().slice(0, 10);
        if (shields > 0 && (days.has(pk) || days.has(piso))) {
          shields--;
          shieldDays.add(k);
          store.set("ielts:shields", shields);
          store.set("ielts:shieldDays", [...shieldDays].slice(-200));
          n++;
          d.setDate(d.getDate() - 1);
        } else break;
      }
    }
    const best = Math.max(n, store.get("ielts:bestStreak", 0));
    if (best !== store.get("ielts:bestStreak", 0)) store.set("ielts:bestStreak", best);
    const nextM = MILESTONES.find(m => m.d > n) || MILESTONES[MILESTONES.length - 1];
    return { streak: n, best, shields, studiedToday, days, shieldDays, nextM };
  }
  function streak() { return streakInfo().streak; }

  function pickNextForSkill(sk, preferFull) {
    const freshPart = [], anyPart = [], freshFull = [];
    for (const b of books) for (const t of b.tests) {
      if (!t[sk]) continue;
      const ps = partScores(b, t, sk);
      if (ps.every(x => !x)) freshFull.push(`#/${b.id}/${t.n}/${sk}`);
      ps.forEach((x, i) => {
        const hsh = `#/${b.id}/${t.n}/${sk}/p${i + 1}`;
        anyPart.push(hsh);
        if (!x) freshPart.push(hsh);
      });
    }
    if (preferFull && freshFull.length) return freshFull[0];
    return freshPart[0] || anyPart[0] || "#/";
  }

  function overallStats() {
    let done = 0, right = 0, total = 0;
    for (const b of books) for (const t of b.tests) for (const sk of ["listening", "reading"]) {
      if (!t[sk]) continue;
      partScores(b, t, sk).forEach((x) => { if (x) { done++; right += x.right; total += x.total; } });
    }
    return { done, pct: total ? Math.round(right / total * 100) : null, errors: Object.keys(store.get("ielts:errlog", {})).length };
  }
  function greeting() {
    const hr = new Date().getHours();
    return hr < 11 ? "Chào buổi sáng" : hr < 14 ? "Chào buổi trưa" : hr < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  }
  const CHEERS = ["Mỗi ngày một part thôi là giỏi lắm rồi 💪", "Hôm nay mình phá đảo một đề nhé! 🎀", "Sai là để nhớ lâu hơn đó ✨",
                  "Band 7 đang chờ Mập ở phía trước 🌸", "Nghe kỹ, đọc chậm, chắc từng câu nha 🌷"];

  function openStreakModal() {
    const info = streakInfo();
    const dailyAll = store.get("ielts:daily", {});
    const days28 = [];
    const wnames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const st = dayStatusFor(d, info, dailyAll);
      days28.push({ label: d.getDate() + "/" + (d.getMonth() + 1), w: wnames[d.getDay()], ...st, isToday: i === 0 });
    }
    const m = h(`<div class="modal"><div class="modal-card streak-modal">
      <div class="sm-head">
        <div class="sm-flame">🔥 <b>${info.streak}</b> ngày liên tiếp</div>
        <div class="sm-sub">🏆 Kỷ lục: <b>${info.best} ngày</b> · 🛡️ Khiên bảo vệ: <b>${info.shields}/3</b></div>
      </div>
      <div class="sm-tip">💡 <b>Ý nghĩa biểu tượng mỗi ngày:</b><br>
        <b>🔥</b> Đã học & giữ chuỗi · <b>⭐</b> Xong Mission 1 · <b>🌸</b> Xong Mission 2 · <b>💎</b> Xong Mission 3 · <b>👑</b> Xong Mission 4+<br>
        🛡️ Nếu Mập lỡ nghỉ 1 ngày, <b>1 Khiên bảo vệ</b> sẽ tự động trừ để ngày đó vẫn giữ lửa <b>🔥</b>!</div>
      <h4 class="sm-sec">📅 Lịch học 28 ngày qua</h4>
      <div class="cal28">${days28.map(d => `<div class="cday${d.studied ? " on" : ""}${d.mLvl > 0 ? " m" + Math.min(4, d.mLvl) : ""}${d.isToday ? " today" : ""}" title="${d.label}: ${d.title}">
        <span class="cw">${d.w}</span>
        <span class="ci">${d.emoji === "○" ? "·" : d.emoji}</span>
        <span class="cd">${d.label}</span>
      </div>`).join("")}</div>
      <h4 class="sm-sec">🏅 Bộ sưu tập huy hiệu của Mập</h4>
      <div class="badge-grid">${MILESTONES.map(ms => {
        const unlocked = info.best >= ms.d;
        return `<div class="ms-badge${unlocked ? " unlocked" : ""}">
          <div class="ms-ic">${unlocked ? ms.icon : "🔒"}</div>
          <div><b>${ms.title}</b><small>${ms.desc} (${ms.d} ngày)</small></div>
        </div>`;
      }).join("")}</div>
      <button class="pick-close">Đóng</button>
    </div></div>`);
    m.onclick = (e) => { if (e.target === m || e.target.closest(".pick-close")) m.remove(); };
    document.body.append(m);
  }

  function renderHome(app) {
    document.title = "IELTS cho Mập";
    const st = overallStats(), sInfo = streakInfo(), sk = sInfo.streak, last = store.get("ielts:last", null);
    const { cur: todayMission } = dailyState(today());
    const dailyAll = store.get("ielts:daily", {});
    const doneLevel = completedMissionLevel(todayMission);
    const activeLevel = doneLevel + 1;
    const cheer = CHEERS[new Date().getDate() % CHEERS.length];
    const avail = books.filter(b => ALL_BOOKS.includes(b.id));
    let tab = store.get("ielts:tab", avail[0]?.id);
    if (!avail.some(b => b.id === tab)) tab = avail[0]?.id;

    // 7-day strip
    const wnames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const week7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dst = dayStatusFor(d, sInfo, dailyAll);
      week7.push({ w: i === 0 ? "H.nay" : wnames[d.getDay()], ...dst, isToday: i === 0 });
    }
    const msPct = Math.min(100, Math.round(sk / sInfo.nextM.d * 100));
    const todaySt = week7[week7.length - 1];

    const wrap = h(`<div class="home2">
      <header class="topnav">
        <a class="brand" href="#/"><img src="assets/logo-cut.png" alt=""><span>IELTS cho Mập</span></a>
        <nav>
          <a href="#/" class="on">🏠 Trang chủ</a>
          <a href="#/scores">📊 Lịch sử điểm</a>
          <a href="#/errors">📒 Sổ lỗi sai</a>
        </nav>
      </header>

      <section class="hero2">
        <div class="hero-text">
          <div class="hello">${greeting()}, <b>Mập</b>!</div>
          <h1>Học IELTS<br>mà vui như <span>đi chơi</span> 🌸</h1>
          <p class="cheer">${cheer}</p>
          <div class="hero-cta">
            ${last ? `<a class="cta primary" href="${esc(last.hash)}">▶ Học tiếp: ${esc(last.label)}</a>` : `<a class="cta primary" href="#library">▶ Bắt đầu học</a>`}
            <button class="cta" data-a="random">🎲 Luyện ngẫu nhiên</button>
          </div>
        </div>
        <div class="hero-art">
          <div class="blob"></div>
          <img src="assets/logo-cut.png" alt="Hello Kitty">
          <span class="spark s1">✦</span><span class="spark s2">✧</span><span class="spark s3">✦</span>
        </div>
      </section>

      <section class="stats2">
        <div class="stat2 c1" data-a="streak-modal" style="cursor:pointer" title="Bấm để xem huy hiệu & lịch học"><div class="big">${sk}<small> ngày</small></div><div class="lbl">${todaySt.emoji === "○" ? "🔥" : todaySt.emoji} Chuỗi ngày học · 🛡️${sInfo.shields} →</div></div>
        <a class="stat2 c2" href="#/scores"><div class="big">${st.done}</div><div class="lbl">📝 Phần đã làm →</div></a>
        <a class="stat2 c3" href="#/scores"><div class="big">${st.pct == null ? "–" : st.pct + "<small>%</small>"}</div><div class="lbl">🎯 Tỉ lệ đúng & Điểm →</div></a>
        <a class="stat2 c4" href="#/errors"><div class="big">${st.errors}</div><div class="lbl">📒 Lỗi đã ghi →</div></a>
      </section>

      <section class="habit-grid">
        <div class="habit-card streak-card">
          <div class="hc-top">
            <div>
              <span class="hc-badge ${todaySt.studied ? "ok" : "warn"}">${doneLevel > 0 ? `${missionEmoji(doneLevel)} Đã xong Mission ${doneLevel} hôm nay!` : todaySt.studied ? "🔥 Đã học & giữ chuỗi hôm nay!" : "⚡ Hôm nay Mập chưa học nè!"}</span>
              <h3>🔥 Chuỗi ${sk} ngày học liên tiếp</h3>
            </div>
            <button class="hc-link" data-a="streak-modal">🏅 Huy hiệu & Lịch →</button>
          </div>
          <div class="week-strip">
            ${week7.map(d => `<div class="wday${d.studied ? " on" : ""}${d.mLvl > 0 ? " m" + Math.min(4, d.mLvl) : ""}${d.isToday && !d.studied ? " pulse" : ""}" title="${d.title}">
              <div class="wi">${d.emoji}</div>
              <span>${d.w}</span>
            </div>`).join("")}
          </div>
          <div class="emoji-legend">
            <span>🔥 Đã học</span><span>⭐ Mission 1</span><span>🌸 Mission 2</span><span>💎 Mission 3</span><span>👑 Mission 4+</span>
          </div>
          <div class="ms-bar-wrap">
            <div class="ms-bar-lbl"><span>Cột mốc: <b>${sInfo.nextM.icon} ${sInfo.nextM.title}</b> (${sk}/${sInfo.nextM.d} ngày)</span><span>🛡️ ${sInfo.shields} khiên · 🏆 Kỷ lục ${sInfo.best} ngày</span></div>
            <div class="ms-bar"><i style="width:${msPct}%"></i></div>
          </div>
        </div>

        <div class="habit-card mission-card">
          <div class="hc-top">
            <div>
              <span class="hc-badge ${doneLevel > 0 ? "ok" : ""}" data-el="m-status"></span>
              <h3 data-el="m-heading"></h3>
            </div>
            <div class="m-tabs" data-el="m-tabs"></div>
          </div>
          <div class="mission-list" data-el="m-list"></div>
        </div>
      </section>

      <section class="library" id="library">
        <div class="lib-head"><h2>Thư viện đề</h2><div class="lib-groups"></div></div>
        <div class="tabs2 lib-subtabs"></div>
        <div class="lib-body"></div>
      </section>

      <footer class="foot2">Made with 💗 cho Mập · cố lên nha!</footer>
    </div>`);
    wrap.querySelectorAll('[data-a="streak-modal"]').forEach(el => el.onclick = openStreakModal);

    // Progressive Daily Missions card (Mission 1 -> Mission 2 -> Mission 3 -> Mission 4+)
    let viewLevel = activeLevel;
    function drawMissionCard() {
      const { all, cur } = dailyState(today());
      const curDoneLvl = completedMissionLevel(cur);
      const sp = missionSpec(viewLevel);
      const rawL = cur.lParts.length, rawR = cur.rPassages.length, rawW = cur.wTasks || 0;
      const doneL = Math.min(sp.l, rawL), doneR = Math.min(sp.r, rawR), doneW = Math.min(sp.w, rawW);
      const isLvlDone = viewLevel <= curDoneLvl;

      const statusEl = wrap.querySelector('[data-el="m-status"]');
      statusEl.className = "hc-badge" + (isLvlDone ? " ok" : "");
      statusEl.textContent = isLvlDone
        ? `${sp.emoji} Đã hoàn thành Mission ${sp.level}!`
        : curDoneLvl > 0
          ? `${missionEmoji(curDoneLvl)} Đã xong M${curDoneLvl} · Đang chinh phục Mission ${sp.level}`
          : `🎯 Đang làm Mission ${sp.level}`;

      wrap.querySelector('[data-el="m-heading"]').textContent = `${sp.emoji} Mission ${sp.level} hôm nay`;

      const maxTab = Math.max(4, curDoneLvl + 2, viewLevel);
      const tabsBox = wrap.querySelector('[data-el="m-tabs"]');
      tabsBox.replaceChildren();
      for (let lv = 1; lv <= maxTab; lv++) {
        const lsp = missionSpec(lv);
        const done = lv <= curDoneLvl;
        const btn = h(`<button class="m-tab${lv === viewLevel ? " on" : ""}${done ? " done" : ""}" title="Mission ${lv}: ${lsp.l} Listening parts, ${lsp.r} Reading passages${lsp.w ? `, ${lsp.w} Writing` : ""}">${done ? "✓ " : ""}${lsp.emoji} M${lv}</button>`);
        btn.onclick = () => { viewLevel = lv; drawMissionCard(); };
        tabsBox.append(btn);
      }

      const listBox = wrap.querySelector('[data-el="m-list"]');
      listBox.innerHTML = `
        <div class="m-item${doneL >= sp.l ? " done" : ""}">
          <div class="m-ic">🎧</div>
          <div class="m-body">
            <div class="m-title"><b>${sp.l === 4 ? "1 đề Listening full (hoặc 4 parts)" : `${sp.l} Listening parts`}</b> <small>${sp.level > 1 ? `(+2 parts so với M${sp.level - 1})` : "(1 full test = 4 parts)"}</small></div>
            <div class="m-segs">${Array.from({ length: sp.l }, (_, i) => `<i class="${i < doneL ? "on" : ""}"></i>`).join("")}<span>${doneL}/${sp.l} parts</span></div>
          </div>
          ${doneL >= sp.l ? `<span class="m-done-tag">✓ ${doneL}/${sp.l}</span>` : `<div class="m-acts"><a class="m-btn" href="${pickNextForSkill("listening", false)}">Làm 1 part</a><a class="m-btn full" href="${pickNextForSkill("listening", true)}">Full test</a></div>`}
        </div>
        <div class="m-item${doneR >= sp.r ? " done" : ""}">
          <div class="m-ic">📖</div>
          <div class="m-body">
            <div class="m-title"><b>${sp.r} bài Reading passage</b> <small>${sp.level > 1 ? `(+1 passage so với M${sp.level - 1})` : "(từng phần hoặc full test)"}</small></div>
            <div class="m-segs">${Array.from({ length: sp.r }, (_, i) => `<i class="${i < doneR ? "on" : ""}"></i>`).join("")}<span>${doneR}/${sp.r} passages</span></div>
          </div>
          ${doneR >= sp.r ? `<span class="m-done-tag">✓ ${doneR}/${sp.r}</span>` : `<div class="m-acts"><a class="m-btn" href="${pickNextForSkill("reading", false)}">Làm 1 bài →</a></div>`}
        </div>
        ${sp.w > 0 ? `<div class="m-item${doneW >= sp.w ? " done" : ""}">
          <div class="m-ic">✍️</div>
          <div class="m-body">
            <div class="m-title"><b>${sp.wTitle}</b> <small>(viết ở ngoài · bấm để đánh dấu)</small></div>
            <div class="m-segs">${Array.from({ length: sp.w }, (_, i) => `<i class="${i < doneW ? "on" : ""}"></i>`).join("")}<span>${doneW}/${sp.w} bài</span></div>
          </div>
          <div class="m-acts">
            ${doneW > 0 ? `<button class="m-btn ghost" data-w="-1" title="Giảm 1 bài">−</button>` : ""}
            <button class="m-btn ${doneW >= sp.w ? "done-btn" : "tick-btn"}" data-w="tick">
              ${doneW >= sp.w ? `✅ Đã viết (${doneW}/${sp.w})` : `⬜ Đánh dấu đã viết (${doneW}/${sp.w})`}
            </button>
          </div>
        </div>` : `<div class="m-next-hint">💡 Hoàn thành <b>Mission 1 (⭐)</b> sẽ mở khoá <b>Mission 2 (🌸)</b>: 4/6 Listening parts · 2/3 Reading passages · 0/1 Writing Task 1!</div>`}
      `;

      listBox.querySelectorAll("[data-w]").forEach(btn => btn.onclick = () => {
        const { all: a2, cur: c2 } = dailyState(today());
        if (btn.dataset.w === "-1") {
          c2.wTasks = Math.max(0, (c2.wTasks || 0) - 1);
        } else {
          markToday();
          c2.wTasks = (c2.wTasks || 0) < sp.w ? (c2.wTasks || 0) + 1 : Math.max(0, sp.w - 1);
        }
        const leveled = checkMissionLevelUp(a2, c2, today());
        if (leveled) {
          fireworks();
          renderHome(app);
        } else {
          renderHome(app);
        }
      });
    }
    drawMissionCard();

    // book groups (Cambridge / VOL / Recent Tests) + book subtabs
    const groupsEl = wrap.querySelector(".lib-groups"), tabsEl = wrap.querySelector(".lib-subtabs"), body = wrap.querySelector(".lib-body");
    const ICON = { listening: "🎧", reading: "📖", writing: "✍️", speaking: "🗣️" };
    let curGrp = BOOK_GROUPS.find(g => g.ids.includes(tab)) || BOOK_GROUPS[0];
    let typeMode = false, selectedType = null, typeSource = "all", typeSkill = "reading";
    function questionTypeCatalog() {
      const catalog = new Map();
      const sourceGroups = {
        cam: BOOK_GROUPS.find(g => g.key === "cam").ids,
        vol: BOOK_GROUPS.find(g => g.key === "vol").ids,
        recent: BOOK_GROUPS.find(g => g.key === "recent").ids
      };
      for (const b of books) {
        const source = Object.keys(sourceGroups).find(key => sourceGroups[key].includes(b.id));
        if (typeSource !== "all" && source !== typeSource) continue;
        if (!typeSkill) continue;
        for (const t of b.tests) for (const skill of [typeSkill]) {
          const sections = skill === "listening" ? t.listening?.parts : t.reading?.passages;
          for (const [index, sec] of (sections || []).entries()) {
            const labels = questionTypeLabels(sec, b, t, skill, index + 1);
            const categories = [...new Set(labels.map(questionTypeCategory))];
            for (const category of categories) {
              if (!catalog.has(category)) catalog.set(category, []);
              catalog.get(category).push({ book: b, test: t, skill, index, sec, labels });
            }
          }
        }
      }
      const bookOrder = new Map(BOOK_GROUPS.flatMap((g, gi) => g.ids.map((id, bi) => [id, [gi, bi]])));
      return [...catalog.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, items]) => ({
        name,
        items: items.sort((a, b) => {
          const aa = bookOrder.get(a.book.id) || [99, 99], bb = bookOrder.get(b.book.id) || [99, 99];
          return aa[0] - bb[0] || aa[1] - bb[1] || a.test.n - b.test.n || ["listening", "reading"].indexOf(a.skill) - ["listening", "reading"].indexOf(b.skill) || a.index - b.index;
        })
      }));
    }
    function drawQuestionTypeBrowser() {
      const catalog = questionTypeCatalog();
      const sourceSelect = `<label class="qtype-source">Nguồn đề
        <select data-qtype-source>
          <option value="all"${typeSource === "all" ? " selected" : ""}>Tất cả</option>
          <option value="cam"${typeSource === "cam" ? " selected" : ""}>Cambridge</option>
          <option value="vol"${typeSource === "vol" ? " selected" : ""}>VOL</option>
          <option value="recent"${typeSource === "recent" ? " selected" : ""}>Recent Tests</option>
        </select>
      </label>`;
      const selected = catalog.find(item => item.name === selectedType);
      body.innerHTML = `<div class="qtype-browser">
        ${sourceSelect}
        <div class="qtype-skills" aria-label="Chọn kỹ năng">
          <button class="qtype-skill${typeSkill === "listening" ? " on" : ""}" data-qskill="listening">🎧 Listening</button>
          <button class="qtype-skill${typeSkill === "reading" ? " on" : ""}" data-qskill="reading">📖 Reading</button>
        </div>
        <div class="qtype-grid">${catalog.map(item => `<button class="qtype-card${item.name === selectedType ? " on" : ""}" data-qtype="${esc(item.name)}"><b>${esc(item.name)}</b><span class="qtype-count">${item.items.length}</span></button>`).join("")}</div>
        ${selected ? `<div class="qtype-results-head"><button class="qtype-back" data-qtype-back>← Tất cả dạng</button><h3>${esc(selected.name)} · ${selected.items.length} phần/bài</h3></div>
          <div class="qtype-results">${selected.items.map(item => {
            const partName = item.skill === "listening" ? `Part ${item.index + 1}` : `Passage ${item.index + 1}`;
            const title = item.sec.title || `${partName} ${item.test.n}`;
            const href = `#/${item.book.id}/${item.test.n}/${item.skill}/p${item.index + 1}`;
            return `<a class="qtype-result" href="${href}"><small>${esc(bookFull(item.book.id))} · Test ${item.test.n} · ${SKILL_NAMES[item.skill]} · ${partName}</small><b>${esc(title)}</b><span class="qtype-result-types">${item.labels.map(label => `<i>${esc(label)}</i>`).join("")}</span></a>`;
          }).join("")}</div>` : ""}
      </div>`;
      body.querySelector("[data-qtype-source]").onchange = e => { typeSource = e.target.value; drawQuestionTypeBrowser(); };
      body.querySelectorAll("[data-qskill]").forEach(button => button.onclick = () => {
        typeSkill = button.dataset.qskill;
        selectedType = null;
        drawQuestionTypeBrowser();
      });
      body.querySelectorAll("[data-qtype]").forEach(button => button.onclick = () => {
        selectedType = selectedType === button.dataset.qtype ? null : button.dataset.qtype;
        drawQuestionTypeBrowser();
      });
      body.querySelector("[data-qtype-back]")?.addEventListener("click", () => { selectedType = null; drawQuestionTypeBrowser(); });
    }
    function drawLibrary() {
      groupsEl.replaceChildren();
      for (const g of BOOK_GROUPS) {
        const hasAny = g.ids.some(id => books.some(x => x.id === id));
        const gbtn = h(`<button class="grp-tab${!typeMode && g.key === curGrp.key ? " on" : ""}"${hasAny ? "" : " disabled"}>${g.label}</button>`);
        if (hasAny) gbtn.onclick = () => {
          typeMode = false;
          selectedType = null;
          typeSkill = "reading";
          curGrp = g;
          const savedInGrp = store.get(`ielts:tab:${g.key}`, null);
          const nextId = (savedInGrp && books.some(x => x.id === savedInGrp)) ? savedInGrp : g.ids.find(id => books.some(x => x.id === id));
          if (nextId != null) { tab = nextId; store.set("ielts:tab", tab); store.set(`ielts:tab:${g.key}`, tab); }
          drawLibrary();
        };
        groupsEl.append(gbtn);
      }
      const typeBtn = h(`<button class="grp-tab${typeMode ? " on" : ""}">🧩 Dạng câu hỏi</button>`);
      typeBtn.onclick = () => { typeMode = true; selectedType = null; typeSkill = "reading"; drawLibrary(); };
      groupsEl.append(typeBtn);
      if (typeMode) {
        tabsEl.style.display = "none";
        drawQuestionTypeBrowser();
        return;
      }
      tabsEl.replaceChildren();
      if (curGrp.ids.length > 1) {
        tabsEl.style.display = "";
        for (const id of curGrp.ids) {
          const b = books.find(x => x.id === id);
          const btn = h(`<button class="tab2${id === tab ? " on" : ""}"${b ? "" : " disabled"}>${bookShort(id)}</button>`);
          if (b) btn.onclick = () => {
            tab = id;
            store.set("ielts:tab", id);
            store.set(`ielts:tab:${curGrp.key}`, id);
            tabsEl.querySelectorAll(".tab2").forEach(x => x.classList.toggle("on", x === btn));
            drawBook(b);
          };
          tabsEl.append(btn);
        }
      } else {
        tabsEl.style.display = "none";
      }
      const curB = books.find(b => b.id === tab);
      if (curB) drawBook(curB);
    }
    function drawBook(b) {
      body.replaceChildren();
      const grid = h(`<div class="tiles"></div>`);
      b.tests.forEach((t, ti) => {
        const sub = b.id > 100 && t.reading ? `<div class="tile-sub">${t.reading.passages.map(p => esc(p.title)).join(" · ")}</div>` : "";
        const tile = h(`<div class="tile v${ti % 4}"><div class="tile-top"><span class="tile-no">${t.n}</span><div><div class="tile-title">Test ${t.n}</div>${sub}</div></div><div class="tile-skills"></div></div>`);
        const box = tile.querySelector(".tile-skills");
        for (const s of Object.keys(SKILL_NAMES)) {
          if (!t[s]) continue;
          const row = h(`<div class="srow"></div>`);
          const link = h(`<a class="sbtn ${s}" href="#/${b.id}/${t.n}/${s}">${ICON[s]} ${SKILL_NAMES[s]}</a>`);
          if (s === "listening" || s === "reading") link.onclick = (e) => { e.preventDefault(); choosePart(b, t, s); };
          row.append(link);
          if (s === "listening" || s === "reading") {
            // one score ring: right answers over all 40, from part practice or the full-test check
            const ps = partScores(b, t, s);
            const secs = s === "listening" ? t[s].parts : t[s].passages;
            const totalQ = secs.reduce((n, sec) => n + sectionQs(sec).length, 0);
            const doneParts = ps.filter(Boolean);
            const right = doneParts.reduce((n, x) => n + x.right, 0);
            const doneQ = doneParts.reduce((n, x) => n + x.total, 0);
            const acc = doneQ ? right / doneQ : 0;
            const color = !doneQ ? "#d6c7c8" : acc >= 0.8 ? "#2e9a52" : acc >= 0.5 ? "#f0b429" : "#ff5a3c";
            const deg = Math.round(right / totalQ * 360);
            const tip = secs.map((_, i) => `${s === "listening" ? "Part" : "Passage"} ${i + 1}: ${ps[i] ? ps[i].right + "/" + ps[i].total : "chưa làm"}`).join("\n");
            row.append(h(`<div class="ring${doneQ ? "" : " empty"}" title="${tip}" style="--c:${color};--deg:${deg}deg">
              <div class="ring-in">${doneQ ? `<b>${right}</b><small>/${totalQ}</small>` : "<small>chưa làm</small>"}</div></div>`));
            if (doneQ && doneParts.length < secs.length) row.append(h(`<span class="ring-note">${doneParts.length}/${secs.length} phần</span>`));
          }
          box.append(row);
        }
        grid.append(tile);
      });
      body.append(grid);
    }
    const cur = books.find(b => b.id === tab);
    drawLibrary();

    // random practice: a Listening part or Reading passage she hasn't scored yet (falls back to any)
    wrap.querySelector('[data-a="random"]').onclick = () => {
      const pool = [], fresh = [];
      for (const b of books) for (const t of b.tests) for (const s of ["listening", "reading"]) {
        if (!t[s]) continue;
        partScores(b, t, s).forEach((x, i) => { const hsh = `#/${b.id}/${t.n}/${s}/p${i + 1}`; pool.push(hsh); if (!x) fresh.push(hsh); });
      }
      const list = fresh.length ? fresh : pool;
      location.hash = list[Math.floor(Math.random() * list.length)];
    };
    wrap.querySelector('a[href="#library"]')?.addEventListener("click", (e) => { e.preventDefault(); wrap.querySelector("#library").scrollIntoView({ behavior: "smooth" }); });
    app.replaceChildren(wrap);
  }

  // score per part: single-part practice if done, otherwise taken from the full-test check
  function partScores(b, t, sk) {
    const secs = sk === "listening" ? t.listening.parts : t.reading.passages;
    const full = store.get(`ielts:${b.id}:${t.n}:${sk}`, null);
    return secs.map((s, i) => {
      const qs = sectionQs(s);
      const one = store.get(`ielts:${b.id}:${t.n}:${sk}:p${i + 1}`, null);
      if (one && one.firstScore != null) return { right: one.firstScore, total: qs.length };
      if (full && full.firstMarks && qs.some(q => full.firstMarks[q] != null)) return { right: qs.filter(q => full.firstMarks[q] === true).length, total: qs.length };
      // Legacy scores are usable as first tries only when we know there was one attempt.
      if (one && one.firstTryDone == null && (one.tries || 0) <= 1 && one.score != null) return { right: one.score, total: qs.length };
      if (full && full.firstTryDone == null && (full.tries || 0) <= 1 && full.marks && qs.some(q => full.marks[q] != null)) return { right: qs.filter(q => full.marks[q] === true).length, total: qs.length };
      return null;
    });
  }

  // ---------- past scores & average evaluation page (#/scores) ----------
  function nextBandTarget(skill, avg40) {
    const table = skill === "listening"
      ? [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5]]
      : [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5]];
    const curBand = bandFor(skill, avg40);
    const higher = [...table].reverse().find(([min, b]) => b > curBand);
    return higher ? { need: higher[0] - avg40, targetBand: higher[1], minRaw: higher[0] } : null;
  }

  function collectScoreData() {
    const histMap = {};
    for (const h of store.get("ielts:history", [])) histMap[h.id] = h;
    const items = [];
    const bySkill = {
      listening: { right: 0, total: 0, fullDone: 0, partsDone: 0, bestBand: 0, partStats: [0, 1, 2, 3].map(() => ({ r: 0, t: 0, n: 0 })) },
      reading:   { right: 0, total: 0, fullDone: 0, partsDone: 0, bestBand: 0, partStats: [0, 1, 2].map(() => ({ r: 0, t: 0, n: 0 })) }
    };

    for (const b of books) for (const t of b.tests) for (const sk of ["listening", "reading"]) {
      if (!t[sk]) continue;
      const secs = sk === "listening" ? t[sk].parts : t[sk].passages;
      const ps = partScores(b, t, sk);
      const doneParts = ps.filter(Boolean);
      if (!doneParts.length) continue;

      const right = doneParts.reduce((n, x) => n + x.right, 0);
      const doneQ = doneParts.reduce((n, x) => n + x.total, 0);
      const totalQ = secs.reduce((n, sec) => n + sectionQs(sec).length, 0);
      const isFull = doneParts.length === secs.length;
      const eq40 = Math.round(right / doneQ * 40);
      const band = bandFor(sk, eq40);

      const skStat = bySkill[sk];
      skStat.right += right;
      skStat.total += doneQ;
      skStat.partsDone += doneParts.length;
      if (isFull) skStat.fullDone++;
      if (band > skStat.bestBand) skStat.bestBand = band;

      ps.forEach((p, idx) => {
        if (p && skStat.partStats[idx]) {
          skStat.partStats[idx].r += p.right;
          skStat.partStats[idx].t += p.total;
          skStat.partStats[idx].n++;
        }
      });

      const fullKey = `${b.id}:${t.n}:${sk}`;
      const fullSaved = store.get(`ielts:${fullKey}`, null);
      let latestTs = histMap[fullKey]?.ts || fullSaved?.updatedAt || 0;
      let latestDate = histMap[fullKey]?.date || "";
      let tries = fullSaved?.tries || 0;
      secs.forEach((_, idx) => {
        const pk = `${fullKey}:p${idx + 1}`;
        const pSaved = store.get(`ielts:${pk}`, null);
        const hEntry = histMap[pk];
        if ((hEntry?.ts || 0) > latestTs) { latestTs = hEntry.ts; latestDate = hEntry.date; }
        if ((pSaved?.updatedAt || 0) > latestTs) latestTs = pSaved.updatedAt;
        if (!tries && pSaved?.tries) tries = Math.max(tries, pSaved.tries);
      });

      // Determine best link to review or continue
      let reviewHref = `#/${b.id}/${t.n}/${sk}`;
      if (fullSaved?.revealed) reviewHref = `#/${b.id}/${t.n}/${sk}/result`;
      else if (doneParts.length === 1) {
        const pi = ps.findIndex(Boolean);
        const pSaved = store.get(`ielts:${b.id}:${t.n}:${sk}:p${pi + 1}`, null);
        reviewHref = `#/${b.id}/${t.n}/${sk}/p${pi + 1}` + (pSaved?.revealed ? "/result" : "");
      }

      items.push({
        book: b, test: t, skill: sk, ps, secs, right, doneQ, totalQ,
        acc: Math.round(right / doneQ * 100), eq40, band, isFull,
        doneCount: doneParts.length, totalParts: secs.length,
        ts: latestTs, date: latestDate, tries: tries || 1, reviewHref
      });
    }

    items.sort((a, b) => (b.ts - a.ts) || (b.book.id - a.book.id) || (a.test.n - b.test.n));

    for (const sk of ["listening", "reading"]) {
      const s = bySkill[sk];
      s.pct = s.total ? Math.round(s.right / s.total * 100) : null;
      s.avg40 = s.total ? Math.round(s.right / s.total * 40) : null;
      s.avgBand = s.avg40 != null ? bandFor(sk, s.avg40) : null;
    }
    const availBands = [bySkill.listening.avgBand, bySkill.reading.avgBand].filter(x => x != null);
    const overallBand = availBands.length
      ? Math.round((availBands.reduce((a, b) => a + b, 0) / availBands.length) * 2) / 2
      : null;

    return { items, bySkill, overallBand };
  }

  function renderScores(app) {
    document.title = "Lịch sử điểm & Đánh giá · IELTS cho Mập";
    const { items, bySkill, overallBand } = collectScoreData();
    const L = bySkill.listening, R = bySkill.reading;

    // Build personalized evaluation message
    let evalTitle = "Chưa có dữ liệu điểm", evalText = "Mập hãy làm thử 1 part Listening hoặc 1 passage Reading rồi bấm Kiểm Tra để xem đánh giá trình độ chi tiết nha! 🌸";
    const tips = [];
    if (overallBand != null) {
      if (overallBand >= 7.5) {
        evalTitle = `🌟 Trình độ trung bình: Band ${overallBand.toFixed(1)} — Quá xuất sắc luôn Mập ơi!`;
        evalText = `Phong độ của Mập đang ở mức <b>Very Good User</b>. Độ chính xác rất cao và ổn định — cứ giữ nhịp độ này đi thi là rực rỡ luôn!`;
      } else if (overallBand >= 6.5) {
        evalTitle = `🎀 Trình độ trung bình: Band ${overallBand.toFixed(1)} — Đang rất gần mục tiêu Band 7.0+!`;
        evalText = `Nền tảng Nghe & Đọc của Mập đã khá vững (<b>Competent / Good User</b>). Chỉ cần gọt giũa thêm các câu bẫy paraphrase và quản lý thời gian ở phần cuối là bứt phá lên 7.0–7.5 dễ dàng!`;
      } else if (overallBand >= 5.5) {
        evalTitle = `💪 Trình độ trung bình: Band ${overallBand.toFixed(1)} — Đà tiến bộ rất tốt!`;
        evalText = `Mập đã nắm chắc các câu cơ bản. Để kéo trung bình lên <b>Band 6.5–7.0</b>, mình ưu tiên ăn trọn điểm ở Listening Part 1–2 và Reading Passage 1 trước nhé!`;
      } else {
        evalTitle = `🌱 Trình độ trung bình: Band ${overallBand.toFixed(1)} — Khởi đầu vững chắc!`;
        evalText = `Ai luyện IELTS cũng bắt đầu từ những viên gạch đầu tiên. Mập cứ luyện từng part một, ghi lại từ mới và lỗi sai vào Sổ lỗi sai để tăng dần tỉ lệ đúng nha!`;
      }
      if (L.avg40 != null) {
        const nxt = nextBandTarget("listening", L.avg40);
        if (nxt) tips.push(`🎧 <b>Listening:</b> Trung bình đạt <b>${L.avg40}/40 (${L.pct}% · Band ${L.avgBand.toFixed(1)})</b>. Chỉ cần đúng thêm <b>+${nxt.need} câu/đề</b> là chạm mốc <b>Band ${nxt.targetBand.toFixed(1)}</b>!`);
      }
      if (R.avg40 != null) {
        const nxt = nextBandTarget("reading", R.avg40);
        if (nxt) tips.push(`📖 <b>Reading:</b> Trung bình đạt <b>${R.avg40}/40 (${R.pct}% · Band ${R.avgBand.toFixed(1)})</b>. Chỉ cần đúng thêm <b>+${nxt.need} câu/đề</b> là chạm mốc <b>Band ${nxt.targetBand.toFixed(1)}</b>!`);
      }
      // Find weakest & strongest part across both skills
      const allParts = [
        ...L.partStats.map((p, i) => ({ label: `Listening Part ${i + 1}`, sk: "listening", idx: i, pct: p.t ? Math.round(p.r / p.t * 100) : null, n: p.n })),
        ...R.partStats.map((p, i) => ({ label: `Reading Passage ${i + 1}`, sk: "reading", idx: i, pct: p.t ? Math.round(p.r / p.t * 100) : null, n: p.n }))
      ].filter(p => p.pct != null);
      if (allParts.length >= 2) {
        const sorted = [...allParts].sort((a, b) => b.pct - a.pct);
        const bestP = sorted[0], weakP = sorted[sorted.length - 1];
        if (bestP.pct !== weakP.pct) {
          tips.push(`🎯 <b>Điểm mạnh & Cần cải thiện:</b> Mập làm tốt nhất ở <b>${bestP.label} (${bestP.pct}%)</b>, và có thể lấy thêm nhiều điểm nhất nếu luyện kỹ <b>${weakP.label} (${weakP.pct}%)</b>.`);
        }
      }
    }

    const wrap = h(`<div class="home2 scores-page">
      <header class="topnav">
        <a class="brand" href="#/"><img src="assets/logo-cut.png" alt=""><span>IELTS cho Mập</span></a>
        <nav>
          <a href="#/">🏠 Trang chủ</a>
          <a href="#/scores" class="on">📊 Lịch sử điểm</a>
          <a href="#/errors">📒 Sổ lỗi sai</a>
        </nav>
      </header>

      <section class="hero2 slim">
        <div>
          <div class="hello">📊 Lịch sử điểm & Đánh giá</div>
          <h1>${overallBand != null ? `Band trung bình: <span>${overallBand.toFixed(1)}</span>` : "Bảng điểm của Mập"}</h1>
          <p class="cheer">Tổng hợp tất cả các đề & phần Mập đã làm, tính điểm trung bình và đánh giá tiến độ tự động.</p>
        </div>
      </section>

      <section class="stats2">
        <div class="stat2 c1"><div class="big">${overallBand != null ? overallBand.toFixed(1) : "–"}</div><div class="lbl">⭐ Band TB chung</div></div>
        <div class="stat2 c2"><div class="big">${L.avgBand != null ? L.avgBand.toFixed(1) : "–"}<small>${L.pct != null ? ` · ${L.pct}%` : ""}</small></div><div class="lbl">🎧 Band TB Listening (${L.partsDone} phần)</div></div>
        <div class="stat2 c3"><div class="big">${R.avgBand != null ? R.avgBand.toFixed(1) : "–"}<small>${R.pct != null ? ` · ${R.pct}%` : ""}</small></div><div class="lbl">📖 Band TB Reading (${R.partsDone} phần)</div></div>
        <div class="stat2 c4"><div class="big">${items.length}<small> bài</small></div><div class="lbl">✅ Đề đã luyện (${L.fullDone + R.fullDone} full)</div></div>
      </section>

      <section class="book eval-box">
        <h2>🎓 ${evalTitle}</h2>
        <p class="eval-lead">${evalText}</p>
        ${tips.length ? `<ul class="eval-tips">${tips.map(t => `<li>${t}</li>`).join("")}</ul>` : ""}
        <div class="part-breakdown">
          <div class="pb-col">
            <h4>🎧 Trung bình từng Part (Listening)</h4>
            ${L.partStats.map((p, i) => {
              const pct = p.t ? Math.round(p.r / p.t * 100) : null;
              return `<div class="pb-row">
                <span class="pb-lbl">Part ${i + 1} <small>(${p.n} bài)</small></span>
                <div class="pb-bar"><i style="width:${pct || 0}%;background:${pct >= 80 ? "var(--fl-green)" : pct >= 60 ? "var(--fl-yellow)" : "var(--fl-coral)"}"></i></div>
                <b class="pb-val">${pct != null ? pct + "%" : "–"}</b>
              </div>`;
            }).join("")}
          </div>
          <div class="pb-col">
            <h4>📖 Trung bình từng Passage (Reading)</h4>
            ${R.partStats.map((p, i) => {
              const pct = p.t ? Math.round(p.r / p.t * 100) : null;
              return `<div class="pb-row">
                <span class="pb-lbl">Passage ${i + 1} <small>(${p.n} bài)</small></span>
                <div class="pb-bar"><i style="width:${pct || 0}%;background:${pct >= 80 ? "var(--fl-green)" : pct >= 60 ? "var(--fl-yellow)" : "var(--fl-coral)"}"></i></div>
                <b class="pb-val">${pct != null ? pct + "%" : "–"}</b>
              </div>`;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="book">
        <div class="lib-head">
          <h2>📜 Lịch sử các bài đã làm (${items.length})</h2>
          <div class="tabs2 score-filters">
            <button class="tab2 on" data-f="all">Tất cả</button>
            <button class="tab2" data-f="listening">🎧 Listening</button>
            <button class="tab2" data-f="reading">📖 Reading</button>
            <button class="tab2" data-f="full">📝 Full test</button>
            <button class="tab2" data-f="partial">🧩 Từng phần</button>
          </div>
        </div>
        <div class="score-list"></div>
      </section>
    </div>`);

    const listEl = wrap.querySelector(".score-list");
    let filter = "all";
    function drawList() {
      listEl.replaceChildren();
      const shown = items.filter(it => {
        if (filter === "listening") return it.skill === "listening";
        if (filter === "reading") return it.skill === "reading";
        if (filter === "full") return it.isFull;
        if (filter === "partial") return !it.isFull;
        return true;
      });
      if (!shown.length) {
        listEl.innerHTML = `<div class="soon">Chưa có bài làm nào trong mục này. Mập chọn đề ở Trang chủ để bắt đầu nha! 🌸</div>`;
        return;
      }
      for (const it of shown) {
        const pLabel = it.skill === "listening" ? "P" : "Passage ";
        const chips = it.ps.map((p, i) => p
          ? `<a class="sc-part done" href="#/${it.book.id}/${it.test.n}/${it.skill}/p${i + 1}">${pLabel}${i + 1}: <b>${p.right}/${p.total}</b></a>`
          : `<a class="sc-part" href="#/${it.book.id}/${it.test.n}/${it.skill}/p${i + 1}">${pLabel}${i + 1}: chưa làm</a>`
        ).join("");
        const badgeCls = it.band >= 7 ? "good" : it.band >= 5.5 ? "mid" : "low";
        let dateLabel = "Đã lưu";
        if (it.ts) {
          const d = new Date(it.ts);
          const timeStr = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
          const dayStr = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
          const isToday = it.date === today() || dateKey(d) === today();
          dateLabel = `${timeStr} · ${isToday ? "Hôm nay" : dayStr}`;
        } else if (it.date) {
          dateLabel = it.date === today() ? "Hôm nay" : it.date.split("-").reverse().join("/");
        }
        let scopeBadge = "";
        if (it.isFull) {
          scopeBadge = `<span class="sc-scope full">📝 Trọn vẹn Full test (${it.totalParts}/${it.totalParts})</span>`;
        } else if (it.doneCount === 1) {
          const singleIdx = it.ps.findIndex(Boolean);
          const singleLabel = it.skill === "listening" ? `Part ${singleIdx + 1}` : `Passage ${singleIdx + 1}`;
          scopeBadge = `<span class="sc-scope single">🧩 Làm riêng 1 phần: ${singleLabel}</span>`;
        } else {
          scopeBadge = `<span class="sc-scope partial">🧩 Làm từng phần (${it.doneCount}/${it.totalParts} phần)</span>`;
        }

        const row = h(`<div class="sc-row ${it.isFull ? "row-full" : "row-part"}">
          <div class="sc-main">
            <div class="sc-title">
              <span class="sc-sk ${it.skill}">${it.skill === "listening" ? "🎧 Listening" : "📖 Reading"}</span>
              <b>${esc(bookFull(it.book.id))} · Test ${it.test.n}</b>
              ${scopeBadge}
              <span class="sc-date">🗓️ ${dateLabel} · lần thử ${it.tries}</span>
            </div>
            <div class="sc-parts">${chips}</div>
          </div>
          <div class="sc-right">
            <div class="sc-score"><b>${it.right}</b><small>/${it.doneQ}</small> <span>(lần đầu · ${it.acc}%)</span></div>
            <div class="sc-band ${badgeCls}">Band ${it.band.toFixed(1)}${it.isFull ? "" : " (ước tính)"}</div>
            <div class="sc-actions">
              <a class="m-btn" href="${it.reviewHref}">${it.isFull ? "Xem bài" : "Làm tiếp"} →</a>
            </div>
          </div>
        </div>`);
        listEl.append(row);
      }
    }
    wrap.querySelectorAll(".score-filters .tab2").forEach(btn => btn.onclick = () => {
      filter = btn.dataset.f;
      wrap.querySelectorAll(".score-filters .tab2").forEach(x => x.classList.toggle("on", x === btn));
      drawList();
    });
    drawList();
    app.replaceChildren(wrap);
  }

  // ---------- error log page ----------
  function mdLite(s) {
    return esc(s).replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>").replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
  }
  function aiPrompt(entries) {
    const data = entries.map(e => ({
      book: bookFull(e.book), test: e.test, skill: e.skill, part: e.part, question: e.q, context: e.question,
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
    const wrap = h(`<div class="home2 errlog">
      <header class="topnav">
        <a class="brand" href="#/"><img src="assets/logo-cut.png" alt=""><span>IELTS cho Mập</span></a>
        <nav><a href="#/">🏠 Trang chủ</a><a href="#/scores">📊 Lịch sử điểm</a><a href="#/errors" class="on">📒 Sổ lỗi sai</a></nav>
      </header>
      <section class="hero2 slim"><div><div class="hello">📒 Sổ lỗi sai</div><h1>${all.length} câu đã sai</h1>
        <p class="cheer">Ghi lại vì sao sai — rồi để AI tìm điểm yếu giúp Mập nhé.</p></div></section>
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
        <div class="err-head"><b>${bookShort(e.book)} T${e.test} · ${SKILL_NAMES[e.skill]} ${e.skill === "listening" ? "Part" : "Passage"} ${e.part} · Q${e.q}</b>
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
    const scoreOf = (k, total) => {
      const s = store.get(k, null);
      const score = s?.firstScore ?? (s?.firstTryDone == null && (s?.tries || 0) <= 1 ? s?.score : null);
      return score != null ? `<span class="pick-score">${score}/${total} · first try</span>` : "";
    };
    const m = h(`<div class="modal"><div class="modal-card pick">
      <div class="pick-title">${esc(b.title)} · Test ${t.n}<br><b>${SKILL_NAMES[sk]}</b></div>
      <a class="pick-full" href="${base}">📝 Làm full test <small>(${label} 1–${secs.length} · 40 câu)</small>${scoreOf(`ielts:${b.id}:${t.n}:${sk}`, 40)}</a>
      <div class="pick-sub">hoặc luyện từng phần</div>
      <div class="pick-grid">${secs.map((s, i) => {
        const n = sectionQs(s).length;
        const types = questionTypeLabels(s, b, t, sk, i + 1);
        return `<a class="pick-part" href="${base}/p${i + 1}"><b>${label} ${i + 1}</b><small>${esc(s.title || "")}</small><span class="pick-types">${types.map(x => `<i>${esc(x)}</i>`).join("")}</span>${scoreOf(`ielts:${b.id}:${t.n}:${sk}:p${i + 1}`, n)}</a>`;
      }).join("")}</div>
      <button class="pick-close">Đóng</button>
    </div></div>`);
    m.onclick = (e) => { if (e.target === m || e.target.closest(".pick-close") || e.target.closest("a")) m.remove(); };
    document.body.append(m);
  }

  // ---------- shared top-bar pieces ----------
  function toastNotice(msg) {
    const old = document.querySelector(".time-toast");
    if (old) old.remove();
    const t = h(`<div class="time-toast">⏰ <b>Hết giờ làm bài!</b> <span>${esc(msg)}</span><button onclick="this.parentElement.remove()">✕</button></div>`);
    document.body.append(t);
    setTimeout(() => { if (t.parentElement) t.remove(); }, 8000);
  }

  function toolsHtml(extraRight, timerConfig) {
    const themes = [["default", "#fffaf8"], ["white", "#ffffff"], ["sepia", "#f5ecdf"], ["cream", "#fdf7e3"], ["mint", "#eaf4ec"], ["dark", "#24201f"]];
    const durOpts = [
      { v: 900, l: "15p" },
      { v: 1200, l: "20p" },
      { v: 1800, l: "30p" },
      { v: 3000, l: "50p" },
      { v: 3600, l: "1h" },
      { v: 0, l: "Đếm xuôi" }
    ];
    const curDur = timerConfig ? timerConfig.duration : 0;
    const durSelect = timerConfig ? `
      <select class="sel timer-sel" title="Thời gian làm bài" data-pref="timer-dur">
        ${durOpts.map(o => `<option value="${o.v}"${curDur === o.v ? " selected" : ""}>⏱️ ${o.l}</option>`).join("")}
      </select>` : "";

    return `<div class="tools">
      <span class="hide-sm">${themes.map(([k, c]) => `<button class="swatch${prefs.theme === k ? " on" : ""}" data-theme="${k}" title="${k}" style="background:${c}"></button>`).join(" ")}</span>
      <select class="sel" data-pref="font">
        ${[["Lexend", "Mặc định"], ["Merriweather", "Serif"], ["Nunito", "Nunito"]].map(([v, l]) => `<option value="${v}"${prefs.font === v ? " selected" : ""}>${l}</option>`).join("")}
      </select>
      <select class="sel" data-pref="size">
        ${[15, 16, 17, 18, 19, 20, 21, 23, 25].map(v => `<option value="${v}"${+prefs.size === v ? " selected" : ""}>${v}px</option>`).join("")}
      </select>
      <button class="ibtn hide-sm" data-act="full" title="Toàn màn hình">${icon.full}</button>
      ${durSelect}
      <span class="timer" title="Bấm để chọn lại thời gian">00:00</span>
      ${extraRight || ""}
    </div>`;
  }
  function wireTools(root, onTimerChange) {
    root.querySelectorAll(".swatch").forEach(s => s.onclick = () => {
      prefs.theme = s.dataset.theme; applyPrefs();
      root.querySelectorAll(".swatch").forEach(x => x.classList.toggle("on", x === s));
    });
    root.querySelectorAll("select[data-pref]:not(.timer-sel)").forEach(s => s.onchange = () => { prefs[s.dataset.pref] = s.value; applyPrefs(); });
    const full = root.querySelector('[data-act="full"]');
    if (full) full.onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    const tSel = root.querySelector(".timer-sel");
    if (tSel && onTimerChange) {
      tSel.onchange = () => onTimerChange(+tSel.value);
    }
  }
  let timerId = null;
  function startTimer(el, key, countdown, onTimeUp) {
    clearInterval(timerId);
    const startAt = Date.now() - store.get(key, 0) * 1000;
    let notified = false;
    const tick = () => {
      const used = (Date.now() - startAt) / 1000;
      store.set(key, Math.floor(used));
      if (countdown > 0) {
        const left = countdown - used;
        if (left > 0) {
          el.textContent = fmt(left);
          el.classList.toggle("low", left < 300);
          el.classList.remove("overtime");
        } else {
          const over = Math.abs(left);
          el.textContent = "+" + fmt(over);
          el.classList.add("low", "overtime");
          if (!notified) {
            notified = true;
            toastNotice("Đã hết giờ làm bài rồi Mập ơi! Cứ tiếp tục làm xong rồi bấm Kiểm Tra nha 🌸");
            if (onTimeUp) onTimeUp();
          }
        }
      } else {
        el.textContent = fmt(used);
        el.classList.remove("low", "overtime");
      }
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
    const historyId = key.slice("ielts:".length);
    const historyEntry = store.get("ielts:history", []).find(x => x.id === historyId);
    const legacyTries = Math.max(saved.tries || 0, historyEntry?.tries || 0);
    const legacyCompleted = saved.score != null || !!historyEntry;
    const legacyFirstKnown = legacyTries <= 1;
    const firstTryDone = saved.firstTryDone ?? (saved.firstScore != null || (legacyCompleted && legacyFirstKnown));
    const firstScore = Object.prototype.hasOwnProperty.call(saved, "firstScore")
      ? saved.firstScore
      : legacyFirstKnown ? (saved.score ?? historyEntry?.firstRight ?? historyEntry?.right ?? null) : null;
    const firstMarks = saved.firstMarks || (legacyFirstKnown ? saved.marks : null);
    // marks: {q: true|false} from the last "Kiểm Tra" (answers stay hidden); revealed: user chose "Xem đáp án"
    const st = { part: saved.part || 0, answers: saved.answers || {}, marks: saved.marks || {}, wrongEver: saved.wrongEver || {}, revealed: !!saved.revealed, tries: saved.tries || 0, score: saved.score, firstScore, firstMarks, firstTryDone, updatedAt: saved.updatedAt };
    const save = () => store.set(key, { part: st.part, answers: st.answers, marks: st.marks, wrongEver: st.wrongEver, revealed: st.revealed, tries: st.tries, score: st.score, firstScore: st.firstScore, firstMarks: st.firstMarks, firstTryDone: st.firstTryDone, checked: st.revealed, updatedAt: st.updatedAt });
    const locked = (q) => st.revealed || st.marks[q] === true;
    const allQs = sections.flatMap(sectionQs);
    const label = skill === "listening" ? "Part" : "Passage";
    document.title = `${bookShort(book.id)} T${test.n} ${SKILL_NAMES[skill]}${only == null ? "" : ` ${label} ${only + 1}`} · IELTS cho Mập`;
    // band tables are for 40 questions; scale a single part up for an estimate
    store.set("ielts:last", { hash: basePath, label: `${bookShort(book.id)} · Test ${test.n} · ${SKILL_NAMES[skill]}${only == null ? "" : ` ${label} ${only + 1}`}` });
    const bandOf = (right) => bandFor(skill, Math.round(right * 40 / allQs.length));

    // Default timer: full reading = 60m (3600s), single reading = 20m (1200s), single listening = 15m (900s), full listening = count-up (0)
    const defaultCountdown = skill === "reading" ? (only == null ? 3600 : 1200) : (only != null ? 900 : 0);
    let chosenCountdown = store.get(`${key}:timerDur`, defaultCountdown);

    const shell = h(`<div class="shell">
      <div class="topbar">
        <div class="row">
          <a class="ibtn" href="#/" title="Quay lại">${icon.back}</a>
          <div class="parts"></div>
          ${toolsHtml('<button class="check">Kiểm Tra</button>', { duration: chosenCountdown })}
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
    const timerEl = shell.querySelector(".timer");
    const launchTimer = (dur) => {
      startTimer(timerEl, key + ":time", dur);
    };
    wireTools(shell, (newDur) => {
      chosenCountdown = newDur;
      store.set(`${key}:timerDur`, newDur);
      // reset used time to 0 when user explicitly picks a new duration
      store.set(key + ":time", 0);
      launchTimer(newDur);
    });
    launchTimer(chosenCountdown);

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

    function paperHtml(sec) {
      return (sec.sourceNote || "") + `<div class="source-paper">${sec.sourcePages.map((p, i) => `<figure><button type="button" class="paper-open" data-paper="${i}" aria-label="Enlarge ${esc(p.alt)}"><img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async"></button><figcaption>Page ${i + 1} · Click to enlarge</figcaption></figure>`).join("")}</div>`;
    }
    function bindPaper(root, sec) {
      root.querySelectorAll("[data-paper]").forEach(b => b.onclick = () => {
        const p = sec.sourcePages[+b.dataset.paper];
        const dialog = h(`<dialog class="paper-zoom"><button type="button" class="paper-close">Close ×</button><img src="${p.src}" alt="${esc(p.alt)}"></dialog>`);
        dialog.querySelector("button").onclick = () => dialog.close();
        dialog.addEventListener("close", () => dialog.remove());
        document.body.append(dialog); dialog.showModal();
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
      if (sec.sourcePages) {
        const pPane = h(`<div class="pane passage paper-pane"></div>`);
        pPane.innerHTML = paperHtml(sec);
        bindPaper(pPane, sec);
        qPane.classList.add("paper-answers");
        panes.replaceChildren(pPane, qPane);
        if (skill === "listening" && sec.audio) {
          const src = encodeURI((book.audioDir || "") + sec.audio);
          if (!audio.src.endsWith(src)) { audio.src = src; audio.load(); }
        }
      } else if (skill === "reading") {
        const pPane = h(`<div class="pane passage"></div>`);
        pPane.innerHTML = sec.text;
        panes.replaceChildren(pPane, qPane);
        enableNotes(pPane, `${key}:notes:p${i}`);
        pPane.addEventListener("scroll", closeNotePop);
      } else {
        panes.replaceChildren(qPane);
        if (sec.audio) {
          const src = encodeURI((book.audioDir || "") + sec.audio);
          if (!audio.src.endsWith(src)) { audio.src = src; audio.load(); }
        } else {
          audio.removeAttribute("src"); audio.load();
        }
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
      const firstAttempt = !st.firstTryDone;
      if (firstAttempt) {
        st.firstScore = st.score;
        st.firstMarks = { ...st.marks };
        st.firstTryDone = true;
      }
      st.tries++;
      st.updatedAt = Date.now();
      save();
      recordCompletion(book, test, skill, only, st.firstScore, allQs.length, st.tries);
      showPart(st.part);
      showCheckPopup(firstAttempt);
      if (firstAttempt && st.firstScore != null && st.firstScore / allQs.length >= 0.8) fireworks();
    }
    function reveal() {
      if (!confirm("Xem đáp án sẽ hiện toàn bộ đáp án đúng và transcript. Tiếp tục?")) return;
      allQs.forEach(q => { st.marks[q] = isRight(q); });
      st.score = allQs.filter(isRight).length;
      if (!st.firstTryDone) {
        st.firstScore = st.score;
        st.firstMarks = { ...st.marks };
        st.firstTryDone = true;
      }
      st.revealed = true;
      st.updatedAt = Date.now();
      save();
      recordCompletion(book, test, skill, only, st.firstScore, allQs.length, Math.max(1, st.tries));
      location.hash = resultHash;
    }
    function retry() {
      st.answers = {}; st.marks = {}; st.wrongEver = {}; st.revealed = false; st.score = null; st.part = 0; save();
      store.del(key + ":time");
      location.hash = basePath;
      route();
    }
    function showCheckPopup(firstAttempt = false) {
      document.querySelectorAll(".modal").forEach(m => m.remove());
      const right = allQs.filter(q => st.marks[q] === true).length;
      const blank = allQs.filter(q => !hasAnswer(q)).length;
      const wrong = allQs.length - right - blank;
      const done = right === allQs.length;
      const firstTryHighScore = firstAttempt && st.firstScore != null && st.firstScore / allQs.length >= 0.8;
      const m = h(`<div class="modal"><div class="modal-card">
        <img src="assets/logo-cut.png" alt="">
        <div class="big">${right}/${allQs.length}</div>
        <div class="band">${only == null ? `Band ước tính: <b>${bandOf(right).toFixed(1)}</b> · ` : `${label} ${only + 1} · `}lần thử ${st.tries}</div>
        <div class="mini-stats"><span class="c1">✓ ${right} đúng</span><span class="c3">✕ ${wrong} sai</span><span class="c2">– ${blank} bỏ trống</span></div>
        <p class="hint">${firstTryHighScore ? "🎆 Lần đầu đã đạt ít nhất 80% – Mập đỉnh quá! 🎆<br>" : ""}${done ? "Đúng hết rồi! Giỏi quá 🎀" : "Câu <b style='color:var(--bad)'>đỏ</b> là câu sai — sửa lại rồi bấm <b>Kiểm Tra</b> lần nữa nhé. Đáp án vẫn được giấu."}</p>
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
      document.title = `Kết quả ${SKILL_NAMES[skill]} · ${book.id > 100 ? "Real Test" : "C" + book.id} T${test.n}`;
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
        if (!sections[part].audio) { resAudio.removeAttribute("src"); resAudio.load(); return; }
        const src = encodeURI((book.audioDir || "") + sections[part].audio);
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
        if (sec.sourcePages && (skill === "reading" || !sec.script)) {
          leftBody.innerHTML = paperHtml(sec);
          bindPaper(leftBody, sec);
          return;
        }
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
      // Vietnamese explanation from the source book, when the data has one
      function explainBlock(q) {
        const e = data.explain && data.explain[q];
        if (!e) return "";
        const row = (k, lab) => e[k] ? `<div class="ex-row"><b>${lab}</b> ${esc(e[k])}</div>` : "";
        return `<details class="rq-exp"><summary>💡 Giải thích</summary>${row("quote", "Trích dẫn:")}${row("vi", "Dịch:")}${row("why", "Vì sao:")}${row("kw", "Từ khoá:")}</details>`;
      }
      // all choices for MCQ / choose-TWO / matching-with-a-list, marked right / her pick
      function optionsBlock(g, q) {
        let opts, keys, picks;
        if (g.type === "mcq") {
          const it = g.items.find(x => x.q === q);
          opts = it.options.map((o, i) => [LETTERS[i], o]);
          keys = [norm(displayAns(data.answers[q]))];
          picks = st.answers[q] ? [norm(st.answers[q])] : [];
        } else if (g.type === "multi") {
          if (q !== g.qs[0]) return `<div class="rq-optnote">Các lựa chọn: xem ở Q${g.qs[0]}</div>`;
          opts = g.options.map((o, i) => [LETTERS[i], o]);
          keys = g.qs.map(x => norm(data.answers[x]));
          picks = (st.answers["m" + g.qs[0]] || []).map(norm);
        } else if (g.box && (g.type === "match" || (g.type === "html" && g.letters))) {
          opts = g.box;
          keys = [norm(displayAns(data.answers[q]))];
          picks = st.answers[q] ? [norm(st.answers[q])] : [];
        } else return "";
        return `<div class="rq-opts">${opts.map(([k, txt]) => {
          const K = norm(k), right = keys.includes(K), mine = picks.includes(K);
          const cls = right ? (mine ? "right mine" : "right") : (mine ? "wrong mine" : "");
          const tag = right && mine ? "✓ bạn chọn" : right ? "✓ đáp án" : mine ? "✕ bạn chọn" : "";
          return `<div class="rq-opt ${cls}"><span class="L">${esc(k)}</span><span class="t">${txt}</span>${tag ? `<span class="tg">${tag}</span>` : ""}</div>`;
        }).join("")}</div>`;
      }
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
              ${optionsBlock(g, q)}
              ${explainBlock(q)}
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
    document.title = `${book.id > 100 ? "Real Test" : "C" + book.id} T${test.n} Writing · IELTS cho Mập`;
    let chosenCountdown = store.get(`${key}:timerDur`, 3600);
    const shell = h(`<div class="shell">
      <div class="topbar"><div class="row">
        <a class="ibtn" href="#/" title="Quay lại">${icon.back}</a>
        <div class="parts"></div>
        ${toolsHtml('<span class="wc timer-free"></span>', { duration: chosenCountdown })}
      </div></div>
      <div class="sheet">
        <div class="sheet-head"><div><b class="ttl"></b> <span class="range"></span></div><div class="src">${esc(book.title)} – Test ${test.n}</div></div>
        <div class="panes"></div>
      </div>
    </div>`);
    app.replaceChildren(shell);
    const timerEl = shell.querySelector(".timer");
    const launchTimer = (dur) => {
      startTimer(timerEl, key + ":time", dur);
    };
    wireTools(shell, (newDur) => {
      chosenCountdown = newDur;
      store.set(`${key}:timerDur`, newDur);
      store.set(key + ":time", 0);
      launchTimer(newDur);
    });
    launchTimer(chosenCountdown);
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
    document.title = `${book.id > 100 ? "Real Test" : "C" + book.id} T${test.n} Speaking · IELTS cho Mập`;
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
    if (location.hash === "#/scores") return renderScores(app);
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
    setQuestionTypeOverrides(overrides) { Object.assign(QUESTION_TYPE_OVERRIDES, overrides); },
    start() { applyPrefs(); window.addEventListener("hashchange", route); route(); }
  };
})();
