# HealthArogyaa - Clinical Indian Nutrition & Weight Loss System

> **Know your food. Choose your meal. Build your day.**  
> A science-backed Progressive Web App (PWA) designed specifically for Indian regional diets, ICMR 2024 energy reference standards, clinical calorie adherence, and verified dietician oversight.

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-059669.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**HealthArogyaa** bridges the gap between generic Western calorie counters and traditional Indian dietary habits. Built with clinical dietician input, it accounts for diverse regional cuisines (North Indian, South Indian, Gujarati, Bengali, Maharashtrian), home-cooking variances (±10-15%), glycemic index/load, oil absorption during cooking, and ICMR-NIN 2024 Dietary Guidelines.

---

## ✨ Key Features

- **Personalized Client Induction**: Automated 3-step setup calculating Clinical BMI, Resting BMR, TDEE, and daily calorie deficit based on Indian anthropometric benchmarks.
- **5-Slot Daily Meal Architecture**: Structured tracking across Breakfast, Pre-Lunch (metabolic priming & raw fiber), Lunch, Snacks, and Dinner.
- **Indian Food & Recipe Database**: 120+ verified Indian dishes categorized by regional cuisine, dietary preference (Veg, Non-Veg, Vegan, Jain), glycemic index, and cooking styles.
- **AI-Powered Nutrition & Label Scanner**: Camera capture and multimodal scanning for packaged food nutrition labels and plated meals.
- **15-Day Calorie & Adherence Calendar**: Visual daily compliance tracker showing target vs. actual calories, protein targets, and deficit trends.
- **Weight Journey Tracker**: Log weight milestones, view BMI category transitions, and calculate dynamic pace to target weight.
- **Expert Dietician Reviews & Consultations**: Human-in-the-loop review portal with clinical feedback and 30-minute booking queue.
- **UPI Subscription Integration**: Direct Indian UPI QR code and 1-tap mobile payment gateway (Google Pay, PhonePe, Paytm).
- **Standalone PWA & Android APK Ready**: Offline caching, full service worker lifecycle, Web App Manifest with maskable icons, and full compatibility with Google Play Store packaging via PWABuilder.
- **Dietician Admin Workspace**: Separate practitioner workspace (`/?mode=admin` with master passcode lock) for ICMR food catalog edits, client reviews, and subscription approvals.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS, Lucide Icons, Plus Jakarta Sans & Outfit typography
- **PWA**: Service Worker (`sw.js`), Web App Manifest (`manifest.webmanifest`), offline cache
- **Backend / Proxy**: Node.js, Express, tsx
- **Storage**: Client-authoritative local storage with scoped user profiles and migration hygiene

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/health-arogyaa.git

# Enter project directory
cd health-arogyaa

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚢 Deploy to Free Hosting (Vercel / Netlify)

### Deploying to Vercel (Recommended for PWABuilder APK packaging)
1. Push this repository to your GitHub account.
2. Sign in to [Vercel](https://vercel.com/) with GitHub.
3. Click **Add New...** → **Project**.
4. Import your `health-arogyaa` repository.
5. In Build and Output Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

### Deploying to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) with GitHub.
2. Click **Add new site** → **Import an existing project**.
3. Select your `health-arogyaa` GitHub repository.
4. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
5. Click **Deploy HealthArogyaa**.

---

## 📱 Build Android APK for Google Play Store

Once deployed to Vercel or Netlify:
1. Copy your live HTTPS URL (e.g., `https://health-arogyaa.vercel.app`).
2. Go to [PWABuilder.com](https://www.pwabuilder.com/).
3. Paste your live URL and click **Start**.
4. PWABuilder will verify the PWA score (all icons, manifest, service worker are pre-configured).
5. Click **Package for Stores** → Select **Android**.
6. Download your signed or test `.apk` / `.aab` package ready for sideloading or Google Play Console release!

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
