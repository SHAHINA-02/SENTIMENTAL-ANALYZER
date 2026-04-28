# UAE SENTIMENTAL — Bilingual AI Sentiment Intelligence

![Status](https://img.shields.io/badge/Status-Production-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Transformers.js](https://img.shields.io/badge/Transformers.js-HuggingFace-FFD21E?style=flat-square)

A bilingual AI sentiment analysis tool that detects and classifies sentiment in both English and Arabic text — running entirely in the browser with zero backend, zero API keys, and complete privacy.

**LIVE DEMO:** https://sentimental-analyzer-ruddy.vercel.app

> SCREENSHOTS-https://github.com/SHAHINA-02/SENTIMENTAL-ANALYZER/blob/7a46e0e83fcc2ee38fb7d4e170fe05919dd4f185/SENT%20ANALYZER/Screenshot%202026-04-29%20025255.png

---

## ABOUT

In the UAE, business communication, customer feedback, and social media operate across both Arabic and English simultaneously. UAE Sentimental bridges this gap by providing real-time sentiment intelligence for bilingual text — no server required, no data leaves the browser.

Powered by a distilled multilingual model from the Hugging Face ecosystem via Transformers.js, the application delivers server-grade accuracy directly in the client.

---

## HOW IT WORKS

```
User Input (English or Arabic)
        ↓
Auto Language Detection (RTL / LTR)
        ↓
Transformers.js — Multilingual Model (in-browser inference)
        ↓
Sentiment Label + Confidence Score (Positive / Neutral / Negative)
        ↓
Analysis History + CSV Export
```

---

## FEATURES

**Sentiment Analysis**
- Classifies text as Positive, Neutral, or Negative
- Confidence score displayed as percentage (0–100%)
- Breakdown of all three sentiment probabilities per analysis

**Bilingual Support**
- Accepts English and Arabic input in the same interface
- Auto-detects language and applies RTL rendering for Arabic
- Sample prompts provided: English Positive, Arabic Positive, English Negative, Arabic Negative

**Analysis Dashboard**
- Total analyses count
- Top language detected
- Sentiment mix visualised as a progress bar
- Recent history log with language tag, sentiment label, and confidence score

**Data Export**
- Export full analysis history as CSV
- Clear history with one click

**Privacy-First Architecture**
- Entire ML inference runs in the browser via Transformers.js
- No backend server, no API keys, no data transmission
- Zero latency, complete data privacy

---

## TECH STACK

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| Framework     | Next.js 15 (App Router)                 |
| Language      | TypeScript                              |
| Styling       | Tailwind CSS                            |
| AI Engine     | Transformers.js (Hugging Face)          |
| ML Model      | Distilled Multilingual Sentiment Model  |
| Deployment    | Vercel                                  |

---

## INSTALLATIONS

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/YOUR_USERNAME/sentimental-analyzer.git
cd sentimental-analyzer
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

> No API key required — inference runs entirely in the browser.

---

## ROADMAP

- [ ] Dialect-aware Arabic sentiment (Gulf, Egyptian, Levantine)
- [ ] Batch text file upload for bulk analysis
- [ ] Sentiment trend charts over time
- [ ] Browser extension for in-page sentiment detection
- [ ] API mode for developer integration

---

## AUTHOR

**SHAHINA S** — Full Stack Developer & AI Engineer, UAE

- Portfolio: https://yoursite.com
- LinkedIn: https://linkedin.com/in/yourhandle
- Email: you@email.com

---

*MIT License. Open source. No backend. No API keys. Built for the UAE.*
