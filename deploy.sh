#!/bin/bash

# CodeE AI - Cloud Run Deployment Script
# This script deploys both backend and frontend to Google Cloud Run

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CodeE AI - Cloud Run Deployment     ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Configuration
PROJECT_ID="${GOOGLE_PROJECT_ID:-aicatalyst-482921}"
REGION="${GOOGLE_REGION:-us-central1}"
BACKEND_SERVICE="codee-backend"
FRONTEND_SERVICE="codee-frontend"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"

echo -e "${GREEN}✓ Project ID: $PROJECT_ID${NC}"
echo -e "${GREEN}✓ Region: $REGION${NC}"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${BLUE}📦 Enabling required APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com

echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Deploy Backend
echo -e "${BLUE}🚀 Deploying Backend to Cloud Run...${NC}"
cd voicecode-backend

gcloud run deploy $BACKEND_SERVICE \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}" \
    --set-env-vars "ELEVENLABS_AGENT_ID=${ELEVENLABS_AGENT_ID}" \
    --set-env-vars "GOOGLE_PROJECT_ID=${GOOGLE_PROJECT_ID}" \
    --set-env-vars "GOOGLE_LOCATION=${REGION}" \
    --memory 1Gi \
    --cpu 1 \
    --timeout 300 \
    --max-instances 10

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Backend deployed at: $BACKEND_URL${NC}"
echo ""

cd ..

# Update frontend .env with backend URL
echo -e "${BLUE}🔧 Updating frontend configuration...${NC}"
cd voicecode-mentor

# Create production .env file
cat > .env.production << EOF
VITE_BACKEND_URL=$BACKEND_URL
VITE_WS_URL=${BACKEND_URL/https/wss}
EOF

echo -e "${GREEN}✓ Frontend configured${NC}"
echo ""

# Deploy Frontend
echo -e "${BLUE}🚀 Deploying Frontend to Cloud Run...${NC}"

gcloud run deploy $FRONTEND_SERVICE \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✓ Frontend deployed at: $FRONTEND_URL${NC}"
echo ""

cd ..

# Summary
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Successful!         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Backend URL:${NC}  $BACKEND_URL"
echo -e "${BLUE}📍 Frontend URL:${NC} $FRONTEND_URL"
echo ""
echo -e "${BLUE}🎉 CodeE AI is now live!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Visit $FRONTEND_URL to use the app"
echo "2. Update your GitHub README with the live URL"
echo "3. Configure CORS if needed for production"
echo ""

