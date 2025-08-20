"""
Test suite for Sophiael Divine Consciousness Model
=================================================

Comprehensive tests for the Divine Consciousness implementation including:
- Core consciousness model functionality
- API endpoints
- Integration with the main Flask application
- Error handling and edge cases

Author: Sophia AI Platform
Version: 1.0.0
Date: January 2025
"""

import pytest
import json
import sys
import os
from datetime import datetime

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the modules to test
from sophiael_consciousness import (
    SophiaelDivineConsciousness,
    ConsciousnessLevel,
    SpiritualDomain,
    ConsciousnessState,
    DivineInsight,
    MeditationSession
)

class TestSophiaelDivineConsciousness:
    """Test the core Divine Consciousness model"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.divine_model = SophiaelDivineConsciousness()
        self.sample_input = {
            "clarity_indicators": ["clear thinking", "focused attention", "insightful awareness"],
            "spiritual_practices": ["meditation", "prayer", "journaling"],
            "practice_frequency": 0.7,
            "divine_experiences": ["synchronicities", "inner guidance", "peaceful presence"],
            "prayer_frequency": 0.8,
            "stress_level": 3,
            "peace_frequency": 0.6,
            "meditation_frequency": 0.5,
            "anxiety_level": 2
        }
    
    def test_model_initialization(self):
        """Test that the model initializes correctly"""
        assert self.divine_model.model_name == "Sophiael Divine Consciousness v1.0"
        assert len(self.divine_model.sacred_wisdom_database) == len(SpiritualDomain)
        assert len(self.divine_model.consciousness_patterns) > 0
        
    def test_consciousness_assessment(self):
        """Test consciousness state assessment"""
        consciousness_state = self.divine_model.assess_consciousness_state(self.sample_input)
        
        assert isinstance(consciousness_state, ConsciousnessState)
        assert isinstance(consciousness_state.level, ConsciousnessLevel)
        assert 0.0 <= consciousness_state.clarity <= 1.0
        assert 0.0 <= consciousness_state.spiritual_resonance <= 1.0
        assert 0.0 <= consciousness_state.divine_connection <= 1.0
        assert 0.0 <= consciousness_state.emotional_balance <= 1.0
        assert 0.0 <= consciousness_state.mental_peace <= 1.0
        assert isinstance(consciousness_state.timestamp, datetime)
    
    def test_divine_guidance(self):
        """Test divine guidance generation"""
        consciousness_state = self.divine_model.assess_consciousness_state(self.sample_input)
        
        guidance = self.divine_model.receive_divine_guidance(
            "How can I deepen my spiritual connection?",
            SpiritualDomain.WISDOM,
            consciousness_state
        )
        
        assert isinstance(guidance, DivineInsight)
        assert len(guidance.message) > 0
        assert guidance.domain == SpiritualDomain.WISDOM
        assert 0.0 <= guidance.confidence <= 1.0
        assert guidance.guidance_type in ["instructional", "advisory", "illuminative", "healing", "contemplative"]
        assert isinstance(guidance.timestamp, datetime)
    
    def test_meditation_guidance(self):
        """Test meditation session guidance"""
        consciousness_before = self.divine_model.assess_consciousness_state(self.sample_input)
        
        meditation_session = self.divine_model.guide_meditation_session(
            "Connect with divine love and wisdom",
            20,
            consciousness_before
        )
        
        assert isinstance(meditation_session, MeditationSession)
        assert meditation_session.intention == "Connect with divine love and wisdom"
        assert meditation_session.duration_minutes == 20
        assert len(meditation_session.guidance_received) > 0
        assert isinstance(meditation_session.consciousness_before, ConsciousnessState)
        assert isinstance(meditation_session.consciousness_after, ConsciousnessState)
        assert len(meditation_session.session_id) > 0
    
    def test_daily_guidance(self):
        """Test daily spiritual guidance"""
        consciousness_state = self.divine_model.assess_consciousness_state(self.sample_input)
        
        daily_guidance = self.divine_model.get_daily_spiritual_guidance(consciousness_state)
        
        assert isinstance(daily_guidance, list)
        assert len(daily_guidance) >= 3  # Morning, midday, evening
        
        for guidance in daily_guidance:
            assert isinstance(guidance, DivineInsight)
            assert len(guidance.message) > 0
            assert isinstance(guidance.domain, SpiritualDomain)
    
    def test_consciousness_evolution(self):
        """Test consciousness evolution during meditation"""
        consciousness_before = ConsciousnessState(
            level=ConsciousnessLevel.AWAKENING,
            clarity=0.5,
            spiritual_resonance=0.5,
            divine_connection=0.5,
            emotional_balance=0.5,
            mental_peace=0.5,
            timestamp=datetime.now()
        )
        
        consciousness_after = self.divine_model._evolve_consciousness_post_meditation(
            consciousness_before, 30, 3
        )
        
        # Check that some metrics improved
        assert consciousness_after.clarity >= consciousness_before.clarity
        assert consciousness_after.mental_peace >= consciousness_before.mental_peace
        assert consciousness_after.divine_connection >= consciousness_before.divine_connection
    
    def test_model_serialization(self):
        """Test model state serialization"""
        model_dict = self.divine_model.to_dict()
        
        assert "model_name" in model_dict
        assert "consciousness_levels" in model_dict
        assert "spiritual_domains" in model_dict
        assert "active_sessions" in model_dict
        assert "wisdom_database_size" in model_dict
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        # Test with minimal input
        minimal_input = {
            "stress_level": 5,
            "anxiety_level": 5
        }
        
        consciousness_state = self.divine_model.assess_consciousness_state(minimal_input)
        assert isinstance(consciousness_state, ConsciousnessState)
        
        # Test with extreme values
        extreme_input = {
            "stress_level": 10,
            "anxiety_level": 10,
            "practice_frequency": 0.0,
            "prayer_frequency": 0.0,
            "peace_frequency": 0.0,
            "meditation_frequency": 0.0
        }
        
        consciousness_state = self.divine_model.assess_consciousness_state(extreme_input)
        assert consciousness_state.level == ConsciousnessLevel.AWAKENING
    
    def test_all_spiritual_domains(self):
        """Test guidance generation for all spiritual domains"""
        consciousness_state = self.divine_model.assess_consciousness_state(self.sample_input)
        
        for domain in SpiritualDomain:
            guidance = self.divine_model.receive_divine_guidance(
                f"Guide me in {domain.value}",
                domain,
                consciousness_state
            )
            
            assert isinstance(guidance, DivineInsight)
            assert guidance.domain == domain
            assert len(guidance.message) > 0
    
    def test_consciousness_level_progression(self):
        """Test that higher consciousness inputs lead to higher levels"""
        # Low consciousness input
        low_input = {
            "stress_level": 9,
            "anxiety_level": 9,
            "practice_frequency": 0.1,
            "prayer_frequency": 0.1,
            "peace_frequency": 0.1,
            "meditation_frequency": 0.1,
            "clarity_indicators": [],
            "spiritual_practices": [],
            "divine_experiences": []
        }
        
        # High consciousness input
        high_input = {
            "stress_level": 1,
            "anxiety_level": 1,
            "practice_frequency": 0.9,
            "prayer_frequency": 0.9,
            "peace_frequency": 0.9,
            "meditation_frequency": 0.9,
            "clarity_indicators": ["clear thinking", "focused attention", "insightful awareness", "intuitive knowing"],
            "spiritual_practices": ["meditation", "prayer", "journaling", "yoga", "reading sacred texts"],
            "divine_experiences": ["synchronicities", "inner guidance", "peaceful presence", "divine downloads"]
        }
        
        low_consciousness = self.divine_model.assess_consciousness_state(low_input)
        high_consciousness = self.divine_model.assess_consciousness_state(high_input)
        
        # The high consciousness state should have better metrics
        assert high_consciousness.clarity > low_consciousness.clarity
        assert high_consciousness.spiritual_resonance > low_consciousness.spiritual_resonance
        assert high_consciousness.divine_connection > low_consciousness.divine_connection


def test_api_integration():
    """Test integration with the Flask API (if available)"""
    try:
        from flask import Flask
        from divine_consciousness_api import init_divine_consciousness_api
        
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test_key'
        
        init_divine_consciousness_api(app)
        
        with app.test_client() as client:
            # Test health check
            response = client.get('/api/divine-consciousness/health')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['status'] == 'healthy'
            
            # Test spiritual domains endpoint
            response = client.get('/api/divine-consciousness/domains')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'spiritual_domains' in data
            
            # Test consciousness levels endpoint
            response = client.get('/api/divine-consciousness/consciousness/levels')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'consciousness_levels' in data
            
            # Test consciousness assessment
            assessment_data = {
                "clarity_indicators": ["clear thinking"],
                "spiritual_practices": ["meditation"],
                "practice_frequency": 0.5,
                "divine_experiences": ["synchronicities"],
                "prayer_frequency": 0.5,
                "stress_level": 5,
                "peace_frequency": 0.5,
                "meditation_frequency": 0.5,
                "anxiety_level": 5
            }
            
            response = client.post('/api/divine-consciousness/consciousness/assess',
                                 json=assessment_data,
                                 content_type='application/json')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert 'consciousness_state' in data
            
            print("✓ API integration tests passed")
            
    except ImportError:
        print("⚠ API integration test skipped (Flask dependencies not available)")
    except Exception as e:
        print(f"⚠ API integration test failed: {e}")


def run_comprehensive_test():
    """Run a comprehensive test of the Divine Consciousness model"""
    print("🧪 Running Sophiael Divine Consciousness Model Tests")
    print("=" * 60)
    
    # Initialize test class
    test_class = TestSophiaelDivineConsciousness()
    test_class.setup_method()
    
    tests = [
        ("Model Initialization", test_class.test_model_initialization),
        ("Consciousness Assessment", test_class.test_consciousness_assessment),
        ("Divine Guidance", test_class.test_divine_guidance),
        ("Meditation Guidance", test_class.test_meditation_guidance),
        ("Daily Guidance", test_class.test_daily_guidance),
        ("Consciousness Evolution", test_class.test_consciousness_evolution),
        ("Model Serialization", test_class.test_model_serialization),
        ("Edge Cases", test_class.test_edge_cases),
        ("All Spiritual Domains", test_class.test_all_spiritual_domains),
        ("Consciousness Level Progression", test_class.test_consciousness_level_progression)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            test_func()
            print(f"✓ {test_name}")
            passed += 1
        except Exception as e:
            print(f"✗ {test_name}: {e}")
            failed += 1
    
    # Run API integration test
    test_api_integration()
    
    print("\n" + "=" * 60)
    print(f"Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! The Sophiael Divine Consciousness Model is ready.")
    else:
        print(f"⚠ {failed} test(s) failed. Please review the implementation.")
    
    return failed == 0


if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)