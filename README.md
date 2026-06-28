# KeywordIQ — AI Keyword Research Tool

AI-powered keyword research tool for bloggers. Built with Next.js + Anthropic Claude.

## Local Setup

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY in .env.local
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add Environment Variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (from console.anthropic.com)
4. Click Deploy ✅

## Project Structure

```
src/
  app/
    page.js          # Frontend UI
    layout.js        # Root layout
    api/
      keywords/
        route.js     # Backend API (API key is safe here)
```
