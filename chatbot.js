/* ═══════════════════════════════════════════════════════════
   DHRUVI ENTERPRISE — AI STYLE ASSISTANT CHATBOT
   Drop this <script src="chatbot.js"></script> anywhere in <body>
   before </body>. Requires a valid Gemini API key.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const GEMINI_API_KEY = 'AIzaSyDtk1haXmjoO-3WdweZ_fHa5xO6PRWDSsU'; // <-- Replace with your key
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
  const style = document.createElement('style');
  style.textContent = `
    /* ── Chatbot Root Variables ── */
    #dhrv-chat-root {
      --chat-bg: #ffffff;
      --chat-header-bg: #1a1714;
      --chat-accent: #7a5545;
      --chat-accent-light: #f5ede8;
      --chat-muted: #9a928e;
      --chat-border: #ece9e5;
      --chat-font: 'Montserrat', sans-serif;
      --chat-serif: 'Cormorant Garamond', serif;
      --chat-radius: 3px;
      --chat-shadow: 0 24px 80px rgba(26,23,20,0.18), 0 4px 20px rgba(26,23,20,0.10);
    }

    /* ── FAB Toggle Button ── */
    #dhrv-chat-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #1a1714;
      border: none;
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(26,23,20,0.28), 0 2px 8px rgba(122,85,69,0.18);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, background 0.25s ease;
      overflow: hidden;
    }
    #dhrv-chat-fab:hover {
      background: #7a5545;
      transform: translateY(-3px) scale(1.06);
      box-shadow: 0 14px 40px rgba(122,85,69,0.32);
    }
    #dhrv-chat-fab svg {
      width: 24px;
      height: 24px;
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s;
    }
    #dhrv-chat-fab .fab-icon-chat  { position: absolute; }
    #dhrv-chat-fab .fab-icon-close { position: absolute; opacity: 0; transform: rotate(-90deg) scale(0.6); }
    #dhrv-chat-fab.open .fab-icon-chat  { opacity: 0; transform: rotate(90deg) scale(0.6); }
    #dhrv-chat-fab.open .fab-icon-close { opacity: 1; transform: rotate(0) scale(1); }

    /* Notification dot */
    #dhrv-chat-fab .fab-dot {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #C4A484;
      border: 2px solid #1a1714;
      animation: dhrv-pulse 2.2s ease-in-out infinite;
    }
    #dhrv-chat-fab.open .fab-dot { display: none; }

    @keyframes dhrv-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.35); opacity: 0.7; }
    }

    /* ── Chat Window ── */
    #dhrv-chat-root {
      position: fixed;
      bottom: 98px;
      right: 28px;
      width: 370px;
      max-height: 580px;
      display: flex;
      flex-direction: column;
      background: var(--chat-bg);
      border-radius: 4px;
      box-shadow: var(--chat-shadow);
      z-index: 9997;
      font-family: var(--chat-font);
      overflow: hidden;
      transform: translateY(24px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.38s cubic-bezier(0.34,1.42,0.64,1), opacity 0.28s ease;
    }
    #dhrv-chat-root.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: all;
    }

    /* ── Header ── */
    #dhrv-chat-header {
      background: var(--chat-header-bg);
      padding: 18px 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .dhrv-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7a5545 0%, #C4A484 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .dhrv-avatar svg { width: 18px; height: 18px; }
    .dhrv-header-text { flex: 1; }
    .dhrv-header-name {
      font-family: var(--chat-serif);
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 0.04em;
      line-height: 1;
      margin-bottom: 3px;
    }
    .dhrv-header-status {
      font-size: 9.5px;
      font-weight: 400;
      letter-spacing: 0.1em;
      color: #C4A484;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .dhrv-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4caf50;
      animation: dhrv-blink 2.5s ease-in-out infinite;
    }
    @keyframes dhrv-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    #dhrv-chat-clear {
      background: none;
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.5);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    #dhrv-chat-clear:hover { border-color: rgba(196,164,132,0.5); color: #C4A484; }
    #dhrv-chat-clear svg { width: 13px; height: 13px; }

    /* ── Messages ── */
    #dhrv-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
      background: #fdfcfb;
    }
    #dhrv-chat-messages::-webkit-scrollbar { width: 4px; }
    #dhrv-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #dhrv-chat-messages::-webkit-scrollbar-thumb { background: #ece9e5; border-radius: 2px; }

    .dhrv-message {
      display: flex;
      flex-direction: column;
      max-width: 86%;
      animation: dhrv-msgIn 0.3s ease forwards;
    }
    @keyframes dhrv-msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .dhrv-message.bot  { align-self: flex-start; }
    .dhrv-message.user { align-self: flex-end; }

    .dhrv-bubble {
      padding: 11px 14px;
      border-radius: 3px;
      font-size: 12.5px;
      line-height: 1.75;
      font-weight: 300;
    }
    .dhrv-message.bot .dhrv-bubble {
      background: #ffffff;
      border: 1px solid var(--chat-border);
      color: #1a1714;
      border-radius: 3px 12px 12px 3px;
    }
    .dhrv-message.user .dhrv-bubble {
      background: var(--chat-accent);
      color: #ffffff;
      border-radius: 12px 3px 3px 12px;
    }
    .dhrv-msg-time {
      font-size: 9px;
      color: var(--chat-muted);
      letter-spacing: 0.05em;
      margin-top: 4px;
      opacity: 0.7;
    }
    .dhrv-message.user .dhrv-msg-time { text-align: right; }

    /* Typing indicator */
    .dhrv-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid var(--chat-border);
      border-radius: 3px 12px 12px 3px;
      align-self: flex-start;
      animation: dhrv-msgIn 0.3s ease forwards;
    }
    .dhrv-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #C4A484;
      animation: dhrv-bounce 1.2s ease-in-out infinite;
    }
    .dhrv-typing span:nth-child(2) { animation-delay: 0.18s; }
    .dhrv-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes dhrv-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%           { transform: translateY(-7px); }
    }

    /* Quick reply chips */
    #dhrv-quick-chips {
      padding: 8px 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      background: #fdfcfb;
      border-top: 1px solid var(--chat-border);
      flex-shrink: 0;
    }
    .dhrv-chip {
      padding: 6px 13px;
      border: 1px solid #ddd8d3;
      font-family: var(--chat-font);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.06em;
      color: #5a5250;
      background: #ffffff;
      cursor: pointer;
      border-radius: 20px;
      transition: all 0.22s ease;
      white-space: nowrap;
    }
    .dhrv-chip:hover {
      border-color: var(--chat-accent);
      color: var(--chat-accent);
      background: var(--chat-accent-light);
    }

    /* ── Input Bar ── */
    #dhrv-chat-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid var(--chat-border);
      background: #ffffff;
      flex-shrink: 0;
    }
    #dhrv-chat-input {
      flex: 1;
      border: 1px solid var(--chat-border);
      border-radius: 24px;
      padding: 9px 16px;
      font-family: var(--chat-font);
      font-size: 12px;
      color: #1a1714;
      outline: none;
      background: #fdfcfb;
      transition: border-color 0.22s;
      resize: none;
      height: 38px;
      line-height: 1.4;
    }
    #dhrv-chat-input:focus { border-color: var(--chat-accent); background: #fff; }
    #dhrv-chat-input::placeholder { color: #c0b8b4; font-size: 11.5px; }
    #dhrv-chat-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--chat-accent);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.22s, transform 0.2s;
    }
    #dhrv-chat-send:hover { background: #5e3f31; transform: scale(1.08); }
    #dhrv-chat-send:disabled { background: #ddd8d3; cursor: not-allowed; transform: none; }
    #dhrv-chat-send svg { width: 16px; height: 16px; }

    /* Powered by tag */
    #dhrv-chat-powered {
      text-align: center;
      padding: 5px 0 8px;
      font-size: 9px;
      color: #c0b8b4;
      letter-spacing: 0.08em;
      background: #fff;
      flex-shrink: 0;
    }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      #dhrv-chat-root {
        width: calc(100vw - 24px);
        right: 12px;
        bottom: 92px;
        max-height: 70vh;
      }
      #dhrv-chat-fab {
        right: 18px;
        bottom: 20px;
      }
    }
  `;
  document.head.appendChild(style);

  /* ─── FAB BUTTON ─── */
  const fab = document.createElement('button');
  fab.id = 'dhrv-chat-fab';
  fab.setAttribute('aria-label', 'Open AI Style Assistant');
  fab.innerHTML = `
    <span class="fab-dot"></span>
    <svg class="fab-icon-chat" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg class="fab-icon-close" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;
  document.body.appendChild(fab);

  /* ─── CHAT WINDOW ─── */
  const root = document.createElement('div');
  root.id = 'dhrv-chat-root';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Dhruvi Enterprise Style Assistant');
  root.innerHTML = `
    <div id="dhrv-chat-header">
      <div class="dhrv-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </div>
      <div class="dhrv-header-text">
        <div class="dhrv-header-name">Style Assistant</div>
        <div class="dhrv-header-status">
          <span class="dhrv-status-dot"></span>
          Dhruvi Enterprise
        </div>
      </div>
      <button id="dhrv-chat-clear" title="Clear chat" aria-label="Clear conversation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.29"/>
        </svg>
      </button>
    </div>

    <div id="dhrv-chat-messages"></div>

    <div id="dhrv-quick-chips">
      <button class="dhrv-chip" data-msg="What collections do you have?">Collections</button>
      <button class="dhrv-chip" data-msg="Tell me about customisation options">Customise</button>
      <button class="dhrv-chip" data-msg="How do I contact Dhruvi Enterprise?">Contact Us</button>
      <button class="dhrv-chip" data-msg="Help me find a style that suits me">Style Tips</button>
    </div>

    <div id="dhrv-chat-input-wrap">
      <input
        type="text"
        id="dhrv-chat-input"
        placeholder="Ask about style, products…"
        autocomplete="off"
        maxlength="400"
        aria-label="Type your message"
      />
      <button id="dhrv-chat-send" aria-label="Send message">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div id="dhrv-chat-powered">✦ Powered by Gemini AI ✦</div>
  `;
  document.body.appendChild(root);

  /* ─── REFERENCES ─── */
  const messagesEl = document.getElementById('dhrv-chat-messages');
  const inputEl = document.getElementById('dhrv-chat-input');
  const sendBtn = document.getElementById('dhrv-chat-send');
  const clearBtn = document.getElementById('dhrv-chat-clear');
  const chips = document.querySelectorAll('.dhrv-chip');

  /* ─── STATE ─── */
  let isOpen = false;
  let isThinking = false;
  let history = []; // [{role, parts:[{text}]}]

  /* ─── HELPERS ─── */
  function formatTime() {
    const d = new Date();
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function appendMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `dhrv-message ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'dhrv-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'dhrv-msg-time';
    time.textContent = formatTime();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'dhrv-typing';
    el.id = 'dhrv-typing-indicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('dhrv-typing-indicator');
    if (el) el.remove();
  }

  function setLoading(loading) {
    isThinking = loading;
    sendBtn.disabled = loading;
    inputEl.disabled = loading;
  }

  /* ─── GREETING ─── */
  function showGreeting() {
    if (messagesEl.children.length === 0) {
      appendMessage('bot', 'Welcome to Dhruvi Enterprise ✦ I\'m your personal Style Assistant. How can I help you discover premium fashion today?');
    }
  }

  /* ─── TOGGLE ─── */
  function toggle() {
    isOpen = !isOpen;
    fab.classList.toggle('open', isOpen);
    root.classList.toggle('open', isOpen);
    if (isOpen) {
      showGreeting();
      setTimeout(() => inputEl.focus(), 350);
    }
  }

  fab.addEventListener('click', toggle);
  fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

  /* ─── CLEAR ─── */
  clearBtn.addEventListener('click', () => {
    history = [];
    messagesEl.innerHTML = '';
    showGreeting();
  });

  /* ─── CHIPS ─── */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      if (msg && !isThinking) sendMessage(msg);
    });
  });

  /* ─── SEND ─── */
  async function sendMessage(text) {
    text = text.trim();
    if (!text || isThinking) return;

    inputEl.value = '';
    appendMessage('user', text);
    setLoading(true);
    showTyping();

    // Push to history
    history.push({ role: 'user', parts: [{ text }] });

    // Build request body
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 300,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    };

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      hideTyping();

      if (reply) {
        history.push({ role: 'model', parts: [{ text: reply }] });
        appendMessage('bot', reply);
      } else {
        appendMessage('bot', 'I\'m sorry, I didn\'t quite catch that. Could you rephrase your question?');
      }
    } catch (err) {
      hideTyping();
      console.error('[DhruiChat]', err);
      appendMessage('bot', 'I\'m having trouble connecting right now. Please try again in a moment, or visit our Contact page for direct assistance ✦');
    } finally {
      setLoading(false);
      inputEl.focus();
    }
  }

  /* ─── INPUT EVENTS ─── */
  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputEl.value); }
  });

  /* ─── CLOSE ON OUTSIDE CLICK ─── */
  document.addEventListener('click', e => {
    if (isOpen && !root.contains(e.target) && !fab.contains(e.target)) {
      toggle();
    }
  }, true);

  /* ─── ESCAPE KEY ─── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggle();
  });

})();
