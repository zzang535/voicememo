# Google Cloud Speech-to-Text API Setup Guide

## Quick Setup (CLI Method)

1. **Authenticate with Google Cloud:**
```bash
source $HOME/google-cloud-sdk/path.bash.inc
gcloud auth login
```

2. **Set your project (create if needed):**
```bash
# List existing projects
gcloud projects list

# Create new project (if needed)
gcloud projects create your-voice-memo-project

# Set active project
gcloud config set project your-voice-memo-project
```

3. **Enable Speech-to-Text API:**
```bash
gcloud services enable speech.googleapis.com
```

4. **Create service account and download credentials:**
```bash
# Create service account
gcloud iam service-accounts create voice-memo-stt \
  --display-name="Voice Memo STT Service Account"

# Grant Speech Client role
gcloud projects add-iam-policy-binding your-voice-memo-project \
  --member="serviceAccount:voice-memo-stt@your-voice-memo-project.iam.gserviceaccount.com" \
  --role="roles/speech.client"

# Create and download key file
gcloud iam service-accounts keys create ./google-credentials.json \
  --iam-account=voice-memo-stt@your-voice-memo-project.iam.gserviceaccount.com
```

5. **Set environment variable:**
```bash
# Add to your .env.local file
echo "GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json" >> .env.local
echo "GOOGLE_CLOUD_PROJECT_ID=your-voice-memo-project" >> .env.local
```

## Alternative: Application Default Credentials

If you prefer not to use a service account key file:

```bash
gcloud auth application-default login
```

This will use your user credentials for local development.

## Verify Setup

Test your authentication:
```bash
gcloud auth list
gcloud config get-value project
```

## Security Notes

- Never commit `google-credentials.json` to git
- The `.gitignore` should include this file
- For production, use environment variables or cloud-native authentication