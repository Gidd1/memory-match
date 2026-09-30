(() => {
  const $ = id => document.getElementById(id);
  const SIZES = { "4x3": { cols: 4, pairs: 6 }, "4x4": { cols: 4, pairs: 8 }, "6x6": { cols: 6, pairs: 18 } };
  const EMOJI = ["🐘","🦁","🦒","🦓","🐢","🦜","🐝","🦋","🌵","🍍","🍉","🥭","🚀","⚽","🎸","🎲","🌍","🔥"];
  // Flag images come from flagcdn.com so they show correctly on every device.
  const FLAGS = [["ke","Kenya"],["ug","Uganda"],["tz","Tanzania"],["ng","Nigeria"],["gh","Ghana"],["eg","Egypt"],
    ["za","South Africa"],["et","Ethiopia"],["br","Brazil"],["jp","Japan"],["in","India"],["fr","France"],
    ["de","Germany"],["ca","Canada"],["au","Australia"],["it","Italy"],["mx","Mexico"],["no","Norway"]];

  let mode = "emoji", size = "4x4", first = null, lock = false, moves = 0, found = 0, secs = 0, timer = null;

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const key = () => `mm-${mode}-${size}`;
  const getBest = () => { try { return Number(localStorage.getItem(key())) || 0; } catch (e) { return 0; } };
  const setBest = v => { try { localStorage.setItem(key(), v); } catch (e) {} };

  function pick(group, attr, val) {
    document.querySelectorAll(group + " button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset[attr] === val)));
  }
  function showBest() {
    const b = getBest();
    $("menu-best").textContent = b ? `Your best for this setup: ${b} moves.` : "No score yet for this setup.";
  }

  function buildCards() {
    const { pairs } = SIZES[size];
    let cards = [];
    if (mode === "emoji") {
      shuffle(EMOJI).slice(0, pairs).forEach((e, id) => cards.push({ id, kind: "emoji", e }, { id, kind: "emoji", e }));
    } else {
      shuffle(FLAGS).slice(0, pairs).forEach(([code, name], id) => cards.push({ id, kind: "flag", code, name }, { id, kind: "name", name }));
    }
    return shuffle(cards);
  }

  function content(btn, c) {
    if (c.kind === "flag") {
      const img = document.createElement("img");
      img.src = `https://flagcdn.com/w160/${c.code}.png`;
      img.alt = "Flag of " + c.name;
      btn.appendChild(img);
    } else {
      btn.textContent = c.kind === "emoji" ? c.e : c.name;
      if (c.kind === "name") btn.classList.add("name");
    }
  }

  function start() {
    clearInterval(timer);
    first = null; lock = false; moves = 0; found = 0; secs = 0; timer = null;
    $("moves").textContent = 0; $("time").textContent = "0:00";
    const { cols, pairs } = SIZES[size];
    const board = $("board");
    board.innerHTML = "";
    board.style.setProperty("--cols", cols);
    board.className = "board" + (cols === 6 ? " c6" : "");
    $("hint").textContent = mode === "flags" ? "Match each flag with its country name." : "Match each emoji with its twin.";
    buildCards().forEach(c => {
      const b = document.createElement("button");
      b.className = "card";
      b.setAttribute("aria-label", "Hidden card");
      content(b, c);
      b.onclick = () => flip(b, c, pairs);
      board.appendChild(b);
    });
    $("menu").hidden = true; $("game").hidden = false; $("win").hidden = true;
  }

  function flip(btn, c, pairs) {
    if (lock || btn.classList.contains("open") || btn.classList.contains("done")) return;
    if (!timer) timer = setInterval(() => { secs++; $("time").textContent = fmt(secs); }, 1000);
    btn.classList.add("open");
    if (!first) { first = { btn, c }; return; }
    moves++; $("moves").textContent = moves;
    const a = first; first = null;
    if (a.c.id === c.id) {
      [a.btn, btn].forEach(x => { x.classList.remove("open"); x.classList.add("done"); });
      if (++found === pairs) win();
    } else {
      lock = true;
      setTimeout(() => { a.btn.classList.remove("open"); btn.classList.remove("open"); lock = false; }, 800);
    }
  }

  function win() {
    clearInterval(timer);
    const best = getBest();
    const isBest = !best || moves < best;
    if (isBest) setBest(moves);
    $("win-text").textContent = `${moves} moves in ${fmt(secs)}. ` + (isBest ? "That is your best for this setup." : `Your best is ${best} moves.`);
    $("win").hidden = false;
  }

  function home() { clearInterval(timer); $("game").hidden = true; $("win").hidden = true; $("menu").hidden = false; showBest(); }

  document.querySelectorAll("#modes button").forEach(b => b.onclick = () => { mode = b.dataset.mode; pick("#modes", "mode", mode); showBest(); });
  document.querySelectorAll("#sizes button").forEach(b => b.onclick = () => { size = b.dataset.size; pick("#sizes", "size", size); showBest(); });
  $("start").onclick = start;
  $("restart").onclick = start;
  $("again").onclick = start;
  $("home").onclick = home;
  $("win-home").onclick = home;
  $("share").onclick = () => {
    const what = mode === "flags" ? "flag match" : "emoji match";
    const text = `I finished ${what} (${size}) in ${moves} moves and ${fmt(secs)}. Can you beat me? ${location.href}`;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };
  showBest();
})();
