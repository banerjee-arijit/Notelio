# Notelio ✨

> A minimalist, distraction-free notebook application built for focus and clarity.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Cloudflare_Pages-orange?style=flat-square&logo=cloudflare)](https://notelio.arijitbanerjee873.workers.dev)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple?style=flat-square&logo=vite)](https://vite.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PGlite-darkblue?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

- **🎨 Minimalist Aesthetics**: Designed with soft paper light mode and midnight graphite dark mode to minimize eye strain and enhance focus.
- **⚡ Notion-Style Selection Toolbar**: Highlight any text to reveal an automatic floating toolbar with direct visual formatting (Heading 1, 2, 3, Bold, Italic, Underline, Strikethrough, Highlight, Lists, and Checklists).
- **🔍 Instant Search**:
  - **Global Search**: Filter all notebooks directly from the home card grid.
  - **In-Note Search (`Ctrl + F`)**: Real-time text search inside active notes with live match highlighting.
- **🐘 PostgreSQL & Hybrid Persistence**: Auto-saves in real-time to a PostgreSQL backend locally, with automatic browser `LocalStorage` fallback when deployed on static hosting.
- **🧩 Modular Architecture**: Clean, single-responsibility, highly reusable React components.
- **📱 Responsive & Animated**: Smooth micro-animations for card creation, note opening, and deletions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Date-fns
- **Backend**: Express, PostgreSQL, PGlite (Embedded WASM PostgreSQL)
- **Deployment**: Cloudflare Pages / Cloudflare Workers

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/banerjee-arijit/Notelio.git
cd Notelio/vite-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application locally
Run the backend server (PostgreSQL):
```bash
npm run server
```

In a second terminal, start the Vite development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Building for Production

To build the project for production deployment:
```bash
npm run build
```

The output bundle will be compiled to the `dist/` directory.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
