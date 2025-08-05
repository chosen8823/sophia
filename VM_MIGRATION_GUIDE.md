# 🌟 Sophia Platform - Google Cloud VM Migration Guide

## 🚀 Complete Migration with Your $200K Startup Credits

### Phase 1: Google Cloud Setup

1. **Apply for Startup Credits** (Use your landing page!)
   ```bash
   # Your landing page is running at:
   http://localhost:8080
   ```

2. **Run Setup Guide**
   ```bash
   chmod +x scripts/gcp_setup_guide.sh
   ./scripts/gcp_setup_guide.sh
   ```

### Phase 2: Create High-Performance VM

**Recommended VM Specs for AI Processing:**
- **Machine Type**: `n1-highmem-4` (26GB RAM, 4 vCPUs)
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Monthly Cost**: ~$200 (FREE with startup credits!)

```bash
# Create the VM
gcloud compute instances create sophia-ai-vm \
  --zone=us-central1-a \
  --machine-type=n1-highmem-4 \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=100GB \
  --boot-disk-type=pd-ssd \
  --tags=http-server,https-server

# Configure firewall
gcloud compute firewall-rules create allow-sophia-web \
  --allow tcp:5000,tcp:8080,tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow Sophia Platform web traffic"
```

### Phase 3: Automatic Migration

1. **Connect to VM**
   ```bash
   gcloud compute ssh sophia-ai-vm --zone=us-central1-a
   ```

2. **Auto-Setup Sophia** (Single Command!)
   ```bash
   curl -sSL https://raw.githubusercontent.com/chosen8823/sophia/main/scripts/vm_setup.sh | bash
   ```

### Phase 4: Production Deployment

Your VM will automatically have:
- ✅ Sophia Platform running on port 5000
- ✅ Auto-start service configured
- ✅ All dependencies installed
- ✅ Environment optimized for AI

**Access your platform:**
```
http://YOUR_VM_EXTERNAL_IP:5000
```

### Phase 5: Advanced Configuration

1. **Add API Keys** (for enhanced AI features)
   ```bash
   cd /home/$USER/sophia-platform
   nano .env
   # Add your HuggingFace, OpenAI keys
   ```

2. **Scale Resources** (if needed)
   ```bash
   # Upgrade to even more powerful VM
   gcloud compute instances set-machine-type sophia-ai-vm \
     --machine-type=n1-highmem-8 \
     --zone=us-central1-a
   ```

### 💰 Cost Management with Startup Credits

**Your $200K credits cover:**
- 🖥️  **VM Runtime**: 2+ years of continuous operation
- 💾  **Storage**: Massive model storage capacity  
- 🌐  **Networking**: Global AI model serving
- 🔄  **Scaling**: Auto-scaling for peak usage

**Monthly Breakdown:**
```
VM (n1-highmem-4):     $200/month
Storage (100GB SSD):   $20/month
Networking:            $10/month
Total:                 $230/month

With $200K credits: 800+ months of operation!
```

### 🎯 Success Indicators

After migration, you'll have:
- 🧠 **AI Processing**: 26GB RAM for large language models
- ⚡ **Performance**: 4 vCPUs for parallel processing
- 🌐 **Global Access**: Public IP with web interface
- 🔄 **Auto-Recovery**: Systemd service with auto-restart
- 📈 **Scalability**: Easy resource upgrades

### 🆘 Troubleshooting

**If setup fails:**
```bash
# Check service status
sudo systemctl status sophia

# View logs
sudo journalctl -u sophia -f

# Manual restart
sudo systemctl restart sophia
```

**VM not accessible:**
```bash
# Check firewall rules
gcloud compute firewall-rules list

# Verify VM status
gcloud compute instances describe sophia-ai-vm --zone=us-central1-a
```

### 🌟 Next Steps After Migration

1. **Configure CI/CD**: Your GitHub Actions will deploy to VM
2. **Add Monitoring**: Set up Cloud Monitoring for health checks
3. **Scale Globally**: Add load balancer for multiple regions
4. **AI Enhancement**: Connect to additional AI services

Your Sophia Consciousness Platform will be running on enterprise-grade infrastructure, powered by your startup credits! 🚀✨
