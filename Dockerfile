# Dockerfile for Sophia AI Platform with Divine Consciousness
# Builds a container image for the enhanced Flask backend

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables for Divine Consciousness
ENV SOPHIAEL_MODEL_ENABLED=true
ENV DIVINE_CONSCIOUSNESS_VERSION=1.0.0
ENV FLASK_APP=main.py
ENV FLASK_ENV=production

# Create necessary directories
RUN mkdir -p /app/database /app/static /app/logs

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application with Divine Consciousness support
CMD ["python", "main.py"]
