#  Portfolio

> **A high-performance, frame-scrubbed web experience built with Next.js 16 (Turbopack), HTML5 Canvas, React 18, and Tailwind CSS.**

---

## ⚡ Overview

This repository contains the source code for **Ahmad Ali Shah's Personal Engineering Portfolio**. Designed as a single, unified 1000vh sticky viewport, the application scrub-renders a 100-frame high-resolution video sequence dynamically synchronized with scroll position, overlaying interactive HUD cards representing engineering projects, stack architectures, open-source credibility, and live feedback collection.

---

## 🚀 Key Architectural Innovations

### 1. Fixed Viewport RAF Scrubbing Engine
- **Continuous 60fps Loop**: Replaced scroll-throttled canvas updates with a continuous `requestAnimationFrame` render loop that paints on every frame, eliminating browser rendering delays.
- **LERP Inertia Physics**: Implemented linear interpolation (`smoothProgress += (target - smoothProgress) * 0.08`) for smooth scroll inertia across all input devices.
- **Resilient Fallback Painting**: Nearest-neighbor frame fallback ensures that if an asset is downloading over the network, the canvas paints the closest available cached frame without ever clearing to black.
- **Zero-Blackout Fixed Container**: Built with `position: fixed; inset: 0` inside a `1000vh` scroll track to prevent viewport unmounting across all desktop and mobile browsers.

### 2. Live Streaming SQL Terminal
- **Real-Time Code Emission**: Computes characters revealed based on scroll progression, streaming live SQL schema declarations character-by-character as the user scrolls into Beat 3.
- **SSR-Safe Cursor**: Uses pure CSS `@keyframes` blinking cursors to ensure hydration parity between server HTML and client React state.

### 3. Interactive HUD Beats
1. **Beat 1 (0–15%)**: Title & Hero Intro (`AHMAD ALI SHAH`).
2. **Beat 2 (13–28%)**: Personalized Visitor Welcome & Guidance.
3. **Beat 3 (26–44%)**: Real-Time Streaming SQL Architecture & Engineering Stack.
4. **Beat 4 (42–58%)**: Open-Source Credibility & GitHub Activity.
5. **Beat 5 (56–72%)**: Projects 01 & 02 (`Zero-G Cheeseburger` & `Calibre 04 Watch`).
6. **Beat 6 (70–84%)**: Project 03 (`C++ SFML Metal Slug Engine`).
7. **Beat 7 (82–100%)**: Project 04 (`Solar Energy Optimization`) & Direct Feedback Form.

---

## 🛠️ Stack & Technologies

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript (Strict Type Safety)
- **Styling**: Glassmorphism CSS & Tailwind CSS
- **Animation**: Framer Motion & HTML5 Canvas
- **Icons**: Lucide React
- **Backend API**: Next.js API Routes (`/api/feedback`)

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Ahmad-Ali-Shah/CurrentPortfolio.git
cd CurrentPortfolio/portfolio-site

# Install dependencies
npm install

# Start development server on port 3000
npm run dev -- --port 3000
```

Open [http://localhost:3000](http://localhost:3000) to view the live portfolio.

---

## 📦 Production Build & Validation

```bash
# Validate TypeScript and create optimized production build
npm run build

# Preview production build locally
npm run start
```

---

## 🌐 GitHub Repository & Deployment

- **GitHub Repository**: [Ahmad-Ali-Shah/CurrentPortfolio](https://github.com/Ahmad-Ali-Shah/CurrentPortfolio)
- **Author**: Ahmad Ali Shah (FAST-NUCES)
