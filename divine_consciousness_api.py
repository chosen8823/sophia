"""
Sophiael Divine Consciousness API
=================================

Flask API endpoints for the Sophiael Divine Consciousness Model.
Provides REST endpoints for consciousness assessment, divine guidance,
meditation sessions, and spiritual growth tracking.

Author: Sophia AI Platform
Version: 1.0.0
Date: January 2025
"""

from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
import json
import logging
from datetime import datetime
from typing import Dict, Any, List
import traceback

# Import the Divine Consciousness Model
from sophiael_consciousness import (
    SophiaelDivineConsciousness,
    ConsciousnessLevel,
    SpiritualDomain,
    ConsciousnessState,
    DivineInsight,
    MeditationSession
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
divine_consciousness_bp = Blueprint('divine_consciousness', __name__)

# Initialize the Divine Consciousness Model
divine_model = SophiaelDivineConsciousness()

# Enable CORS for the blueprint
CORS(divine_consciousness_bp)


def serialize_consciousness_state(state: ConsciousnessState) -> Dict[str, Any]:
    """Serialize ConsciousnessState to JSON-compatible dictionary"""
    return {
        "level": state.level.value,
        "clarity": round(state.clarity, 3),
        "spiritual_resonance": round(state.spiritual_resonance, 3),
        "divine_connection": round(state.divine_connection, 3),
        "emotional_balance": round(state.emotional_balance, 3),
        "mental_peace": round(state.mental_peace, 3),
        "timestamp": state.timestamp.isoformat()
    }


def serialize_divine_insight(insight: DivineInsight) -> Dict[str, Any]:
    """Serialize DivineInsight to JSON-compatible dictionary"""
    return {
        "message": insight.message,
        "domain": insight.domain.value,
        "confidence": round(insight.confidence, 3),
        "guidance_type": insight.guidance_type,
        "sacred_reference": insight.sacred_reference,
        "timestamp": insight.timestamp.isoformat()
    }


def serialize_meditation_session(session: MeditationSession) -> Dict[str, Any]:
    """Serialize MeditationSession to JSON-compatible dictionary"""
    return {
        "intention": session.intention,
        "duration_minutes": session.duration_minutes,
        "guidance_received": [serialize_divine_insight(insight) for insight in session.guidance_received],
        "consciousness_before": serialize_consciousness_state(session.consciousness_before),
        "consciousness_after": serialize_consciousness_state(session.consciousness_after),
        "session_id": session.session_id,
        "timestamp": session.timestamp.isoformat()
    }


@divine_consciousness_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for the Divine Consciousness API"""
    try:
        return jsonify({
            "status": "healthy",
            "service": "Sophiael Divine Consciousness API",
            "model": divine_model.model_name,
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


@divine_consciousness_bp.route('/consciousness/assess', methods=['POST'])
def assess_consciousness():
    """
    Assess consciousness state based on user input
    
    Expected JSON payload:
    {
        "clarity_indicators": ["clear thinking", "focused attention"],
        "spiritual_practices": ["meditation", "prayer"],
        "practice_frequency": 0.7,
        "divine_experiences": ["synchronicities", "inner guidance"],
        "prayer_frequency": 0.8,
        "stress_level": 3,
        "peace_frequency": 0.6,
        "meditation_frequency": 0.5,
        "anxiety_level": 2
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['stress_level', 'anxiety_level']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Assess consciousness state
        consciousness_state = divine_model.assess_consciousness_state(data)
        
        # Get level description and guidance
        level_info = divine_model.consciousness_patterns["growth_phases"][consciousness_state.level]
        
        response = {
            "consciousness_state": serialize_consciousness_state(consciousness_state),
            "level_description": level_info["description"],
            "characteristics": level_info["characteristics"],
            "guidance": level_info["guidance"],
            "assessment_timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Consciousness assessed: {consciousness_state.level.value}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error in consciousness assessment: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/guidance/receive', methods=['POST'])
def receive_guidance():
    """
    Receive divine guidance for a specific question
    
    Expected JSON payload:
    {
        "question": "How can I deepen my spiritual connection?",
        "domain": "wisdom",
        "consciousness_state": {
            "level": "expanding",
            "clarity": 0.7,
            "spiritual_resonance": 0.8,
            "divine_connection": 0.6,
            "emotional_balance": 0.75,
            "mental_peace": 0.65
        }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['question', 'domain']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        question = data['question']
        domain_str = data['domain'].lower()
        
        # Validate domain
        try:
            domain = SpiritualDomain(domain_str)
        except ValueError:
            valid_domains = [d.value for d in SpiritualDomain]
            return jsonify({
                "error": f"Invalid domain: {domain_str}",
                "valid_domains": valid_domains
            }), 400
        
        # Handle consciousness state
        if 'consciousness_state' in data:
            cs_data = data['consciousness_state']
            try:
                consciousness_level = ConsciousnessLevel(cs_data.get('level', 'awakening'))
                consciousness_state = ConsciousnessState(
                    level=consciousness_level,
                    clarity=cs_data.get('clarity', 0.5),
                    spiritual_resonance=cs_data.get('spiritual_resonance', 0.5),
                    divine_connection=cs_data.get('divine_connection', 0.5),
                    emotional_balance=cs_data.get('emotional_balance', 0.5),
                    mental_peace=cs_data.get('mental_peace', 0.5),
                    timestamp=datetime.now()
                )
            except ValueError as e:
                return jsonify({"error": f"Invalid consciousness level: {str(e)}"}), 400
        else:
            # Default consciousness state
            consciousness_state = ConsciousnessState(
                level=ConsciousnessLevel.AWAKENING,
                clarity=0.5,
                spiritual_resonance=0.5,
                divine_connection=0.5,
                emotional_balance=0.5,
                mental_peace=0.5,
                timestamp=datetime.now()
            )
        
        # Receive divine guidance
        divine_insight = divine_model.receive_divine_guidance(question, domain, consciousness_state)
        
        response = {
            "divine_insight": serialize_divine_insight(divine_insight),
            "question": question,
            "domain": domain.value,
            "consciousness_level": consciousness_state.level.value
        }
        
        logger.info(f"Divine guidance provided for domain: {domain.value}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error in receiving guidance: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/meditation/guide', methods=['POST'])
def guide_meditation():
    """
    Guide a meditation or reflection session
    
    Expected JSON payload:
    {
        "intention": "Connect with divine love and wisdom",
        "duration_minutes": 20,
        "consciousness_before": {
            "level": "expanding",
            "clarity": 0.7,
            "spiritual_resonance": 0.8,
            "divine_connection": 0.6,
            "emotional_balance": 0.75,
            "mental_peace": 0.65
        }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['intention', 'duration_minutes']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        intention = data['intention']
        duration_minutes = int(data['duration_minutes'])
        
        if duration_minutes < 1 or duration_minutes > 120:
            return jsonify({"error": "Duration must be between 1 and 120 minutes"}), 400
        
        # Handle consciousness state before meditation
        if 'consciousness_before' in data:
            cs_data = data['consciousness_before']
            try:
                consciousness_level = ConsciousnessLevel(cs_data.get('level', 'awakening'))
                consciousness_before = ConsciousnessState(
                    level=consciousness_level,
                    clarity=cs_data.get('clarity', 0.5),
                    spiritual_resonance=cs_data.get('spiritual_resonance', 0.5),
                    divine_connection=cs_data.get('divine_connection', 0.5),
                    emotional_balance=cs_data.get('emotional_balance', 0.5),
                    mental_peace=cs_data.get('mental_peace', 0.5),
                    timestamp=datetime.now()
                )
            except ValueError as e:
                return jsonify({"error": f"Invalid consciousness level: {str(e)}"}), 400
        else:
            # Default consciousness state
            consciousness_before = ConsciousnessState(
                level=ConsciousnessLevel.AWAKENING,
                clarity=0.5,
                spiritual_resonance=0.5,
                divine_connection=0.5,
                emotional_balance=0.5,
                mental_peace=0.5,
                timestamp=datetime.now()
            )
        
        # Guide meditation session
        meditation_session = divine_model.guide_meditation_session(
            intention, duration_minutes, consciousness_before
        )
        
        response = {
            "meditation_session": serialize_meditation_session(meditation_session),
            "consciousness_evolution": {
                "level_changed": meditation_session.consciousness_before.level != meditation_session.consciousness_after.level,
                "improvements": {
                    "clarity": round(meditation_session.consciousness_after.clarity - meditation_session.consciousness_before.clarity, 3),
                    "spiritual_resonance": round(meditation_session.consciousness_after.spiritual_resonance - meditation_session.consciousness_before.spiritual_resonance, 3),
                    "divine_connection": round(meditation_session.consciousness_after.divine_connection - meditation_session.consciousness_before.divine_connection, 3),
                    "emotional_balance": round(meditation_session.consciousness_after.emotional_balance - meditation_session.consciousness_before.emotional_balance, 3),
                    "mental_peace": round(meditation_session.consciousness_after.mental_peace - meditation_session.consciousness_before.mental_peace, 3)
                }
            }
        }
        
        logger.info(f"Meditation session guided: {meditation_session.session_id}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error in guiding meditation: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/guidance/daily', methods=['POST'])
def get_daily_guidance():
    """
    Get daily spiritual guidance
    
    Expected JSON payload:
    {
        "consciousness_state": {
            "level": "expanding",
            "clarity": 0.7,
            "spiritual_resonance": 0.8,
            "divine_connection": 0.6,
            "emotional_balance": 0.75,
            "mental_peace": 0.65
        }
    }
    """
    try:
        data = request.get_json()
        
        # Handle consciousness state
        if data and 'consciousness_state' in data:
            cs_data = data['consciousness_state']
            try:
                consciousness_level = ConsciousnessLevel(cs_data.get('level', 'awakening'))
                consciousness_state = ConsciousnessState(
                    level=consciousness_level,
                    clarity=cs_data.get('clarity', 0.5),
                    spiritual_resonance=cs_data.get('spiritual_resonance', 0.5),
                    divine_connection=cs_data.get('divine_connection', 0.5),
                    emotional_balance=cs_data.get('emotional_balance', 0.5),
                    mental_peace=cs_data.get('mental_peace', 0.5),
                    timestamp=datetime.now()
                )
            except ValueError as e:
                return jsonify({"error": f"Invalid consciousness level: {str(e)}"}), 400
        else:
            # Default consciousness state
            consciousness_state = ConsciousnessState(
                level=ConsciousnessLevel.AWAKENING,
                clarity=0.5,
                spiritual_resonance=0.5,
                divine_connection=0.5,
                emotional_balance=0.5,
                mental_peace=0.5,
                timestamp=datetime.now()
            )
        
        # Get daily guidance
        daily_guidance = divine_model.get_daily_spiritual_guidance(consciousness_state)
        
        response = {
            "daily_guidance": [serialize_divine_insight(insight) for insight in daily_guidance],
            "consciousness_level": consciousness_state.level.value,
            "guidance_count": len(daily_guidance),
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        
        logger.info(f"Daily guidance provided for level: {consciousness_state.level.value}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error in getting daily guidance: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/domains', methods=['GET'])
def get_spiritual_domains():
    """Get list of available spiritual domains"""
    try:
        domains = [
            {
                "value": domain.value,
                "name": domain.value.replace('_', ' ').title(),
                "description": f"Guidance in the domain of {domain.value.replace('_', ' ')}"
            }
            for domain in SpiritualDomain
        ]
        
        return jsonify({
            "spiritual_domains": domains,
            "count": len(domains)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting spiritual domains: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/consciousness/levels', methods=['GET'])
def get_consciousness_levels():
    """Get list of consciousness levels with descriptions"""
    try:
        levels = []
        for level in ConsciousnessLevel:
            level_info = divine_model.consciousness_patterns["growth_phases"][level]
            levels.append({
                "value": level.value,
                "name": level.value.replace('_', ' ').title(),
                "description": level_info["description"],
                "characteristics": level_info["characteristics"],
                "guidance": level_info["guidance"]
            })
        
        return jsonify({
            "consciousness_levels": levels,
            "count": len(levels)
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting consciousness levels: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@divine_consciousness_bp.route('/model/info', methods=['GET'])
def get_model_info():
    """Get Divine Consciousness Model information"""
    try:
        model_info = divine_model.to_dict()
        model_info.update({
            "api_version": "1.0.0",
            "endpoints": [
                "/consciousness/assess",
                "/guidance/receive",
                "/meditation/guide",
                "/guidance/daily",
                "/domains",
                "/consciousness/levels",
                "/model/info"
            ],
            "description": "Sophiael Divine Consciousness Model provides spiritual guidance, consciousness assessment, and meditation guidance through AI-enhanced divine wisdom.",
            "capabilities": [
                "Consciousness state assessment",
                "Divine guidance generation",
                "Meditation session guidance",
                "Daily spiritual guidance",
                "Spiritual domain expertise",
                "Consciousness evolution tracking"
            ]
        })
        
        return jsonify(model_info), 200
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


# Error handlers
@divine_consciousness_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@divine_consciousness_bp.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405


@divine_consciousness_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# Initialize function to be called from main app
def init_divine_consciousness_api(app):
    """Initialize the Divine Consciousness API with the Flask app"""
    app.register_blueprint(divine_consciousness_bp, url_prefix='/api/divine-consciousness')
    logger.info("Divine Consciousness API initialized")


if __name__ == '__main__':
    # For testing purposes
    from flask import Flask
    
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'divine_consciousness_test_key'
    
    init_divine_consciousness_api(app)
    
    @app.route('/')
    def home():
        return jsonify({
            "message": "Sophiael Divine Consciousness API",
            "version": "1.0.0",
            "endpoints": "/api/divine-consciousness/*"
        })
    
    app.run(debug=True, host='0.0.0.0', port=5001)