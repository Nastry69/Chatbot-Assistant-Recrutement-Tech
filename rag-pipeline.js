import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import readline from 'readline';
import { fileURLToPath } from 'url';

// 1. Connexion Pinecone
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('db-vectoriel').namespace('ns1');

// 2. Chercher les chunks pertinents dans Pinecone
// Pinecone vectorise la question automatiquement via llama-text-embed-v2
async function chercherContexte(question) {
  const resultats = await index.searchRecords({
    query: {
      inputs: { text: question },
      topK: 3,
    },
    fields: ['chunk_text', 'source'],
  });

  return resultats.result.hits
    .map(hit => hit.fields.chunk_text)
    .join('\n\n');
}

// 3. Appeler Groq avec le contexte
async function appellerLLM(question, contexte) {
  const prompt = `Tu es un assistant RH spécialisé pour le recrutement de développeurs IA.
Tu aides les candidats à comprendre le poste, le processus de recrutement et les compétences requises.
Tu réponds uniquement à partir du contexte fourni ci-dessous.
Si la réponse n'est pas dans le contexte, réponds exactement : 
"Je n'ai pas cette information, je vous invite à contacter directement l'équipe RH."
Sois clair, concis et professionnel. Réponds toujours en français.

Contexte :
${contexte}

Question : ${question}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export function construirePrompt(question, contexte) {
  return `Tu es un assistant RH spécialisé pour le recrutement de développeurs IA.
Tu aides les candidats à comprendre le poste, le processus de recrutement et les compétences requises.
Tu réponds uniquement à partir du contexte fourni ci-dessous.
Si la réponse n'est pas dans le contexte, réponds exactement : 
"Je n'ai pas cette information, je vous invite à contacter directement l'équipe RH."
Sois clair, concis et professionnel. Réponds toujours en français.

Contexte :
${contexte}

Question : ${question}`;
}

export const streamConfig = {
  url: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  get apiKey() { return process.env.GROQ_API_KEY; },
};

export { chercherContexte, appellerLLM };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Chatbot RAG démarré. Tapez "exit" pour quitter.\n');

function poserQuestion() {
  rl.question('Vous : ', async (question) => {
    if (question.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const contexte = await chercherContexte(question);
      const reponse = await appellerLLM(question, contexte);
      console.log(`\nAssistant : ${reponse}\n`);
    } catch (err) {
      console.error('Erreur :', err.message);
    }

    poserQuestion();
  });
}

poserQuestion();
}