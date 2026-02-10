(function () {
  const script = document.currentScript;
  const siteId = script.getAttribute("data-site-id");
  if (!siteId) return;

  const domain = location.hostname;
  const VERIFY_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/verify-site";

  /* ===== STYLES ===== */
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes jaya-float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0); }
  }

  .jaya-bubble {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: radial-gradient(circle, #0f172a, #020617);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 99999;
    animation: jaya-float 3s ease-in-out infinite;
    transition: box-shadow 0.3s ease;
  }

  .jaya-bubble:hover {
    box-shadow: 0 0 25px rgba(0,255,200,0.6);
  }

  .jaya-bubble img {
    width: 65px;
    height: 55px;
  }

  .jaya-chat {
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 340px;
    height: 420px;
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(16px);
    border-radius: 22px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.25);
    display: none;
    flex-direction: column;
    z-index: 99999;
    font-family: Inter, system-ui, sans-serif;
  }

  .jaya-header {
    padding: 16px;
    font-weight: 600;
    font-size: 14px;
    color: #020617;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }

  .jaya-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jaya-user {
  align-self: flex-end;
  background: rgba(15,118,110,0.15);
  padding: 10px 14px;
  border-radius: 14px 14px 4px 14px;
  max-width: 75%;
  color: #0f766e;
}

.jaya-bot {
  align-self: flex-start;
  background: rgba(0,0,0,0.06);
  padding: 10px 14px;
  border-radius: 14px 14px 14px 4px;
  max-width: 75%;
  color: #020617;
}


  /* 🔥 PREMIUM INPUT */
  .jaya-input-wrap {
    padding: 12px;
    display: flex;
    gap: 10px;
  }

  .jaya-input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.9);
    font-size: 14px;
    outline: none;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
  }

  .jaya-input:focus {
    border-color: rgba(15,118,110,0.5);
  }

  .jaya-send {
    padding: 12px 18px;
    border-radius: 999px;
    border: none;
    background: #0f766e;
    color: white;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 6px 14px rgba(15,118,110,0.35);
  }

.jaya-typing {
  align-self: flex-start;
  background: rgba(0,0,0,0.06);
  padding: 10px 14px;
  border-radius: 14px 14px 14px 4px;
  max-width: 75%;
  font-size: 14px;
  color: #020617;
  display: flex;
  gap: 4px;
}

.jaya-dot {
  width: 6px;
  height: 6px;
  background: #020617;
  border-radius: 50%;
  animation: jaya-blink 1.4s infinite both;
}

.jaya-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.jaya-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes jaya-blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
`;
  document.head.appendChild(style);

  /* ===== VERIFY ===== */
  fetch(`${VERIFY_URL}?site=${siteId}&domain=${domain}`)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "active") return;

      /* ===== BUBBLE ===== */
      const bubble = document.createElement("div");
      bubble.className = "jaya-bubble";
      const img = document.createElement("img");
      img.src = "jayabot.png"; // robot png
      bubble.appendChild(img);

      /* ===== CHAT ===== */
      const chat = document.createElement("div");
      chat.className = "jaya-chat";
      chat.innerHTML = `
        <div class="jaya-header">JAYA • AI CORE</div>
        <div class="jaya-messages">
          <div class="jaya-bot">System online. Awaiting input.</div>
        </div>
        <div class="jaya-input-wrap">
          <input class="jaya-input" placeholder="Ask JAYA…" />
          <button class="jaya-send">Send</button>
        </div>
      `;

      bubble.onclick = () => {
        chat.style.display =
          chat.style.display === "none" ? "flex" : "none";
      };

      const input = chat.querySelector(".jaya-input");
      const button = chat.querySelector(".jaya-send");
      const messages = chat.querySelector(".jaya-messages");

     button.onclick = () => {
  if (!input.value.trim()) return;

  // User message (RIGHT side)
  messages.innerHTML += `<div class="jaya-user">${input.value}</div>`;
  messages.scrollTop = messages.scrollHeight;
  input.value = "";

  // Typing indicator (LEFT side)
  const typing = document.createElement("div");
  typing.className = "jaya-typing";
  typing.innerHTML = `
    <div class="jaya-dot"></div>
    <div class="jaya-dot"></div>
    <div class="jaya-dot"></div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // Fake AI delay
  setTimeout(() => {
    typing.remove();
    messages.innerHTML += `<div class="jaya-bot">Response generated.</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 1200);
};


      document.body.appendChild(bubble);
      document.body.appendChild(chat);
    })
    .catch(() => {});
})();
