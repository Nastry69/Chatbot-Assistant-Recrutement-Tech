import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Se connecter APRÈS
const index = pc.index('db-vectoriel').namespace('ns1');