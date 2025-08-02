#!/usr/bin/env bash
# Deploy Manus-style platform using open-source LLMs
set -euo pipefail

# Required environment variables
: "${GCP_PROJECT_ID:?Need to set GCP_PROJECT_ID}"
: "${GCP_VM_NAME:?Need to set GCP_VM_NAME}"
: "${GCP_VM_ZONE:?Need to set GCP_VM_ZONE}"

IMAGE="gcr.io/${GCP_PROJECT_ID}/manus-platform:$(git rev-parse --short HEAD)"

echo "Building Docker image ${IMAGE}..."
docker build -t "${IMAGE}" .

echo "Authenticating docker with gcloud..."
gcloud auth configure-docker --quiet

echo "Pushing image to GCR..."
docker push "${IMAGE}"

echo "Deploying image to VM ${GCP_VM_NAME}..."
gcloud compute ssh "${GCP_VM_NAME}" \
  --zone "${GCP_VM_ZONE}" \
  --project "${GCP_PROJECT_ID}" \
  --command "
    docker pull ${IMAGE} &&
    docker stop manus || true &&
    docker rm manus || true &&
    docker run -d --name manus -p 5000:5000 -p 5173:5173 \
      -e MODEL_PATH=/models/gpt4all/orca-mini-3b-gguf2-q4_0.gguf \
      ${IMAGE}
  "

echo "Deployment complete. Access at http://$(gcloud compute instances describe ${GCP_VM_NAME} \
   --zone ${GCP_VM_ZONE} --project ${GCP_PROJECT_ID} \
   --format='get(networkInterfaces[0].accessConfigs[0].natIP)'):5173"
