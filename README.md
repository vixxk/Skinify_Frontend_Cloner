## SKINIFY - Frontend Website Cloner

Clone any website’s frontend assets instantly using smart keyword-to-URL AI resolution. Designed for developers, learners, and rapid prototyping. _Note: May not work for sites with heavy realtime data or network access blocks._

---

## 🚀 Features

- **AI-powered keyword-to-URL**: Type a site name, keyword, or URL—Skinify resolves the correct landing page with Gemini AI.
- **Full frontend asset scraping**: Downloads HTML, CSS, JS, images, and static assets.
- **Unified ZIP download**: Get a single archive with all content for local use.
- **Modern React UI**: Sleek, responsive, and animated experience with dark/orange branding.
- **Model switcher**: Choose between Website Scraper or Puppeteer + Cheerio for best results.
- **Deep Mode (recursive crawling)**: Capture multi-page sites (still experimental).
- **Usage feedback**: Real-time status, warnings, and error messages.
- **Built-in popular site presets**: Instantly try with curated, reliable example sites.
- **Easy launch scripts**: `open.sh` and `open.bat` files for one-click local serving.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Gemini AI, website-scraper, puppeteer, cheerio, archiver
- **Frontend**: React + Vite, Lucide icons, custom CSS

---

## 📋 Prerequisites

- Node.js 16+  
- Google Gemini API key  
- Git

---


## 🎬 DEMO / TUTORIAL - https://www.youtube.com/watch?v=UC4WWgLZCWI



## ⚙️ Installation

```bash
# Clone repository
git clone https://github.com/vixxk/Skinify_Frontend_Cloner.git
cd SKINIFY_FRONTEND_CLONER

# Install backend dependencies
cd backend
npm install && npx puppeteer browsers install chrome

# Install frontend dependencies
cd ../frontend
npm install

# Environment variables
# Create a .env file in backend/:
# GEMINI_API_KEY=your-gemini-api-key
# PORT=3001
```

---

## 🚀 Running Locally

```bash
# Start backend
cd backend
node server.js

# Start frontend (in a new terminal)
cd ../frontend
npm run dev
```

- Backend: [http://localhost:3001](http://localhost:3001)
- Frontend: [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
SKINIFY_FRONTEND_CLONER/
├── backend/
│ ├── downloads/
│ ├── node_modules/
│ ├── controllers/
│ ├── scrapers/
│ ├── routes/
│ ├── utils/
│ ├── content-extractor.js
│ ├── puppeteer.config.cjs
│ ├── scraper-cli.js
│ ├── server.js
│ ├── open.bat
│ ├── open.sh
│ ├── .env
│ └── package.json
├── frontend/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.jsx
│ │ ├── components/
│ │ │ ├── Header/
│ │ │ ├── ModelSwitch/
│ │ │ ├── DeepModeToggle/
│ │ │ ├── HowItWorks/
│ │ │ ├── ModelNote/
│ │ │ ├── SearchInput/
│ │ │ ├── LoadingProgress/
│ │ │ ├── Message/
│ │ │ ├── ResultSection/
│ │ │ ├── ExamplesSection/
│ │ │ ├── BackgroundElements/
│ │ │ ├── FaqSection/
│ │ │ └── TopNotification/
│ ├── package.json
│ ├── vite.config.js
│ └── README.md
└── README.md
```

---

## 🔧 API Endpoints

#### `POST /api/resolve/1`
Request:
```json
{ "keyword": "<site/keyword/url>", "isRecursive": true } // Deep Mode optional
```
Response:
```json
{ "url": "<resolved-url>", "folder": "<asset-folder-name>" }
```

#### `POST /api/resolve/2`
Request:
```json
{ "keyword": "<site/keyword/url>" }
```
Response:
```json
{ "url": "<resolved-url>", "folder": "<asset-folder-name>" }
```

#### `GET /download/:folderName`
Downloads all scraped site assets as a ZIP.

---

## 🎯 Usage

1. Enter a website name or keyword (e.g., `tailwindcss`, `hitesh.ai`, etc.).
2. Click **Scrape Website**.
3. Download your ZIP, extract it, and:
    - Open `index.html` in VS Code and use "Go Live"
    - Or run the provided `open.sh`/`open.bat` script
4. If scraping fails, switch the "Scraping Engine" at the top and try again.

### Example Keywords

- hitesh.ai
- piyushgarg.dev
- code.visualstudio.com
- tailwindcss.com
- nextjs.org
- vercel.com
- getbootstrap.com
- w3schools.com
- react.dev

---

## ❗ Notes

- By default, only the landing page is scraped. Enable Deep Mode for full-site capture (may be unstable).
- Some sites with dynamic frameworks, anti-bot, login, or API restrictions may not scrape properly.
- Free backend tier may result in timeouts during heavy usage or with large sites—please retry if you encounter errors.
- For learning, prototyping, and inspiration. Use responsibly and respect website terms.

---

## 👥 Contributions & Issues

Open to pull requests, suggestions, and issues!  
https://github.com/vixxk/Skinify_Frontend_Cloner

---
