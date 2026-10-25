# Japan Saathi - Deployment Guide

This guide walks you through deploying **Japan Saathi**:
1. **Backend**: Go Planner Service deployed to **Render** via Docker.
2. **Frontend**: Next.js Web Companion deployed to **Vercel**.
3. **Mobile App**: Standalone Android `.apk` built with **Expo EAS** for your Samsung phone.

---

## 1. Deploy Backend to Render (Go Docker Service)

1. Sign up or log into [Render.com](https://render.com).
2. In the Render Dashboard, click **New +** ➔ **Blueprint**.
3. Connect your GitHub repository: `ansh0014/japan_hackathon`.
4. Render will automatically detect [`render.yaml`](../render.yaml) on the `deployment` branch.
5. In the Service Settings, set the environment variable:
   - `GEMINI_API_KEY`: *(paste your working Gemini API key)*
6. Click **Apply Blueprint**.
7. Once deployed, Render will provide a public URL like:
   ```text
   https://japan-saathi-backend.onrender.com
   ```
   *(Verify it by opening `https://japan-saathi-backend.onrender.com/health` in your browser: it will return `{"status":"ok"}`).*

---

## 2. Deploy Frontend to Vercel (Next.js)

1. Sign up or log into [Vercel.com](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `ansh0014/japan_hackathon`.
4. **Important Configuration**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click *Edit* and select **`japan-saathi`**.
   - **Branch**: Choose `deployment`.
5. **Environment Variables**:
   Add the following 3 variables in the Vercel dashboard:
   - `GEMINI_API_KEY`: *(your Gemini key)*
   - `BACKEND_URL`: `https://japan-saathi-backend.onrender.com` *(from Step 1)*
   - `NEXT_PUBLIC_BACKEND_URL`: `https://japan-saathi-backend.onrender.com`
6. Click **Deploy**.
7. In ~60 seconds, your site is live with a global HTTPS link (e.g. `https://japan-saathi.vercel.app`)!

---

## 3. Generate Android APK for Samsung Phone (Expo EAS)

To build a standalone `.apk` that you can download directly to your phone:

1. Open your terminal in the mobile folder:
   ```bash
   cd D:\japan\japan_hackathon\japan-saathi-mobile
   ```

2. Install the EAS CLI (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

3. Log in to your free Expo account:
   ```bash
   eas login
   ```

4. Build the standalone Android APK:
   ```bash
   eas build -p android --profile preview
   ```

5. When the cloud build finishes, EAS will print a download link and QR code.
6. Open the link on your Samsung phone to download and tap install `Japan Saathi.apk`!
