(function () {

  const script = document.currentScript;
  const siteId = script.getAttribute("data-site-id");
  if (!siteId) return;

  const domain = location.hostname;

  const VERIFY_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/verify-site";

  const CHAT_URL =
    "https://fkzhiuvezwmyyectcdht.supabase.co/functions/v1/chat";

  /* ---------------- STYLE ---------------- */

  const style = document.createElement("style");
  style.textContent = `
  .jaya-wrap{
    position:fixed;bottom:22px;right:22px;z-index:999999;
    text-align:center;font-family:system-ui;
  }

  .jaya-bubble{
    width:64px;height:64px;border-radius:50%;
    background:#020617;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;
    box-shadow:0 10px 30px rgba(0,0,0,.35);
    position:relative;
    overflow:hidden;
  }

  .jaya-bubble img{width:65px;height:55px}

  .jaya-label{
    font-size:11px;
    margin-top:4px;
    color:#0f172a;
    font-weight:600;
  }

  .jaya-wave{
    position:absolute;
    border-radius:50%;
    transform:scale(0);
    background:rgba(34,197,94,.35);
    animation:jaya-ripple .7s linear;
    pointer-events:none;
  }

  @keyframes jaya-ripple{
    to{transform:scale(3);opacity:0;}
  }

  .jaya-chat{
    position:fixed;
    bottom:110px;
    right:22px;
    width:360px;
    height:500px;
    background:#fff;
    border-radius:18px;
    box-shadow:0 25px 60px rgba(0,0,0,.25);
    display:none;
    flex-direction:column;
    overflow:hidden;
  }

  .jaya-header{
    padding:14px 16px;
    background:linear-gradient(135deg,#0f766e,#020617);
    color:#fff;
  }

  .jaya-header small{
    display:block;
    font-size:11px;
    opacity:.8;
  }

  .jaya-messages{
    flex:1;
    padding:12px;
    overflow:auto;
    display:flex;
    flex-direction:column;
    gap:8px;
    font-size:14px;
  }

  .jaya-user{
    align-self:flex-end;
    background:#dcfce7;
    padding:8px 12px;
    border-radius:14px;
  }

  .jaya-bot{
    align-self:flex-start;
    background:#f3f4f6;
    padding:8px 12px;
    border-radius:14px;
  }

  .jaya-typing{
    font-size:12px;
    color:#555;
  }

  .jaya-results{
    max-height:160px;
    overflow:auto;
    border-top:1px solid #eee;
    padding:8px;
    display:none;
    background:#fafafa;
  }

  .jaya-item{
    display:flex;
    gap:8px;
    margin-bottom:8px;
    background:#fff;
    border-radius:10px;
    padding:6px;
    box-shadow:0 2px 6px rgba(0,0,0,.05);
    align-items:center;
  }

  .jaya-item img{
    width:46px;height:46px;border-radius:8px;object-fit:cover;
  }

  .jaya-item-title{
    font-size:12px;font-weight:600;
  }

  .jaya-item-price{
    font-size:12px;color:#0f766e;
  }

  .jaya-item button{
    margin-left:auto;
    border:none;
    background:#020617;
    color:#fff;
    font-size:11px;
    padding:4px 8px;
    border-radius:8px;
    cursor:pointer;
  }

  .jaya-input-wrap{
    display:flex;
    gap:8px;
    padding:10px;
    border-top:1px solid #eee;
  }

  .jaya-input{
    flex:1;
    padding:9px 12px;
    border-radius:20px;
    border:1px solid #ccc;
    outline:none;
  }

  .jaya-send{
    padding:9px 14px;
    border-radius:20px;
    border:none;
    background:#0f766e;
    color:#fff;
    cursor:pointer;
  }
  `;
  document.head.appendChild(style);

  fetch(`${VERIFY_URL}?site=${encodeURIComponent(siteId)}&domain=${encodeURIComponent(domain)}`)
    .then(r => r.json())
    .then(data => {

      if (!data || data.status !== "active") return;

      const wrap = document.createElement("div");
      wrap.className = "jaya-wrap";

      const bubble = document.createElement("div");
      bubble.className = "jaya-bubble";

      const img = document.createElement("img");
      img.src = "jayabot.png";

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
          <small>Your website AI assistant</small>
        </div>

        <div class="jaya-messages">
          <div class="jaya-bot">Ask me about this website.</div>
        </div>

        <div class="jaya-results"></div>

        <div class="jaya-input-wrap">
          <input class="jaya-input" placeholder="Ask me about products, services or content…" />
          <button class="jaya-send">Send</button>
        </div>
      `;

      document.body.appendChild(wrap);
      document.body.appendChild(chat);

      bubble.onclick = (e) => {
        chat.style.display = chat.style.display === "flex" ? "none" : "flex";
        ripple(e);
      };

      function ripple(e){
        const d = document.createElement("span");
        d.className="jaya-wave";
        const r = bubble.getBoundingClientRect();
        const size = Math.max(r.width,r.height);
        d.style.width = d.style.height = size+"px";
        d.style.left = (e.clientX - r.left - size/2)+"px";
        d.style.top  = (e.clientY - r.top  - size/2)+"px";
        bubble.appendChild(d);
        setTimeout(()=>d.remove(),700);
      }

      const input = chat.querySelector(".jaya-input");
      const send  = chat.querySelector(".jaya-send");
      const msgs  = chat.querySelector(".jaya-messages");
      const resBox= chat.querySelector(".jaya-results");

      const placeholders = [
        "Ask me about services on this site…",
        "Find products under your budget…",
        "Ask about pricing or features…",
        "Explore content on this page…",
        "Search items using natural language…"
      ];

      let phIndex = 0;
      setInterval(()=>{
        phIndex = (phIndex+1)%placeholders.length;
        input.placeholder = placeholders[phIndex];
      },4500);

      send.onclick = sendMessage;
      input.addEventListener("keydown",e=>{
        if(e.key==="Enter") sendMessage();
      });

      async function sendMessage(){

        const text = input.value.trim();
        if(!text) return;

        msgs.innerHTML += `<div class="jaya-user">${escapeHtml(text)}</div>`;
        msgs.scrollTop = msgs.scrollHeight;
        input.value="";

        const typing = document.createElement("div");
        typing.className="jaya-typing";
        typing.textContent="Thinking…";
        msgs.appendChild(typing);

        resBox.style.display="none";
        resBox.innerHTML="";

        try{
          const r = await fetch(CHAT_URL,{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({
              message:text,
              site_id:siteId,
              page_text:collectPageText()
            })
          });

          const data = await r.json();
          typing.remove();

          if(!data.ok){
            msgs.innerHTML+=`<div class="jaya-bot">Inactive (${data.reason})</div>`;
            return;
          }

          const result = data.result;

          if(result.mode==="find"){
            const items = advancedFind(result);
            msgs.innerHTML+=`<div class="jaya-bot">Found ${items.length} items on this page.</div>`;
            showResults(items);
          }else{
            msgs.innerHTML+=`<div class="jaya-bot">${escapeHtml(result.answer)}</div>`;
          }

          msgs.scrollTop = msgs.scrollHeight;

        }catch{
          typing.remove();
          msgs.innerHTML+=`<div class="jaya-bot">Network error</div>`;
        }
      }

      function showResults(items){

        if(!items.length) return;

        resBox.style.display="block";
        resBox.innerHTML="";

        items.forEach(it=>{
          const row = document.createElement("div");
          row.className="jaya-item";

          const im = document.createElement("img");
          im.src = it.image || "https://via.placeholder.com/46";

          const info = document.createElement("div");
          info.innerHTML = `
            <div class="jaya-item-title">${escapeHtml(it.title||"Item")}</div>
            <div class="jaya-item-price">₹${it.price}</div>
          `;

          const btn = document.createElement("button");
          btn.textContent="View";
          btn.onclick=()=>{
            it.el.scrollIntoView({behavior:"smooth",block:"center"});
            it.el.style.outline="4px solid #22c55e";
            if(it.link) window.open(it.link,"_blank");
          };

          row.appendChild(im);
          row.appendChild(info);
          row.appendChild(btn);
          resBox.appendChild(row);
        });
      }

      function advancedFind(cmd){

        const priceRegex=/₹\s?\d+|\$\s?\d+/;
        const nodes=[...document.querySelectorAll("body *")]
          .filter(el=>priceRegex.test(el.textContent||""));

        const seen=new Set();
        const out=[];

        for(const n of nodes){

          let card=n.closest("article,li,section")||n.closest("div");
          if(!card||seen.has(card)) continue;
          seen.add(card);

          const text=card.innerText||"";
          const pm=text.match(priceRegex);
          if(!pm) continue;

          const price=Number(pm[0].replace(/[^\d]/g,""));

          let title=
            card.querySelector("h1,h2,h3,h4")?.innerText ||
            card.querySelector("img")?.alt ||
            text.split("\n").find(l=>l.trim().length>3&&!priceRegex.test(l))||
            "";

          title=title.trim();

          if(cmd.query){
            if(!smartMatch(cmd.query,title+" "+text)) continue;
          }

          if(cmd.maxPrice && price>cmd.maxPrice) continue;

          const image=card.querySelector("img")?.src||null;
          const link=card.querySelector("a")?.href||null;

          card.style.outline="3px solid #00ff99";

          out.push({title,price,image,link,el:card});
        }

        if(cmd.sort==="price_low_to_high"){
          out.sort((a,b)=>a.price-b.price);
        }

        return out;
      }

    });

  /* -------- helpers -------- */

  function collectPageText(){
    const blocks=[];
    ["main","article","section","p","li","h1","h2","h3"]
      .forEach(sel=>{
        document.querySelectorAll(sel).forEach(el=>{
          const t=(el.innerText||"").replace(/\s+/g," ").trim();
          if(t.length>40) blocks.push(t);
        });
      });
    return blocks.join("\n").slice(0,12000);
  }

  function smartMatch(q, text){

    const qw = normalize(q);
    const tw = normalize(text);

    return qw.some(qwrd =>
      tw.some(twrd =>
        twrd===qwrd ||
        twrd.startsWith(qwrd) ||
        qwrd.startsWith(twrd)
      )
    );
  }

  function normalize(str){
    return (str||"")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g," ")
      .split(/\s+/)
      .filter(w=>w.length>2)
      .map(w=>w.endsWith("s")?w.slice(0,-1):w);
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g,m=>(
      {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]
    ));
  }

})();
