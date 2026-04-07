/* ═══════════════════════════════════════════════════════════
   DHRUVI ENTERPRISE — PREMIUM AI VIRTUAL ASSISTANT
   Handcrafted for a seamless, client-side experience.
   No external API required. Optimized for Dhruvi Enterprise.
   Drop this <script src="chatbot.js"></script> before </body>.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';


  /* ─── CONFIG ─── */
  const GEMINI_API_KEY = 'AIzaSyBUOFdHDWsQH9_6PbOEnGXQQqBFFQ2MpIA'; // <-- Replace with your key
  const GEMINI_MODEL = 'gemini-2.5-flash-lite';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const SYSTEM_PROMPT = `You are the AI Style Assistant for Dhruvi Enterprise, a premium Indian fashion brand specialising in customised T-shirts, lifestyle wear, and curated fashion accessories for men. You communicate with the warmth, sophistication, and confidence of a luxury brand representative.

Your role:
• Help customers discover products, collections, and styles that suit them.
• Answer questions about the brand's story, quality, customisation options, and craftsmanship.
• Guide users on sizing, styling tips, and outfit pairings.
• Provide information about the contact page for orders and enquiries.
• Keep every response elegant, concise, and on-brand.

Brand facts:
- Founded: 2020
- Specialty: Premium customised T-shirts & lifestyle fashion for men
- Aesthetic: Clean, sophisticated, modern Indian fashion
- Contact: Available via the Contact page on the website
- Pages: Home, About, Products, Contact

If you don't know something specific, gracefully suggest the user visit the Contact page or reach out directly. Keep responses under 120 words unless a detailed answer is genuinely needed. Never discuss politics, religion, or topics unrelated to fashion and the brand.`;

  /* ─── INJECT STYLES ─── */

  /* ─── DESIGN SYSTEM (HSL & GLASSMORPHISM) ─── */

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
    
    #dhrv-chat-root-container {
      --chat-bg: hsla(0, 0%, 100%, 0.9);
      --chat-glass: hsla(0, 0%, 100%, 0.7);
      --chat-header-bg: hsl(20, 10%, 10%);
      --chat-accent: hsl(18, 30%, 38%);
      --chat-accent-hover: hsl(18, 30%, 30%);
      --chat-accent-soft: hsla(18, 30%, 38%, 0.1);
      --chat-muted: hsl(20, 8%, 60%);
      --chat-border: hsla(20, 15%, 90%, 0.8);
      --chat-text: hsl(20, 10%, 12%);
      --chat-font: 'Outfit', 'Montserrat', sans-serif;
      --chat-serif: 'Cormorant Garamond', serif;
      --chat-radius: 12px;
      --chat-shadow: 0 30px 90px hsla(20, 30%, 10%, 0.15), 0 10px 30px hsla(20, 30%, 10%, 0.08);
    }

    /* ── FAB Toggle Button ── */
    #dhrv-chat-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--chat-header-bg);
      border: none;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 40px hsla(18, 30%, 10%, 0.25);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      padding: 0;
      outline: none;
    }
    #dhrv-chat-fab:hover {
      background: var(--chat-accent);
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 15px 45px hsla(18, 30%, 10%, 0.3);
    }
    #dhrv-chat-fab svg {
      width: 26px;
      height: 26px;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    #dhrv-chat-fab .fab-icon-chat  { position: absolute; stroke: #fff; }
    #dhrv-chat-fab .fab-icon-close { position: absolute; opacity: 0; transform: rotate(-180deg) scale(0.5); stroke: #fff; }
    #dhrv-chat-fab.open .fab-icon-chat  { opacity: 0; transform: rotate(180deg) scale(0.5); }
    #dhrv-chat-fab.open .fab-icon-close { opacity: 1; transform: rotate(0) scale(1); }

    /* Notification dot */
    #dhrv-chat-fab .fab-dot {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #C4A484;
      border: 2px solid var(--chat-header-bg);
      animation: dhrv-pulse 2.5s infinite;
      z-index: 2;
    }
    #dhrv-chat-fab.open .fab-dot { display: none; }

    @keyframes dhrv-pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 164, 132, 0.7); }
      70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(196, 164, 132, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(196, 164, 132, 0); }
    }

    /* ── Chat Window ── */
    #dhrv-chat-root {
      position: fixed;
      bottom: 110px;
      right: 32px;
      width: 400px;
      height: 620px;
      max-height: calc(100vh - 150px);
      display: flex;
      flex-direction: column;
      background: var(--chat-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid hsla(0, 0%, 100%, 0.4);
      border-radius: var(--chat-radius);
      box-shadow: var(--chat-shadow);
      z-index: 10000;
      font-family: var(--chat-font);
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0.8) translateY(40px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    #dhrv-chat-root.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* ── Header ── */
    #dhrv-chat-header {
      background: var(--chat-header-bg);
      padding: 24px 28px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      position: relative;
    }
    .dhrv-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--chat-accent) 0%, #C4A484 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .dhrv-avatar svg { width: 22px; height: 22px; }
    .dhrv-header-text { flex: 1; }
    .dhrv-header-name {
      font-family: var(--chat-serif);
      font-size: 19px;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 0.05em;
      line-height: 1.2;
    }
    .dhrv-header-status {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.15em;
      color: #C4A484;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }
    .dhrv-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4caf50;
      box-shadow: 0 0 8px #4caf50;
      animation: dhrv-blink 2s infinite;
    }
    @keyframes dhrv-blink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.9); }
    }
    #dhrv-chat-clear:hover { background: hsla(0, 0%, 100%, 0.2); transform: rotate(90deg); }
    
    #dhrv-chat-close-mobile {
      background: hsla(0, 0%, 100%, 0.1);
      border: none;
      color: #fff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: none; /* Only show on mobile */
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    #dhrv-chat-close-mobile:hover { background: hsla(0, 0%, 100%, 0.2); }

    /* ── Messages ── */
    #dhrv-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 30px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: transparent;
    }
    #dhrv-chat-messages::-webkit-scrollbar { width: 4px; }
    #dhrv-chat-messages::-webkit-scrollbar-thumb { background: var(--chat-border); border-radius: 10px; }

    .dhrv-message {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      margin-bottom: 8px;
      animation: dhrv-msgSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
    @keyframes dhrv-msgSlideIn {
      from { opacity: 0; transform: translateY(15px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .dhrv-message.bot  { align-self: flex-start; }
    .dhrv-message.user { align-self: flex-end; }

    .dhrv-bubble {
      padding: 14px 18px;
      font-size: 14px;
      line-height: 1.6;
      position: relative;
      word-wrap: break-word;
    }
    .dhrv-message.bot .dhrv-bubble {
      background: #ffffff;
      border: 1px solid var(--chat-border);
      color: var(--chat-text);
      border-radius: 4px 18px 18px 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .dhrv-message.user .dhrv-bubble {
      background: var(--chat-accent);
      color: #ffffff;
      border-radius: 18px 4px 18px 18px;
      box-shadow: 0 8px 20px hsla(18, 30%, 10%, 0.15);
    }
    .dhrv-msg-time {
      font-size: 10px;
      color: var(--chat-muted);
      margin-top: 6px;
      font-weight: 500;
    }
    .dhrv-message.user .dhrv-msg-time { text-align: right; }

    /* Typing indicator */
    .dhrv-typing {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 18px;
      background: #ffffff;
      border: 1px solid var(--chat-border);
      border-radius: 4px 18px 18px 18px;
      align-self: flex-start;
      margin-bottom: 10px;
    }
    .dhrv-typing span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--chat-accent);
      animation: dhrv-bounce 1.4s ease-in-out infinite;
      opacity: 0.6;
    }
    .dhrv-typing span:nth-child(2) { animation-delay: 0.2s; }
    .dhrv-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dhrv-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-8px); }
    }

    /* Quick reply chips */
    #dhrv-quick-chips {
      padding: 10px 24px 20px;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      flex-shrink: 0;
      scrollbar-width: none;
    }
    #dhrv-quick-chips::-webkit-scrollbar { display: none; }
    .dhrv-chip {
      padding: 10px 18px;
      border: 1px solid var(--chat-border);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--chat-accent);
      background: #ffffff;
      cursor: pointer;
      border-radius: 30px;
      transition: all 0.3s ease;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.03);
    }
    .dhrv-chip:hover {
      border-color: var(--chat-accent);
      background: var(--chat-accent);
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    }

    /* ── Input Bar ── */
    #dhrv-chat-input-wrap {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      padding: 15px 24px 10px;
      background: hsla(0, 0%, 100%, 0.5);
      border-top: 1px solid var(--chat-border);
      flex-shrink: 0;
    }
    #dhrv-chat-input {
      flex: 1;
      border: 1px solid var(--chat-border);
      border-radius: 20px;
      padding: 12px 18px;
      font-family: var(--chat-font);
      font-size: 14px;
      color: var(--chat-text);
      outline: none;
      background: #ffffff;
      transition: all 0.3s ease;
      resize: none;
      max-height: 120px;
      line-height: 1.5;
    }
    #dhrv-chat-input:focus { border-color: var(--chat-accent); box-shadow: 0 0 0 3px var(--chat-accent-soft); }
    #dhrv-chat-send {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--chat-accent);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 15px hsla(18, 30%, 10%, 0.2);
      padding: 0;
    }
    #dhrv-chat-send:hover { background: var(--chat-accent-hover); transform: scale(1.1) rotate(-10deg); }
    #dhrv-chat-send:disabled { background: var(--chat-muted); cursor: not-allowed; transform: none; opacity: 0.5; }
    #dhrv-chat-send svg { width: 20px; height: 20px; stroke: #fff; fill: #fff; }

    #dhrv-chat-footer-note {
      text-align: center;
      padding: 10px 0 15px;
      font-size: 10px;
      color: var(--chat-muted);
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    /* ── Mobile ── */
    @media (max-width: 500px) {
      #dhrv-chat-root {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
        box-shadow: none;
      }
      #dhrv-chat-header {
        padding: 56px 20px 20px;
      }
      #dhrv-chat-close-mobile {
        display: flex;
      }
      #dhrv-chat-messages {
        padding: 20px 20px;
      }
      #dhrv-chat-input-wrap {
        padding: 12px 20px 24px;
      }
      #dhrv-chat-fab {
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
      }
    }
    @media (max-width: 340px) {
      .dhrv-header-name { font-size: 17px; }
      .dhrv-bubble { font-size: 13px; }
    }
  `;
  document.head.appendChild(style);

  /* ─── CHAT LOGIC ─── */
  const BRAND = {
    name: "Dhruvi Enterprise",
    assistant: "Dhruvi Enterprise’s virtual assistant",
    greeting: "Welcome to Dhruvi Enterprise. I’m your virtual assistant, here to help you with our products, services, custom inquiries, and order-related support. How may I assist you today?",
    fallback: "Thank you for your query. For the most accurate details, please connect with the Dhruvi Enterprise team directly, and we will assist you further.",
    about: "Dhruvi Enterprise is an e-commerce business focused on delivering quality products and a smooth online shopping experience. We help customers with product inquiries, customized solutions, and reliable support.",
    services: "Dhruvi Enterprise provides e-commerce product support, clothing and customized product assistance, print-on-demand related guidance, order support, and help with product inquiries for individual as well as bulk requirements.",
  };

  const INTENTS = [
    {
      keywords: [/what is dhruvi/i, /about dhruvi/i, /who are you/i, /company/i],
      reply: BRAND.about
    },
    {
      keywords: [/service/i, /provide/i, /offer/i, /what do you do/i],
      reply: BRAND.services
    },
    {
      keywords: [/custom/i, /personalize/i, /bulk/i, /design own/i, /print on demand/i],
      reply: "Yes, Dhruvi Enterprise can assist with custom order inquiries. Please share what type of product or customization you need, and our team can guide you further."
    },
    {
      keywords: [/product/i, /clothing/i, /item/i, /fashion/i, /buy/i],
      reply: "Sure, I’d be happy to help. Please let me know what kind of product you are looking for, and I’ll guide you accordingly."
    },
    {
      keywords: [/contact/i, /reach/i, /help/i, /support/i, /phone/i, /email/i],
      reply: "For custom or bulk requirements, or any direct assistance, our team can assist you directly. Would you like to explore our products or connect with our team?"
    },
    {
      keywords: [/owner/i, /founder/i, /ceo/i, /who runs/i],
      reply: "Dhruvi Enterprise is a privately owned boutique fashion brand. Our team is dedicated to delivering premium quality and a seamless shopping experience for every customer. For specific business inquiries or collaborations, you're welcome to connect with us directly through our Contact page!"
    },
    {
      keywords: [/location/i, /where are you/i, /where is/i, /based/i, /address/i],
      reply: "Dhruvi Enterprise is a premium e-commerce business serving customers globally. While we primarily operate online to provide a smooth shopping experience, our roots are firmly planted in quality service and reliable product delivery."
    },
    {
      keywords: [/start/i, /when did you/i, /history/i, /established/i, /how old/i],
      reply: "Dhruvi Enterprise was established in 2020 with a mission to elevate everyday fashion through luxury details and quality products. We've been growing ever since, thanks to our wonderful community of customers."
    },
    {
      keywords: [/ship/i, /delivery/i, /how long/i, /time/i, /arrival/i],
      reply: "We aim for timely and reliable delivery of all our products. For specific shipping timelines based on your location or custom order requirements, please contact our team directly—we'll be happy to provide an estimate!"
    },
    {
      keywords: [/trust/i, /safe/i, /secure/i, /reliable/i, /quality/i],
      reply: "At Dhruvi Enterprise, trust and quality are our top priorities. We focus on providing styling, reliable, and customer-friendly solutions. Your shopping experience and satisfaction are very important to us."
    },
    {
      keywords: [/hi/i, /hello/i, /hey/i],
      reply: BRAND.greeting
    }
  ];

  function getReply(input) {
    const text = input.trim();
    for (const intent of INTENTS) {
      if (intent.keywords.some(kw => kw.test(text))) return intent.reply;
    }
    return BRAND.fallback;
  }

  /* ─── DOM INJECTION ─── */
  const container = document.createElement('div');
  container.id = 'dhrv-chat-root-container';
  document.body.appendChild(container);

  container.innerHTML = `
    <button id="dhrv-chat-fab" aria-label="Open support chat">
      <span class="fab-dot"></span>
      <svg class="fab-icon-chat" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <svg class="fab-icon-close" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <div id="dhrv-chat-root">
      <div id="dhrv-chat-header">
        <div class="dhrv-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        </div>
        <div class="dhrv-header-text">
          <div class="dhrv-header-name">Style Assistant</div>
          <div class="dhrv-header-status"><span class="dhrv-status-dot"></span> Active Now</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="dhrv-chat-clear" aria-label="Clear chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          <button id="dhrv-chat-close-mobile" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div id="dhrv-chat-messages"></div>
      <div id="dhrv-quick-chips">
        <button class="dhrv-chip" data-msg="What is Dhruvi Enterprise?">About Us</button>
        <button class="dhrv-chip" data-msg="What services do you provide?">Services</button>
        <button class="dhrv-chip" data-msg="Can I place a custom order?">Custom Orders</button>
      </div>
      <div id="dhrv-chat-input-wrap">
        <textarea id="dhrv-chat-input" placeholder="Type a message..." rows="1"></textarea>
        <button id="dhrv-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
        </button>
      </div>
      <div id="dhrv-chat-footer-note">✦ Dhruvi Enterprise ✦</div>
    </div>
  `;

  const fab = document.getElementById('dhrv-chat-fab');
  const root = document.getElementById('dhrv-chat-root');
  const messagesEl = document.getElementById('dhrv-chat-messages');
  const inputEl = document.getElementById('dhrv-chat-input');
  const sendBtn = document.getElementById('dhrv-chat-send');
  const clearBtn = document.getElementById('dhrv-chat-clear');
  const closeMobileBtn = document.getElementById('dhrv-chat-close-mobile');

  let isOpen = false;
  let isThinking = false;

  function appendMsg(role, text) {
    const msg = document.createElement('div');
    msg.className = `dhrv-message ${role}`;
    msg.innerHTML = `
      <div class="dhrv-bubble">${text}</div>
      <div class="dhrv-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function toggle() {
    isOpen = !isOpen;
    root.classList.toggle('open', isOpen);
    fab.classList.toggle('open', isOpen);
    if (isOpen && messagesEl.children.length === 0) {
      setTimeout(() => appendMsg('bot', BRAND.greeting), 500);
    }
  }

  async function handleSend() {
    const val = inputEl.value.trim();
    if (!val || isThinking) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    appendMsg('user', val);

    isThinking = true;
    const typing = document.createElement('div');
    typing.className = 'dhrv-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    setTimeout(() => {
      typing.remove();
      appendMsg('bot', getReply(val));
      isThinking = false;
    }, 800 + Math.random() * 800);
  }

  fab.addEventListener('click', toggle);
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
  inputEl.addEventListener('input', function () { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; });
  clearBtn.addEventListener('click', () => { messagesEl.innerHTML = ''; appendMsg('bot', BRAND.greeting); });
  closeMobileBtn.addEventListener('click', toggle);
  document.querySelectorAll('.dhrv-chip').forEach(c => c.addEventListener('click', () => { inputEl.value = c.dataset.msg; handleSend(); }));

})();
