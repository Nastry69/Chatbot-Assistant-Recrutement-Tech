import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';
import path from 'path';

const dossier = 'documents';
const fichiers = fs.readdirSync(dossier).filter(f => f.endsWith('.txt'));

const records = [];
let chunkId = 0;

for (const fichier of fichiers) {
  const texte = fs.readFileSync(path.join(dossier, fichier), 'utf-8');
  
  for (let i = 0; i < texte.length; i += 500) {
    records.push({
      id: `chunk-${chunkId}`,
      chunk_text: texte.slice(i, i + 500),
      source: fichier,
    });
    chunkId++;
  }
}

// Utilise le bon nom d'index
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('db-vectoriel').namespace('ns1');

const batchSize = 100;
for (let i = 0; i < records.length; i += batchSize) {
  const batch = records.slice(i, i + batchSize);
  await index.upsertRecords({ records: batch });
  console.log(`Batch ${Math.floor(i/batchSize) + 1} indexé`);
}