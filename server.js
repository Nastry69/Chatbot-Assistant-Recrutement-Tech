import 'dotenv/config';
import express from 'express';
import { chercherContexte, construirePrompt, streamConfig } from './rag-pipeline-groq.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) return res.status(400).json({ error: 'Question manquante' });

  try {
    const contexte = await chercherContexte(question);
    const prompt = construirePrompt(question, contexte);

    const upstream = await fetch(streamConfig.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${streamConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: streamConfig.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      }),
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of upstream.body) {
      res.write(chunk);
    }
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Serveur démarré → http://localhost:3000'));