# MIBA UI (Web Frontend)

React-based dashboard for the MIBA Waste Management Platform. Provides interfaces for reporting waste incidents and viewing AI insights.

## Local Development (Docker)

### Build the Image
```bash
docker build -t miba-ui:latest .
```

### Run the Container
```bash
docker run -p 5173:5173 \
  -e VITE_API_URL="http://localhost:8080/api" \
  miba-ui:latest
```
Access the app at `http://localhost:5173`.

## Cloud Run Deployment

### 1. Build and Tag
```bash
docker build -t europe-west1-docker.pkg.dev/cloudseals-shared-service/miba/ui:1.0.7 .
```

### 2. Push to Registry
```bash
docker push europe-west1-docker.pkg.dev/cloudseals-shared-service/miba/ui:1.0.7
```

### 3. Deploy to Cloud Run
```bash
gcloud run deploy miba-ui \
  --image europe-west1-docker.pkg.dev/cloudseals-shared-service/miba/ui:1.0.7 \
  --region europe-west1 \
  --platform managed
```

## Environment Variables
- `VITE_API_URL`: Base URL for the MIBA Backend API.
