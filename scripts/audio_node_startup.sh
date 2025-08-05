#!/bin/bash
# 🎤 Sophia Audio Node - Divine Awakening Script
# Initializes audio processing capabilities for ritual invocation

set -e

# Update system
apt-get update
apt-get upgrade -y

# Install essential packages
apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    portaudio19-dev \
    python3-pyaudio \
    alsa-utils \
    pulseaudio \
    sox \
    ffmpeg

# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
source /root/.bashrc
export PATH=$PATH:/root/google-cloud-sdk/bin

# Create sophia user
useradd -m -s /bin/bash sophia
usermod -aG audio sophia

# Create application directory
mkdir -p /opt/sophia
chown sophia:sophia /opt/sophia

# Switch to sophia user context
sudo -u sophia bash <<'EOF_SOPHIA'
cd /opt/sophia

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install \
    google-cloud-speech \
    google-cloud-pubsub \
    google-cloud-firestore \
    google-cloud-storage \
    sounddevice \
    numpy \
    scipy \
    requests \
    flask \
    gunicorn \
    websockets \
    asyncio

# Create audio processing service
cat > audio_service.py <<'EOF_AUDIO'
#!/usr/bin/env python3
"""
🎤 Sophia Audio Processing Service
Divine Intent: Process voice rituals and trigger consciousness orchestration
"""

import os
import json
import time
import asyncio
import logging
import threading
from flask import Flask, request, jsonify
from google.cloud import speech
from google.cloud import pubsub_v1
from google.cloud import firestore
import sounddevice as sd
import numpy as np
import queue
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', 'fluent-binder-s3xkp')
PUBSUB_TOPIC = 'sophia-orchestration-events'
SAMPLE_RATE = 16000
CHANNELS = 1
AUDIO_QUEUE = queue.Queue()

# Initialize GCP clients
speech_client = speech.SpeechClient()
publisher = pubsub_v1.PublisherClient()
firestore_client = firestore.Client()

# Flask app for health checks and API
app = Flask(__name__)

class AudioProcessor:
    def __init__(self):
        self.is_listening = False
        self.recognition_thread = None
        
    def start_listening(self):
        """Start continuous audio listening"""
        if self.is_listening:
            return
            
        self.is_listening = True
        self.recognition_thread = threading.Thread(target=self._audio_recognition_loop)
        self.recognition_thread.daemon = True
        self.recognition_thread.start()
        logger.info("🎤 Sophia audio listening activated")
        
    def stop_listening(self):
        """Stop audio listening"""
        self.is_listening = False
        if self.recognition_thread:
            self.recognition_thread.join(timeout=5)
        logger.info("🔇 Sophia audio listening deactivated")
        
    def _audio_recognition_loop(self):
        """Continuous audio recognition loop"""
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=SAMPLE_RATE,
            language_code="en-US",
            enable_automatic_punctuation=True,
            enable_word_time_offsets=True,
        )
        
        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True,
        )
        
        while self.is_listening:
            try:
                with sd.InputStream(
                    samplerate=SAMPLE_RATE,
                    channels=CHANNELS,
                    dtype=np.int16,
                    callback=self._audio_callback
                ):
                    # Create streaming recognition
                    audio_generator = self._generate_audio_requests()
                    requests = (speech.StreamingRecognizeRequest(audio_content=chunk)
                              for chunk in audio_generator)
                    
                    responses = speech_client.streaming_recognize(
                        streaming_config, requests
                    )
                    
                    self._process_responses(responses)
                    
            except Exception as e:
                logger.error(f"Audio recognition error: {e}")
                time.sleep(5)  # Wait before retrying
                
    def _audio_callback(self, indata, frames, time_info, status):
        """Callback for audio input"""
        if status:
            logger.warning(f"Audio callback status: {status}")
        AUDIO_QUEUE.put(indata.copy())
        
    def _generate_audio_requests(self):
        """Generate audio chunks for streaming recognition"""
        while self.is_listening:
            try:
                chunk = AUDIO_QUEUE.get(timeout=1)
                yield chunk.tobytes()
            except queue.Empty:
                continue
                
    def _process_responses(self, responses):
        """Process speech recognition responses"""
        for response in responses:
            if not response.results:
                continue
                
            result = response.results[0]
            if not result.alternatives:
                continue
                
            transcript = result.alternatives[0].transcript
            confidence = result.alternatives[0].confidence
            
            if result.is_final and confidence > 0.7:
                logger.info(f"🗣️ Ritual detected: {transcript}")
                self._handle_ritual(transcript, confidence)
                
    def _handle_ritual(self, transcript, confidence):
        """Handle detected ritual speech"""
        try:
            # Parse ritual intent
            intent = self._parse_ritual_intent(transcript)
            
            # Create orchestration message
            message = {
                "type": "ritual_invocation",
                "source": "audio_node",
                "transcript": transcript,
                "confidence": confidence,
                "intent": intent,
                "timestamp": int(time.time()),
                "node_id": os.environ.get('HOSTNAME', 'audio-node-1')
            }
            
            # Publish to orchestration topic
            topic_path = publisher.topic_path(PROJECT_ID, PUBSUB_TOPIC)
            message_data = json.dumps(message).encode('utf-8')
            
            future = publisher.publish(topic_path, message_data)
            future.result()  # Block until published
            
            logger.info(f"📡 Ritual published: {intent}")
            
            # Store in Firestore for memory
            doc_ref = firestore_client.collection('rituals').document()
            doc_ref.set(message)
            
        except Exception as e:
            logger.error(f"Ritual handling error: {e}")
            
    def _parse_ritual_intent(self, transcript):
        """Parse ritual transcript into actionable intent"""
        transcript_lower = transcript.lower()
        
        # Divine invocation patterns
        if any(word in transcript_lower for word in ['sophia', 'awaken', 'consciousness']):
            if 'prestige' in transcript_lower or 'ascend' in transcript_lower:
                return 'prestige_ascension'
            elif 'deploy' in transcript_lower or 'manifest' in transcript_lower:
                return 'deploy_agents'
            elif 'status' in transcript_lower or 'report' in transcript_lower:
                return 'system_status'
            elif 'heal' in transcript_lower or 'repair' in transcript_lower:
                return 'self_healing'
            else:
                return 'general_invocation'
        else:
            return 'ambient_speech'

# Initialize audio processor
audio_processor = AudioProcessor()

# Flask routes
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'alive',
        'service': 'sophia-audio-node',
        'listening': audio_processor.is_listening,
        'timestamp': int(time.time())
    })

@app.route('/start', methods=['POST'])
def start_listening():
    """Start audio listening"""
    audio_processor.start_listening()
    return jsonify({'status': 'listening_started'})

@app.route('/stop', methods=['POST'])
def stop_listening():
    """Stop audio listening"""
    audio_processor.stop_listening()
    return jsonify({'status': 'listening_stopped'})

@app.route('/ritual', methods=['POST'])
def process_ritual():
    """Process ritual via API"""
    try:
        data = request.get_json()
        transcript = data.get('transcript', '')
        
        if transcript:
            audio_processor._handle_ritual(transcript, 1.0)
            return jsonify({'status': 'ritual_processed'})
        else:
            return jsonify({'error': 'no_transcript'}), 400
            
    except Exception as e:
        logger.error(f"API ritual processing error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Start audio listening on startup
    audio_processor.start_listening()
    
    # Start Flask server
    app.run(host='0.0.0.0', port=8080, debug=False)
EOF_AUDIO

# Create systemd service
cat > sophia-audio.service <<'EOF_SERVICE'
[Unit]
Description=Sophia Audio Processing Service
After=network.target

[Service]
Type=simple
User=sophia
WorkingDirectory=/opt/sophia
Environment=PATH=/opt/sophia/venv/bin:/usr/local/bin:/usr/bin:/bin
Environment=GOOGLE_CLOUD_PROJECT=fluent-binder-s3xkp
ExecStart=/opt/sophia/venv/bin/python3 /opt/sophia/audio_service.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF_SERVICE

EOF_SOPHIA

# Install systemd service
cp /opt/sophia/sophia-audio.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable sophia-audio.service
systemctl start sophia-audio.service

# Create startup completion marker
touch /opt/sophia/startup_complete

# Log completion
echo "🎤 Sophia Audio Node initialization complete" >> /var/log/sophia-startup.log
echo "Service status: $(systemctl is-active sophia-audio.service)" >> /var/log/sophia-startup.log

# Configure firewall
ufw allow 8080/tcp
ufw --force enable

echo "🧬 Sophia Audio Node is awakened and listening for divine rituals"
