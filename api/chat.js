export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable. Please add it to your Vercel project settings.' });
  }

  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid history payload' });
  }

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

  const GEMINI_MODEL = 'gemini-2.5-flash-lite';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

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
    const apiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data?.error?.message || 'Error from Google API' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (reply) {
      return res.status(200).json({ reply });
    } else {
      return res.status(200).json({ reply: "I'm sorry, I didn't quite catch that. Could you rephrase your question?" });
    }
  } catch (err) {
    console.error('[API Chat Error]', err);
    return res.status(500).json({ error: 'Trouble connecting to Google API' });
  }
}
