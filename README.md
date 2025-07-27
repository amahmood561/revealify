# Revealify

Revealify is a microSaaS MVP built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. It expands short links, previews destination metadata, and provides a session-based dashboard of expanded links.

## Features
- Paste a short link (bit.ly, t.co, etc.) to expand and preview
- Shows title, description, favicon, and destination URL
- Session-based dashboard of expanded links (no login required)
- Modern, responsive UI

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Cheerio (for meta scraping)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

This MVP is session-based and does not persist data after server restart. For production, add persistent storage and security checks.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

<img width="1699" height="970" alt="image" src="https://github.com/user-attachments/assets/9fa1bc6f-dae0-405d-8c45-bd9dba0a2d66" />

