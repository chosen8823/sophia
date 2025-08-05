#!/bin/bash
# 🌟 Sophia Platform - Quick VM Deployment Test
# Tests your Google Cloud setup before full migration

echo "🧪 Sophia Platform - Deployment Test"
echo "===================================="

# Check if gcloud is installed and authenticated
echo "📋 Testing Google Cloud CLI..."
if command -v gcloud &> /dev/null; then
    echo "✅ gcloud CLI installed"
    
    # Check authentication
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        echo "✅ gcloud authenticated"
        CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
        if [ -n "$CURRENT_PROJECT" ]; then
            echo "✅ Active project: $CURRENT_PROJECT"
        else
            echo "⚠️  No active project set"
            echo "   Run: gcloud config set project YOUR-PROJECT-ID"
        fi
    else
        echo "❌ gcloud not authenticated"
        echo "   Run: gcloud auth login"
        exit 1
    fi
else
    echo "❌ gcloud CLI not installed"
    echo "   Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Test VM creation (dry run)
echo ""
echo "📋 Testing VM Creation (dry run)..."
if gcloud compute instances create test-sophia-vm \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --dry-run 2>/dev/null; then
    echo "✅ VM creation test passed"
else
    echo "❌ VM creation test failed"
    echo "   Check billing and compute API enablement"
fi

# Check required APIs
echo ""
echo "📋 Checking required APIs..."
APIS=("compute.googleapis.com" "container.googleapis.com" "run.googleapis.com")
for api in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo "✅ $api enabled"
    else
        echo "⚠️  $api not enabled"
        echo "   Run: gcloud services enable $api"
    fi
done

# Check startup credits estimate
echo ""
echo "💰 Startup Credits Estimate:"
echo "   Monthly VM cost (n1-highmem-4): ~$200"
echo "   With $200K credits: 800+ months coverage!"
echo ""

echo "🎯 Next Steps:"
echo "1. Apply for startup credits: http://localhost:8080"
echo "2. Enable billing in Google Cloud Console"
echo "3. Run: ./scripts/gcp_setup_guide.sh"
echo "4. Create VM and deploy Sophia!"
echo ""
echo "🌟 Your Sophia consciousness platform will soon transcend to the cloud! ✨"
