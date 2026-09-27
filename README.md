# 🎧 HarmoniSync — Social Group Chat, HD Calls & Synced Music Engine

HarmoniSync is a futuristic, glassmorphic social media web application combining multi-room group text chat, HD audio/video calling, and a dual-tier synchronized music listening engine. Groups (e.g. 5 friends) can listen to music together in real-time, or split off into private breakout pods (e.g. 2 friends listening alone) while staying connected in the main group chat.

---

## 📁 Code Location

The source code for this project is located at:
```text
/config/Desktop/Session1
```

### Directory Structure
```text
/config/Desktop/Session1
├── index.html                   # HTML entrypoint with Google Fonts & Meta tags
├── package.json                 # Project dependencies & npm scripts
├── vite.config.js               # Vite configuration file
├── src/
│   ├── main.jsx                 # React root entry point
│   ├── App.jsx                  # Main layout container
│   ├── index.css                # Ultra-luxurious glassmorphism Design System
│   ├── context/
│   │   └── AppContext.jsx       # State engine for channels, chat, video call & music sync
│   ├── components/
│   │   ├── Navbar.jsx           # Top header with call trigger & active sync ticker
│   │   ├── Sidebar.jsx          # Channel navigation, active pod list & online members
│   │   ├── GroupChat/
│   │   │   ├── ChatArea.jsx     # Message feed, system sync notifications & reactions
│   │   │   └── MessageInput.jsx # Text input, emoji picker, track sharing & voice notes
│   │   ├── MediaCalls/
│   │   │   └── VideoGrid.jsx    # HD video grid, webcam feed, active speaker glow & screen share
│   │   └── MusicEngine/
│   │       ├── MusicPlayerBar.jsx       # Sticky bottom music player bar
│   │       ├── AudioVisualizerModal.jsx # 60FPS Web Audio API canvas spectrum analyzer
│   │       └── PodManagerModal.jsx      # Breakout pod switcher & pod creation modal
│   └── utils/
│       ├── audioSynth.js        # Web Audio API synthesizer & frequency analyzer
│       └── mockData.js          # Initial tracks, channels, bots, and messages
```

---

## 🚀 Quick Start Guide (How to Run locally)

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your PC.

### Step 1: Open Terminal in Project Folder
```bash
cd /config/Desktop/Session1
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev -- --host
```
The application will be accessible at: `http://localhost:5173` (or `http://<your-pc-ip>:5173`).

---

## ⚡ How to Run 24/7 on Your PC

If you want to keep HarmoniSync running on your PC 24 hours a day, 7 days a week, follow one of the methods below:

### Option 1: PM2 Process Manager (Recommended for 24/7)

PM2 keeps your app running in the background and automatically restarts it if your PC reboots or if the process crashes.

1. **Install PM2 globally**:
   ```bash
   npm install -g pm2
   ```

2. **Build the production bundle**:
   ```bash
   npm run build
   ```

3. **Install a lightweight static server (e.g. `serve`)**:
   ```bash
   npm install -g serve
   ```

4. **Start HarmoniSync 24/7 with PM2**:
   ```bash
   pm2 start "serve -s dist -l 5173" --name "harmonisync"
   ```

5. **Save PM2 process list to start automatically on system boot**:
   ```bash
   pm2 save
   pm2 startup
   ```

To check app status anytime:
```bash
pm2 status
pm2 logs harmonisync
```

---

### Option 2: Docker Container (For Docker Users)

If you prefer running with Docker:

1. **Create a `Dockerfile`** in the project directory:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run container 24/7**:
   ```bash
   docker build -t harmonisync .
   docker run -d -p 5173:80 --restart=always --name harmonisync-app harmonisync
   ```

---

### Option 3: Free Cloud Hosting (24/7 online without leaving PC on)

If you don't want to leave your physical PC turned on all the time, you can host HarmoniSync for free 24/7 on platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**:

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial HarmoniSync commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Connect your repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) — it will automatically build and give you a free HTTPS link available 24/7.

---

## 🛠️ Tech Stack & Key Features

- **Frontend**: React 19 + Vite 8
- **Icons**: Lucide React
- **Confetti Effects**: Canvas-Confetti
- **Audio Engine**: Web Audio API Frequency Analyzer & Synthesizer
- **Media Calls**: WebRTC `getUserMedia` for local video/audio feeds + animated visualizer avatar fallbacks
- **Aesthetics**: Glassmorphism CSS with Google Fonts (`Outfit` & `Inter`)

---

## 📄 License
MIT License. Built for seamless social connection and synchronized music experiences.
