# 🚀 Easy Google Speech API Setup (No CLI Required!)

## Step 1: Create Google Cloud Project (Web Console)

1. **Go to Google Cloud Console:** https://console.cloud.google.com
2. **Create new project:**
   - Click "Select a project" → "New Project"
   - Name: "voice-memo-app" (or any name you prefer)
   - Click "Create"

## Step 2: Enable Speech-to-Text API

1. **In your new project, go to:** https://console.cloud.google.com/apis/library
2. **Search for:** "Cloud Speech-to-Text API"
3. **Click on it and press "Enable"**

## Step 3: Create API Key

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click "Create Credentials" → "API Key"**
3. **Copy the API key** (it looks like: `AIzaSyA...`)
4. **Optional:** Click "Restrict Key" to limit it to Speech API only

## Step 4: Configure Your App

1. **Copy environment file:**
```bash
cp .env.example .env.local
```

2. **Edit .env.local and add your API key:**
```bash
GOOGLE_API_KEY=AIzaSyA_your_actual_api_key_here
```

3. **Test the app:**
```bash
npm run dev
```

## Step 5: Test Voice Recognition

1. Open your app at http://localhost:3000/voicememo
2. Click the recording button
3. Speak in Korean - it should now use Google's API instead of mock responses!

## 🎉 That's it!

Your voice memo app now uses Google Cloud Speech-to-Text API for better Korean voice recognition, especially on mobile browsers.

## 💡 Troubleshooting

- **"API key not found" error:** Make sure your .env.local file is in the project root
- **"Permission denied" error:** Make sure the Speech API is enabled in your project
- **Still getting mock responses:** Check the browser console for error messages

## 🔒 Security Note

- Never commit your API key to git
- The .env.local file is already in .gitignore
- For production, consider using service accounts instead