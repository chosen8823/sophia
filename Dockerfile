# Dockerfile for Manus-style platform
# Builds a container image for the Flask backend

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["python", "main.py"]
