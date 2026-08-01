# Notelio

Notelio is a minimalist notebook application designed to give you a clean, distraction-free space for writing and organizing your thoughts.

Live Demo: https://notelio.arijitbanerjee873.workers.dev

---

## Features

- **Minimalist Interface**: Styled with soft light and dark themes to reduce eye strain during long writing sessions.
- **Floating Selection Toolbar**: Select any text to bring up an automatic formatting toolbar for quick adjustments (headings, bold, italic, lists, highlight, and code blocks).
- **Search Capabilities**:
  - Global Search: Filter notebooks directly from the home card grid.
  - In-Note Search (Ctrl + F): Search text inside an active notebook with real-time match highlighting.
- **Flexible Data Storage**: Automatically saves notes to a PostgreSQL backend when running locally, with an automatic browser LocalStorage fallback for static web hosting.
- **Responsive Layout**: Designed to work smoothly across screen sizes with subtle micro-animations.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Date-fns
- **Backend**: Express, PostgreSQL, PGlite (Embedded WASM PostgreSQL)
- **Hosting**: Cloudflare Pages / Workers

---

## Getting Started

### Prerequisites

Ensure you have Node.js (v18 or higher) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/banerjee-arijit/Notelio.git
   cd Notelio/vite-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the backend server (PostgreSQL):
```bash
npm run server
```

In a separate terminal, start the Vite development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Building for Production

To create a production build:
```bash
npm run build
```

The compiled static assets will be located in the `dist` directory.

---

## License

This project is open source and available under the MIT License.
