# Automating Manus-Style AI Deployment

This guide explains the GitHub Actions workflow used to build and deploy the Manus-style platform to a Google Cloud VM. Follow these instructions to enable fully automated deployments.

## 1. Required Secrets
Add the following secrets to your GitHub repository settings:

- `GCP_PROJECT_ID` – Google Cloud project ID (e.g. `blissful-epoch-467811-i3`)
- `GCP_SA_KEY` – JSON service account key with permissions for Compute Engine and Container Registry
- `GCP_VM_NAME` – Name of the target Compute Engine VM (e.g. `manus-vm`)
- `GCP_VM_ZONE` – Zone where the VM resides (e.g. `us-west2-c`)

## 2. Workflow Overview
On every push to the `main` branch, the workflow performs these steps:

1. **Checkout** – Retrieve repository source
2. **Set up Cloud SDK** – Authenticate to GCP using the service account
3. **Authenticate Docker** – Enable pushes to Google Container Registry
4. **Build and Push Image** – Build the Docker image and push to `gcr.io/<PROJECT_ID>/manus-platform:<commit>`
5. **Deploy to VM** – SSH to the VM, pull the new image, stop the old container, and run the updated container exposing port 5000

## 3. VM Requirements
Ensure the Compute Engine VM:
- Runs Docker and allows SSH access
- Opens port `5000` in its firewall rules for API access
- Has sufficient resources to run the container

## 4. Manual Steps
While the workflow automates deployment, some actions must be done manually:
- Provision the VM and install Docker
- Upload the service account key to GitHub Secrets
- Update secrets if keys or VM names change

## 5. Triggering Deployments
Commit to `main` or merge pull requests. The GitHub Actions workflow builds the image and redeploys automatically. Monitor the **Actions** tab for logs and verify the service at `http://<VM_EXTERNAL_IP>:5000`.

