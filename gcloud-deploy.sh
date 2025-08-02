#!/bin/bash
# Build and deploy the Manus-style platform container to a Google Cloud VM.
# Usage: ./gcloud-deploy.sh <PROJECT_ID> <VM_NAME> <ZONE>

set -euo pipefail

PROJECT_ID=${1:?"project id required"}
VM_NAME=${2:?"vm name required"}
ZONE=${3:?"zone required"}

IMAGE="gcr.io/${PROJECT_ID}/manus-platform:latest"

# Build and push image to Google Container Registry
if ! command -v gcloud >/dev/null 2>&1; then
    echo "gcloud not installed" >&2
    exit 1
fi

gcloud builds submit --tag "$IMAGE" .

gcloud compute ssh "$VM_NAME" --project "$PROJECT_ID" --zone "$ZONE" --command "\
    docker pull $IMAGE && \
    docker stop manus || true && \
    docker rm manus || true && \
    docker run -d --name manus -p 5000:5000 $IMAGE
"
