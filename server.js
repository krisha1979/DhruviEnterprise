const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// Serve all the HTML/PNG/CSS files from the project root
app.use(express.static(__dirname));

// The Chatbot Route
app.post('/api/chat', async (req, res) => {
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY. Please add it to your .env.local file.' });
  }

  // Clean the key (remove quotes and spaces)
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim();

  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid history' });
  }

  const SYSTEM_PROMPT = `You are the AI Style Assistant for Dhruvi Enterprise. Help customers discover premium Indian fashion. specialty: customised T-shirts & lifestyle for men. Personality: warm, sophisticated, luxury Indian fashion representative.`;

  // Use the newest Gemini model for high-speed
  const GEMINI_MODEL = 'gemini-2.0-flash';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // Universal History Format
  const contents = [
    { role: 'user', parts: [{ text: `INSTRUCTIONS: ${SYSTEM_PROMPT}\n\nPlease acknowledge and wait for my questions.` }] },
    { role: 'model', parts: [{ text: "Understood. I am your Dhruvi AI Stylist. How can I assist you today?" }] },
    ...history
  ];

  try {
    const response = await axios.post(GEMINI_URL, {
      contents,
      generationConfig: { temperature: 0.75, maxOutputTokens: 300, topP: 0.9 },
    }, {
      timeout: 40000 // Very generous 40-second timeout for slow Mac connections
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    res.json({ reply: reply || "I'm sorry, I couldn't process that. Can you rephrase?" });

  } catch (err) {
    if (err.response) {
      const gError = err.response.data?.error?.message || '';
      console.error('[Google Error]', gError);
      if (err.response.status === 403 || err.response.status === 401) {
        return res.status(403).json({ error: "API Key Expired or Leaked! Please get a new one." });
      }
      return res.status(err.response.status).json({ error: gError || 'Google API Error' });
    }
    console.error('[Network Error]', err.message);
    res.status(504).json({ error: 'Connection Timed Out. Please check your network and try again!' });
  }
});

app.listen(PORT, () => {
  console.log(`\n\n-----------------------------------------`);
  console.log(`🚀 DHURUVI ENTERPRISE STANDALONE SERVER READY!`);
  console.log(`🔗 OPEN: http://localhost:${PORT}`);
  console.log(`-----------------------------------------\n\n`);
});
