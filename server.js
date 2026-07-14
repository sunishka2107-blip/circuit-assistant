// Minimal proxy server for Nova — keeps your real Gemini API key on the
// server, never exposed to the browser. The widget calls this instead of
// Google's Generative Language API directly.
//
// Setup:
//   npm install express cors dotenv
//   echo "GEMINI_API_KEY=your-real-key" > .env
//   node server.js
//
// The widget POSTs a Gemini-shaped request body ({ contents, systemInstruction,
// generationConfig }) to /api/chat, and this server just appends your API key
// and forwards it to Gemini's generateContent endpoint.
//
// Model name: uses gemini-2.0-flash below. Model availability changes over
// time — check https://ai.google.dev/gemini-api/docs/models for the current
// list if this one stops working, and update GEMINI_MODEL accordingly.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // put circuit-widget.html, circuit-embed.js etc. in ./public

const GEMINI_MODEL = 'gemini-2.0-flash';

app.post('/api/chat', async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nova proxy (Gemini) running on http://localhost:${PORT}`));