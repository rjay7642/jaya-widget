(function () {

  const script = document.currentScript;
  const siteId = script && script.getAttribute("data-site-id");
  if (!siteId) return;

  const VERIFY_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/verify-site";

  const CHAT_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/chat";

  const BOT_IMAGE =
    "https://rjay7642.github.io/jaya-widget/jayabot.png";

  const domain = location.hostname;

  /* ---------------- STYLE ---------------- */

  const style = document.createElement("style");
  style.textContent = `
.jaya-wrap{
  position:fixed;
  right:16px;
  bottom:16px;
  z-index:2147483647;
  font-family:system-ui,-apple-system,BlinkMacSystemFont;
  text-align:center;
}

.jaya-bubble{
  width:56px;
  height:56px;
  border-radius:50%;
  background:#020617;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  box-shadow:0 8px 22px rgba(0,0,0,.35);
  user-select:none;
  touch-action:manipulation;
}

.jaya-bubble img{
  width:34px;
  height:34px;
  pointer-events:none;
}

.jaya-label{
  font-size:10px;
  font-weight:600;
  margin-top:4px;
  color:#020617;
  pointer-events:none;
}

.jaya-chat{
  position:fixed;
  right:16px;
  bottom:88px;

  width:300px;
  height:400px;

  background:#fff;
  border-radius:14px;
  box-shadow:0 18px 40px rgba(0,0,0,.25);

  display:none;
  flex-direction:column;
  overflow:hidden;

  z-index:2147483647;
  transform:none !important;
}

.jaya-header{
  padding:6px 10px;
  background:linear-gradient(135deg,#0f766e,#020617);
  color:#fff;
  font-size:12px;
  font-weight:600;
}

.jaya-header small{
  display:block;
  font-size:10px;
  opacity:.8;
  font-weight:400;
}

.jaya-messages{
  flex:1;
  padding:10px;
  overflow:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
  font-size:13px;
}

.jaya-user{
  align-self:flex-end;
  background:#dcfce7;
  padding:7px 10px;
  border-radius:12px;
}

.jaya-bot{
  align-self:flex-start;
  background:#f3f4f6;
  padding:7px 10px;
  border-radius:12px;
}

.jaya-typing{
  font-size:11px;
  color:#666;
}

.jaya-results{
  display:none;
  max-height:120px;
  overflow:auto;
  border-top:1px solid #eee;
  padding:6px;
  background:#fafafa;
}

.jaya-item{
  display:flex;
  gap:6px;
  padding:6px;
  border-radius:8px;
  background:#fff;
  box-shadow:0 2px 6px rgba(0,0,0,.05);
  margin-bottom:6px;
  align-items:center;
}

.jaya-item img{
  width:36px;
  height:36px;
  border-radius:6px;
  object-fit:cover;
}

.jaya-item-title{
  font-size:11px;
  font-weight:600;
}

.jaya-item button{
  margin-left:auto;
  border:none;
  background:#020617;
  color:#fff;
  font-size:10px;
  padding:4px 8px;
  border-radius:6px;
  cursor:pointer;
}

.jaya-input-wrap{
  display:flex;
  gap:6px;
  padding:8px;
  border-top:1px solid #eee;
}

.jaya-input{
  flex:1;
  border:1px solid #ccc;
  border-radius:14px;
  padding:6px 10px;
  font-size:13px;
  outline:none;
}

.jaya-send{
  border:none;
  border-radius:14px;
  padding:6px 10px;
  font-size:12px;
  background:#0f766e;
  color:#fff;
  cursor:pointer;
}

/* mobile */

@media (max-width:768px){
  .jaya-chat{
    left:10px;
    right:10px;
    width:auto;
    height:60vh;
    bottom:76px;
  }

  .jaya-wrap{
    right:12px;
    bottom:12px;
  }
}

@media (max-width:420px){
  .jaya-chat{
    height:65vh;
  }
}
`;
  document.head.appendChild(style);

  /* ---------------- VERIFY ---------------- */

  fetch(
    `${VERIFY_URL}?site=${encodeURIComponent(siteId)}&domain=${encodeURIComponent(domain)}`
  )
    .then(r => r.json())
    .then(d => {
      if (d && d.status === "active") mount();
    })
    .catch(() => {});

  /* ---------------- UI ---------------- */

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
        <div class="jaya-bot">
          Ask me about this website or general questions.
        </div>
      </div>

      <div class="jaya-results"></div>

      <div class="jaya-input-wrap">
        <input class="jaya-input" placeholder="Ask something…" />
        <button class="jaya-send">Send</button>
      </div>
    `;

    document.body.appendChild(wrap);
    document.body.appendChild(chat);

    bubble.addEventListener("click", () => {
      chat.style.display =
        chat.style.display === "flex" ? "none" : "flex";
    });

    const input = chat.querySelector(".jaya-input");
    const send = chat.querySelector(".jaya-send");
    const msgs = chat.querySelector(".jaya-messages");
    const resultsBox = chat.querySelector(".jaya-results");

    send.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {

      const text = input.value.trim();
      if (!text) return;

      /* -------- human small talk -------- */

      if (/^(hi|hello|hey|hii|hlo|thanks|thank you)$/i.test(text)) {
        msgs.innerHTML += `
          <div class="jaya-user">${escapeHtml(text)}</div>
          <div class="jaya-bot">
            Hi 👋 I’m Jaya.  
            You can ask me about tools on this site or general questions.
          </div>`;
        msgs.scrollTop = msgs.scrollHeight;
        input.value="";
        return;
      }

      if (/^\d+\s*(kb|mb)?$/i.test(text)) {
        msgs.innerHTML += `
          <div class="jaya-user">${escapeHtml(text)}</div>
          <div class="jaya-bot">
            Please tell me what you want to do.  
            Example: compress image to ${escapeHtml(text)}
          </div>`;
        msgs.scrollTop = msgs.scrollHeight;
        input.value="";
        return;
      }

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

        const res = await fetch(CHAT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            site_id: siteId,
            message: text,
            page_text: collectPageText()
          })
        });

        const data = await res.json();
        typing.remove();

        if (!data || !data.ok) {
          msgs.innerHTML += `<div class="jaya-bot">Service unavailable.</div>`;
          return;
        }

        const result = data.result;

        /* ---------- tool first ---------- */

        if (result && result.mode === "find") {

          const items = findTools(result.query || text);

          msgs.innerHTML +=
            `<div class="jaya-bot">Found ${items.length} matching tools.</div>`;

          showResults(items);

        } else {

          const isToolQuery =
            /(tool|convert|resize|compress|pdf|merge|split|image|watermark|metadata)/i.test(text);

          if (isToolQuery) {

            const items = findTools(text);

            if (items.length) {

              msgs.innerHTML +=
                `<div class="jaya-bot">Here are the relevant tools.</div>`;

              showResults(items);

            } else {

              msgs.innerHTML +=
                `<div class="jaya-bot">${escapeHtml(result.answer)}</div>`;
            }

          } else {

            msgs.innerHTML +=
              `<div class="jaya-bot">${escapeHtml(result.answer)}</div>`;
          }
        }

        msgs.scrollTop = msgs.scrollHeight;

      } catch {
        typing.remove();
        msgs.innerHTML += `<div class="jaya-bot">Network error.</div>`;
      }
    }

    /* ---------------- local tool finder ---------------- */

    function findTools(query) {

      const cards = Array.from(
        document.querySelectorAll("section,article,li,div")
      );

      const out = [];
      const seen = new Set();

      for (const c of cards) {

        if (seen.has(c)) continue;

        const text = (c.innerText || "").trim();
        if (!text) continue;

        if (!smartMatch(query, text)) continue;

        seen.add(c);

        const title =
          c.querySelector("h1,h2,h3,h4,strong")?.innerText ||
          text.split("\n")[0];

        const img = c.querySelector("img")?.src || null;

        out.push({ el: c, title, image: img });
      }

      return out.slice(0, 8);
    }

    function showResults(items) {

      if (!items.length) return;

      resultsBox.style.display = "block";
      resultsBox.innerHTML = "";

      items.forEach(it => {

        const row = document.createElement("div");
        row.className = "jaya-item";

        const im = document.createElement("img");
        im.src = it.image || "https://via.placeholder.com/40";

        const info = document.createElement("div");
        info.innerHTML =
          `<div class="jaya-item-title">${escapeHtml(it.title)}</div>`;

        const btn = document.createElement("button");
        btn.textContent = "Go";

        btn.onclick = () => {
          it.el.scrollIntoView({ behavior: "smooth", block: "center" });
          it.el.style.boxShadow = "0 0 0 3px #22c55e";
          setTimeout(() => it.el.style.boxShadow = "", 1200);
        };

        row.appendChild(im);
        row.appendChild(info);
        row.appendChild(btn);
        resultsBox.appendChild(row);
      });
    }

  }

  /* ---------------- helpers ---------------- */

  function collectPageText() {

    const blocks = [];
    const sel = ["main", "article", "section", "p", "li", "h1", "h2", "h3"];

    sel.forEach(s => {
      document.querySelectorAll(s).forEach(el => {
        const t = (el.innerText || "").replace(/\s+/g, " ").trim();
        if (t.length > 40) blocks.push(t);
      });
    });

    return blocks.join("\n").slice(0, 12000);
  }

  function smartMatch(q, text) {

    const qw = normalize(q);
    const tw = normalize(text);

    return qw.some(a =>
      tw.some(b => b === a || b.startsWith(a) || a.startsWith(b))
    );
  }

  function normalize(s) {

    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2)
      .map(w => w.endsWith("s") ? w.slice(0, -1) : w);
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m]);
  }

})();
