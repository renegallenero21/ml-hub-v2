# Machine Learning Hub v2
**Black & Red Tech Design | Supabase Auth | Vercel Deployment**

---

## 📁 Project Structure

```
ml-hub-v2/
├── index.html              ← Main app (Welcome + Login + Dashboard)
├── css/
│   └── style.css           ← Full black & red stylesheet
├── js/
│   ├── data.js             ← 10 ML research papers (full detail)
│   ├── supabase-config.js  ← Supabase client + auth helpers
│   └── app.js              ← All app logic (routing, grid, modal, likes, comments)
└── README.md               ← This file
```

---

## ⚙️ Supabase Configuration

```
Project URL:       https://fhzltitadyigkcgbjqnj.supabase.co
Publishable Key:   sb_publishable_9QH4g9n68cDBqcgp-fp41A_jWYuPFj-
Dashboard:         https://supabase.com/dashboard/project/fhzltitadyigkcgbjqnj
```

Already integrated in `js/supabase-config.js`. No extra setup needed.

---

## 🖥️ STEP-BY-STEP: VS Code Terminal Deployment

### PREREQUISITES — Install these first:
1. **Node.js** → https://nodejs.org (LTS version)
2. **Git** → https://git-scm.com/downloads
3. **VS Code** → https://code.visualstudio.com

---

### STEP 1 — Open Project in VS Code

1. Open VS Code
2. Go to **File → Open Folder**
3. Select your unzipped `ml-hub-v2` folder
4. Open the terminal: **Terminal → New Terminal** (or press Ctrl + `)

---

### STEP 2 — Install Git (verify)

In the VS Code terminal, type:

```bash
git --version
```

Expected output: `git version 2.x.x`
If not installed, download from https://git-scm.com/downloads and restart VS Code.

---

### STEP 3 — Configure Git Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"
```

---

### STEP 4 — Initialize Git Repository

```bash
git init
```

Expected output: `Initialized empty Git repository in .../ml-hub-v2/.git/`

---

### STEP 5 — Stage All Files

```bash
git add .
```

Verify what will be committed:
```bash
git status
```

You should see all files listed in green under "Changes to be committed".

---

### STEP 6 — Create First Commit

```bash
git commit -m "initial commit: ML Hub v2 with Supabase auth"
```

Expected output: something like `[main (root-commit) abc1234] initial commit...`

---

### STEP 7 — Create GitHub Repository

1. Go to https://github.com
2. Click **"+"** → **"New repository"**
3. Name: `ml-hub-v2`
4. Set to **Public**
5. Do NOT check "Initialize with README"
6. Click **"Create repository"**
7. Copy the repository URL shown — it looks like:
   `https://github.com/renegallenero21/ml-hub-v2.git`

---

### STEP 8 — Connect Local Repo to GitHub

Back in VS Code terminal (replace with your actual GitHub username):

```bash
git remote add origin https://github.com/renegallenero21/ml-hub-v2.git
```

---

### STEP 9 — Set Branch and Push

```bash
git branch -M main
git push -u origin main
```

GitHub will ask for your credentials:
- **Username**: your GitHub username
- **Password**: use a **Personal Access Token** (not your password)

To create a token:
1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Check: `repo` scope
4. Copy the token — use it as your password

---

### STEP 10 — Verify on GitHub

Open your browser and go to:
```
https://github.com/renegallenero21/ml-hub-v2
```

You should see all your files uploaded.

---

### STEP 11 — Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New…"** → **"Project"**
5. Find **`ml-hub-v2`** in the list and click **"Import"**
6. On the Configure screen:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty)*
7. Click **"Deploy"**

---

### STEP 12 — Get Your Live URL

After ~30 seconds, Vercel gives you a live URL:
```
https://ml-hub-v2-renegallenero21.vercel.app
```

Click **"Visit"** to confirm it works!

---

### STEP 13 — Enable Supabase Auth for Your Domain

1. Go to https://supabase.com/dashboard/project/fhzltitadyigkcgbjqnj
2. Click **"Authentication"** → **"URL Configuration"**
3. Set **Site URL** to your Vercel URL:
   ```
   https://ml-hub-v2-renegallenero21.vercel.app
   ```
4. Under **Redirect URLs**, add:
   ```
   https://ml-hub-v2-renegallenero21.vercel.app/**
   ```
5. Click **Save**

---

### STEP 14 — Disable Email Confirmation (for easy testing)

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Turn **OFF** "Confirm email"
3. Click **Save**

Now users can sign up and immediately log in without email verification.

---

### FUTURE UPDATES (push changes)

Whenever you edit files and want to redeploy:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel automatically redeploys on every push to `main`. ✅

---

## ✅ Final Submission Checklist

```
[ ] Vercel URL works and shows welcome page
[ ] Login / Sign Up works with Supabase
[ ] Dashboard shows all 10 research papers
[ ] Like button works
[ ] Comments work
[ ] Copy Link works
[ ] Search and filter work
[ ] GitHub repo link ready
[ ] Screenshots taken
[ ] Short explanation written
```

---

## 🗺️ Architecture Diagram

```
[ Student Browser ]
        ↓
[ Vercel CDN ]  ←  hosts index.html, css/, js/
        ↓
[ Supabase Auth API ]  ←  fhzltitadyigkcgbjqnj.supabase.co
        ↓
[ Supabase PostgreSQL Database ]  ←  stores user accounts
```

---

## 📝 Short Explanation (for lab submission)

| Question | Answer |
|---|---|
| Role of Frontend | Provides the UI — welcome page, login form, research dashboard with 10 papers |
| Role of Supabase | Handles secure user registration and login via email/password authentication |
| Role of Vercel | Hosts and publishes the static app with a global public URL |
| How they connect | Browser loads app from Vercel → user submits credentials → app calls Supabase Auth API → Supabase validates and returns session → user enters dashboard |
| Sign Up flow | Frontend sends email+password to Supabase → Supabase creates user in PostgreSQL → session token returned → dashboard loads |
| Login flow | Frontend sends credentials to Supabase → Supabase verifies against database → if valid, session token issued → dashboard loads |
