# Augustine Amos A. - Portfolio

A responsive engineering portfolio built with React, TypeScript, and Vite, with a Vercel serverless chat endpoint powered by Groq. The decorative Hyperspeed canvas has no mouse or touch controls: a shared AI request state smoothly adjusts its animation speed while the assistant is generating.

## Requirements

- Node.js 20 or newer
- npm
- A Groq API key to enable the assistant

## Install and run locally

```bash
npm install
copy .env.example .env.local
```

Add your key to `.env.local` as `GROQ_API_KEY=...`. Do not commit `.env.local`. Vite serves the UI, while `vercel dev` serves the Vercel API route locally:

```bash
npx vercel dev
```

Open the local URL printed by Vercel. For frontend-only work, `npm run dev` starts Vite, but `/api/chat` requires the Vercel development server.

## Build

```bash
npm run build
```

## GitHub

Create an empty GitHub repository, then from this project directory:

```bash
git init
git add .
git commit -m "Build Augustine Amos portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote with your own repository address; no repository URL has been assumed here.

## Deploy to Vercel

Import the GitHub repository in Vercel, keep the Vite defaults (build command `npm run build`, output directory `dist`), and deploy. In **Project Settings > Environment Variables**, add `GROQ_API_KEY` with your private Groq key for Production (and Preview/Development if needed), then redeploy. Never put the secret in frontend code or commit an `.env` file.

## Chat architecture

The browser sends `{ "message": "..." }` to `POST /api/chat`. The Vercel function validates it, reads `GROQ_API_KEY` on the server, and requests a response from `openai/gpt-oss-120b`. It returns only a reply or a safe error message. The chat loading state lives in the app and is shared with Hyperspeed; its canvas smoothly interpolates toward a calm or faster target without rebuilding the animation scene or listening to pointer/touch events.

## Project links and contact

GitHub, demo, email, and LinkedIn destinations were not provided, so the page does not fabricate personal URLs. Add your real links in `src/App.tsx` when ready.
