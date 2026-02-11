(function () {
  /* ================= CONFIG ================= */

  const script = document.currentScript;
  const siteId = script && script.getAttribute("data-site-id");
  if (!siteId) return;

  const VERIFY_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/verify-site";

  const CHAT_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/chat";

  const BOT_IMAGE =
    "https://rjay7642.github.io/jaya-widget/jayabot.png";

  /* ================= STYLE ================= */

  const style = document.createElement("style");
  style.textContent = `
.jaya-wrap{
  position:fixed;bottom:32px;right:32px;z-index:999999;
  text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont;
}

.jaya-bubble{
  width:64px;height:64px;border-radius:50%;
  background:#020617;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;position:relative;overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,.35);
  user-select:none;touch-action:manipulation;
}

.jaya-bubble img{width:44px;height:44px;pointer-events:none}

.jaya-label{
  font-size:11px;margin-top:4px;color:#0f172a;font-weight:600;
  pointer-events:none;
}

.jaya-wave{
  position:absolute;border-radius:50%;
  transform:scale(0);
  background:rgba(34,197,94,.35);
  animation:jaya-ripple .7s linear;
  pointer-events:none;
}
@keyframes jaya-ripple{to{transform:scale(3);opacity:0}}

.jaya-chat{
  position:fixed;bottom:140px;right:32px;
  width:360px;height:500px;background:#fff;border-radius:18px;
  box-shadow:0 25px 60px rgba(0,0,0,.25);
  display:none;flex-direction:column;overflow:hidden;
  z-index:999999;
}

.jaya-header{
  padding:8px 12px;
  background:linear-gradient(135deg,#0f766e,#020617);
  color:#fff;font-size:13px;font-weight:600;line-height:1.2;
}
.jaya-header small{display:block;font-size:10px;opacity:.8;font-weight:400}

.jaya-messages{
  flex:1;padding:12px;overflow:auto;
  display:flex;flex-direction:column;gap:8px;font-size:14px;
}

.jaya-user{align-self:flex-end;background:#dcfce7;padding:8px 12px;border-radius:14px}
.jaya-bot{align-self:flex-start;background:#f3f4f6;padding:8px 12px;border-radius:14px}
.jaya-typing{font-size:12px;color:#555}

.jaya-results{
  max-height:160px;overflow:auto;border-top:1px solid #eee;
  padding:8px;display:none;background:#fafafa;
}

.jaya-item{
  display:flex;gap:8px;margin-bottom:8px;background:#fff;
  border-radius:10px;padding:6px;box-shadow:0 2px 6px rgba(0,0,0,.05);
  align-items:center;
}
.jaya-item img{width:46px;height:46px;border-radius:8px;object-fit:cover}
.jaya-item-title{font-size:12px;font-weight:600}
.jaya-item-price{font-size:12px;color:#0f766e}
.jaya-item button{
  margin-left:auto;border:none;background:#020617;color:#fff;
  font-size:11px;padding:4px 8px;border-radius:8px;cursor:pointer
}

.jaya-input-wrap{display:flex;gap:8px;padding:10px;border-top:1px solid #eee}
.jaya-input{
  flex:1;padding:9px 12px;border-radius:20px;border:1px solid #ccc;
  outline:none;font-size:14px
}
.jaya-send{
  padding:9px 14px;border-radius:20px;border:none;
  background:#0f766e;color:#fff;cursor:pointer
}

/* mobile */
@media (max-width:768px){
  .jaya-chat{
    left:12px;right:12px;width:auto;
    bottom:100px;height:65vh;max-height:520px;border-radius:16px;
  }
  .jaya-wrap{right:14px;bottom:14px}
  .jaya-bubble{width:56px;height:56px}
  .jaya-bubble img{width:38px;height:38px}
  .jaya-label{font-size:10px}
  .jaya-results{max-height:120px}
  .jaya-messages{font-size:13px}
}
@media (max-width:420px){
  .jaya-chat{height:70vh;bottom:90px}
  .jaya-results{max-height:100px}
}
`;
  document.head.appendChild(style);

  /* ================= VERIFY ================= */

  const domain = location.hostname;

  fetch(`${VERIFY_URL}?site=${encodeURIComponent(siteId)}&domain=${encodeURIComponent(domain)}`)
    .then(r => r.json())
    .then(data => {
      if (!data || data.status !== "active") return;
      mount();
    })
    .catch(() => {});

  /* ================= UI ================= */

  function mount() {

    const wrap = document.createElement("div");
    wrap.className = "jaya-wrap";

    const bubble = document.createElement("div");
    bubble.className = "jaya-bubble";

    const img = document.createElement("img");
    img.src = BOT_IMAGE;

    const label = document.createElement("div");
    label.className = "jaya-label";
    label.textContent = "Jaya Bot";

    bubble.appendChild(img);
    wrap.appendChild(bubble);
    wrap.appendChild(label);

    const chat = document.createElement("div");
    chat.className = "jaya-chat";
    chat.innerHTML = `
      <div class="jaya-header">
        Hi, I'm Jaya 👋
        <small>Your website assistant</small>
      </div>
      <div class="jaya-messages">
        <div class="jaya-bot">Ask me about tools, services or content on this site.</div>
      </div>
      <div class="jaya-results"></div>
      <div class="jaya-input-wrap">
        <input class="jaya-input" placeholder="Ask me about this website…" />
        <button class="jaya-send">Send</button>
      </div>
    `;

    document.body.appendChild(wrap);
    document.body.appendChild(chat);

    bubble.addEventListener("click", function (e) {
      chat.style.display = chat.style.display === "flex" ? "none" : "flex";
      ripple(e, bubble);
    });

    const input = chat.querySelector(".jaya-input");
    const sendBtn = chat.querySelector(".jaya-send");
    const msgs = chat.querySelector(".jaya-messages");
    const resultsBox = chat.querySelector(".jaya-results");

    const hints = [
      "Find tools like convert, resize, compress…",
      "Ask about features on this site…",
      "Search tools using natural language…",
      "Explore content on this page…"
    ];
    let hi = 0;
    setInterval(() => {
      hi = (hi + 1) % hints.length;
      input.placeholder = hints[hi];
    }, 4500);

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      msgs.innerHTML += `<div class="jaya-user">${escapeHtml(text)}</div>`;
      msgs.scrollTop = msgs.scrollHeight;
      input.value = "";

      const typing = document.createElement("div");
      typing.className = "jaya-typing";
      typing.textContent = "Thinking…";
      msgs.appendChild(typing);

      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";

      try {
        const r = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            site_id: siteId,
            page_text: collectPageText()
          })
        });

        const data = await r.json();
        typing.remove();

        if (!data || !data.ok) {
          msgs.innerHTML += `<div class="jaya-bot">Inactive</div>`;
          return;
        }

        const result = data.result;

        /* ---------- TOOL FIRST UX ---------- */

        if (result && result.mode === "find") {

          const items = advancedFind(result);

          msgs.innerHTML +=
            `<div class="jaya-bot">Found ${items.length} tools on this page.</div>`;

          showResults(items);

        } else {

          // local fallback (convert / resize / pdf to image etc.)
          const localItems = advancedFind({
            query: text,
            maxPrice: null,
            sort: null
          });

          if (localItems.length > 0) {

            msgs.innerHTML +=
              `<div class="jaya-bot">Here are the matching tools on this site.</div>`;

            showResults(localItems);

          } else {

            msgs.innerHTML +=
              `<div class="jaya-bot">${escapeHtml(result.answer || "Not found on this website.")}</div>`;
          }
        }

        msgs.scrollTop = msgs.scrollHeight;

      } catch (e) {
        typing.remove();
        msgs.innerHTML += `<div class="jaya-bot">Network error</div>`;
      }
    }

    /* ================= FIND ENGINE ================= */

    function advancedFind(cmd) {

      const priceRegex = /₹\s?\d+|\$\s?\d+/;
      const nodes = Array.from(document.querySelectorAll("body *"))
        .filter(el => priceRegex.test(el.textContent || "") || looksLikeToolCard(el));

      const seen = new Set();
      const out = [];

      for (const n of nodes) {

        let card =
          n.closest("article,li,section") ||
          n.closest("div");

        if (!card || seen.has(card)) continue;
        seen.add(card);

        const text = (card.innerText || "").trim();
        if (!text) continue;

        let price = null;
        const pm = text.match(priceRegex);
        if (pm) price = Number(pm[0].replace(/[^\d]/g, ""));

        let title =
          card.querySelector("h1,h2,h3,h4")?.innerText ||
          card.querySelector("strong")?.innerText ||
          card.querySelector("img")?.alt ||
          text.split("\n")[0] ||
          "";

        title = title.trim();

        if (cmd.query) {
          if (!smartMatch(cmd.query, title + " " + text)) continue;
        }

        if (cmd.maxPrice && price && price > cmd.maxPrice) continue;

        const image = card.querySelector("img")?.src || null;
        const link = card.querySelector("a")?.href || null;

        card.style.outline = "3px solid #00ff99";
        card.style.outlineOffset = "3px";

        out.push({ title, price, image, link, el: card });
      }

      if (cmd.sort === "price_low_to_high") {
        out.sort((a, b) => (a.price || 0) - (b.price || 0));
      }

      return out;
    }

    function showResults(items) {

      if (!items || !items.length) return;

      resultsBox.style.display = "block";
      resultsBox.innerHTML = "";

      items.forEach(it => {

        const row = document.createElement("div");
        row.className = "jaya-item";

        const im = document.createElement("img");
        im.src = it.image || "https://via.placeholder.com/46";

        const info = document.createElement("div");
        info.innerHTML = `
          <div class="jaya-item-title">${escapeHtml(it.title || "Item")}</div>
          ${it.price ? `<div class="jaya-item-price">₹${it.price}</div>` : ""}
        `;

        const btn = document.createElement("button");
        btn.textContent = "View";
        btn.addEventListener("click", function () {
          it.el.scrollIntoView({ behavior: "smooth", block: "center" });
          it.el.style.outline = "4px solid #22c55e";
          if (it.link) window.open(it.link, "_blank");
        });

        row.appendChild(im);
        row.appendChild(info);
        row.appendChild(btn);

        resultsBox.appendChild(row);
      });
    }
  }

  /* ================= HELPERS ================= */

  function ripple(e, bubble) {
    const d = document.createElement("span");
    d.className = "jaya-wave";
    const r = bubble.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    d.style.width = d.style.height = size + "px";
    d.style.left = (e.clientX - r.left - size / 2) + "px";
    d.style.top = (e.clientY - r.top - size / 2) + "px";
    bubble.appendChild(d);
    setTimeout(() => d.remove(), 700);
  }

  function collectPageText() {
    const blocks = [];
    const selectors = ["main", "article", "section", "p", "li", "h1", "h2", "h3"];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const t = (el.innerText || "").replace(/\s+/g, " ").trim();
        if (t && t.length > 40) blocks.push(t);
      });
    });
    return blocks.join("\n").slice(0, 12000);
  }

  function smartMatch(query, text) {
    const qw = normalizeWords(query);
    const tw = normalizeWords(text);
    return qw.some(q =>
      tw.some(t => t === q || t.startsWith(q) || q.startsWith(t))
    );
  }

  function normalizeWords(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(w => (w.endsWith("s") ? w.slice(0, -1) : w));
  }

  function looksLikeToolCard(el) {
    const t = (el.textContent || "").toLowerCase();
    return /(compress|resize|convert|pdf|image|tool|merge|split|watermark|metadata)/.test(t);
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[m]);
  }

})();
