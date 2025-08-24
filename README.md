# Skinify - Frontend Website Cloner

Clone any website’s frontend assets instantly using AI-powered URL resolution.
May not work for sites with realtime data changes or Network Access Blocked sites.
---

## 🚀 Features

- **AI-powered keyword-to-URL resolution**: Enter a site name, keyword, or URL—AI finds the correct homepage.  
- **Frontend asset scraping**: Downloads HTML, CSS, JS, and images.  
- **ZIP download**: All assets packaged for easy extraction.  
- **Modern React UI**: Clean, mobile responsive, and animated.  
- **Usage feedback**: Real-time messages for success or errors.  
- **Example keywords provided**: Quick list of popular websites to try.  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Gemini AI, website-scraper, archiver  
- **Frontend**: React + Vite, Lucide icons, custom CSS-in-JS  

---

## 📋 Prerequisites

- Node.js 16+  
- Google Gemini API key  
- Git  

---

## ⚙️ Installation

1. **Clone the repo:**
```bash
git clone https://github.com/vixxk/Skinify_Frontend_Cloner.git
cd SKINIFY_FRONTEND_CLONER
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables:**

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your-gemini-api-key
PORT=3001
```

---

## 🚀 Running Locally

**Start backend:**
```bash
cd backend
node server.js 
```

**Start frontend:**
```bash
cd frontend
npm run dev
```

- Backend Default: `http://localhost:3001`  
- Frontend Default: `http://localhost:5173`

---

## 📁 Project Structure

```
SKINIFY_FRONTEND_CLONER/
├── backend/
│   ├── downloads/
│   ├── node_modules/
│   ├── content-extractor.js 
│   ├── scraper-cli.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   └── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
```

---

## 🔧 API Endpoints

**POST** `/api/resolve`  
Request:
```json
{ "keyword": "<site/keyword/url>" }
```
Response:
```json
{ "url": "<resolved-url>", "folder": "<asset-folder-name>" }
```

**GET** `/download/:folderName`  
Downloads ZIP: All scraped assets for that site.

---

## 🎯 Usage

1. Enter a website name or keyword (e.g., `tailwindcss`, `hitesh.ai`).  
2. Click **Scrape Website**.  
3. Download your ZIP, extract locally, and open `index.html`.

**Example Keywords**

- hitesh.ai  
- piyushgarg.dev  
- tailwindcss.com  
- nextjs.org  
- code.visualstudio.com  
- getbootstrap.com  
- w3schools.com  

---

## ⚠️ Notes and Limitations

- Best for static or light JS sites.  
- May fail on highly dynamic sites (Netflix, Facebook, GitHub).  
- Only scrapes landing page unless Deep Mode is ON.
