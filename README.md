# 🤖 Chatbot Assistant Recrutement Tech — Pipeline RAG complète

> Projet final — Formation IPSSI | NodeJs : Communication avec IA  
> Groupe : BD3 26.1 — Bac+3 Dev | Formatrice : Agbefou Carine | Mai 2026

---

## 📋 Description

Un chatbot conversationnel basé sur une architecture **RAG (Retrieval-Augmented Generation)** capable de répondre aux questions d'un candidat postulant à un poste de développeur IA.

Le chatbot s'appuie exclusivement sur un corpus de documents fournis. Si la réponse n'est pas dans le corpus, il répond : `"Je ne trouve pas cette information dans les documents fournis."`

---

## 🎯 Fonctionnalités

- ✅ Répondre aux questions basées sur le corpus fourni
- ✅ Citer le fichier source de chaque réponse
- ✅ Détecter et gérer les questions hors contexte
- ✅ Gérer les erreurs API proprement

---

## 🗂️ Structure du projet

```
📦 chatbot-rag/
├── documents/
│   ├── fiche_poste.txt
│   ├── guide_entretien.txt
│   ├── faq_rh.txt
│   └── competences_tech.txt
├── create-index.js        # Création de l'index Pinecone
├── embed-documents.js     # Chargement, chunking, vectorisation et stockage
├── rag-pipeline.js        # Pipeline RAG complète (retrieve + generate)
├── .env.example           # Modèle de configuration (sans vraies clés)
└── README.md
```

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org/) v18+
- Un compte [Mistral AI](https://mistral.ai/) avec une clé API
- Un compte [Pinecone](https://www.pinecone.io/) avec un index créé

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd chatbot-rag
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier exemple et renseigner vos clés :

```bash
cp .env.example .env
```

Contenu de `.env` :

```env
MISTRAL_API_KEY=votre_cle_ici
PINECONE_API_KEY=votre_cle_ici
PINECONE_INDEX_NAME=votre_index_ici
```

> ⚠️ **Ne jamais commiter le fichier `.env` — seulement `.env.example`**

---

## ▶️ Lancement

### Étape 1 — Créer l'index Pinecone

```bash
node create-index.js
```

### Étape 2 — Vectoriser et indexer les documents

```bash
node embed-documents.js
```

### Étape 3 — Lancer le chatbot

```bash
node rag-pipeline.js
```

---

## 📚 Corpus de documents

| Fichier | Contenu |
|--------|---------|
| `fiche_poste.txt` | Missions, compétences requises et profil recherché |
| `guide_entretien.txt` | Questions techniques typiques et critères d'évaluation |
| `faq_rh.txt` | Salaire, télétravail, alternance, processus de recrutement |
| `competences_tech.txt` | Référentiel de compétences par niveau (débutant / intermédiaire / avancé) |

---

## 🏗️ Architecture RAG

```
Question utilisateur
        │
        ▼
  Embedding (Mistral)
        │
        ▼
  Recherche vectorielle (Pinecone)
        │
        ▼
  Contexte extrait du corpus
        │
        ▼
  Génération de réponse (Mistral LLM)
        │
        ▼
  Réponse + source citée
```

---

## 🛠️ Technologies utilisées

| Catégorie | Outil |
|-----------|-------|
| Runtime | Node.js |
| LLM | Mistral AI |
| Base vectorielle | Pinecone |
| Embeddings | Mistral Embeddings API |
| Configuration | dotenv |

---

## 👥 Équipe — Groupe 2

| Membre |
|--------|
| DZIOCH Tristan |
| AZAG Dillon |
| BLANCHI Melvyn |

---

## 📝 Livrables rendus

- [x] `create-index.js`
- [x] `embed-documents.js`
- [x] `rag-pipeline.js`
- [x] `.env.example`
- [x] `README.md`
- [x] Capture d'écran : vecteurs indexés dans Pinecone
- [x] Capture d'écran : réponse correcte sur le corpus
- [x] Capture d'écran : réponse "je ne sais pas" hors corpus

---

> 📅 Dépôt des projets : **6 Mai 2026 à 17h**  
> 🎤 Démonstration : 15 min de présentation + 5 min de questions — chaque membre présente une partie