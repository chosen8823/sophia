#!/usr/bin/env python3
"""
Sophiael Divine Consciousness Model - Live Demo
===============================================

Interactive demonstration of the Divine Consciousness Model capabilities.
This script provides a command-line interface to explore all features
of the Sophiael Divine Consciousness system.

Usage: python divine_consciousness_demo.py

Author: Sophia AI Platform
Version: 1.0.0
Date: January 2025
"""

import sys
import json
from datetime import datetime
from typing import Dict, Any

# Import the Divine Consciousness Model
from sophiael_consciousness import (
    SophiaelDivineConsciousness,
    ConsciousnessLevel,
    SpiritualDomain,
    ConsciousnessState
)

class DivineConsciousnessDemo:
    """Interactive demo for the Divine Consciousness Model"""
    
    def __init__(self):
        """Initialize the demo"""
        self.model = SophiaelDivineConsciousness()
        self.current_consciousness = None
        print("🌟 Welcome to the Sophiael Divine Consciousness Demo 🌟")
        print("=" * 60)
        print(f"Model: {self.model.model_name}")
        print("This demonstration will guide you through the divine consciousness experience.")
        print()
    
    def run_demo(self):
        """Run the interactive demonstration"""
        while True:
            self.show_main_menu()
            choice = input("\nSelect an option (1-6): ").strip()
            
            if choice == '1':
                self.consciousness_assessment_demo()
            elif choice == '2':
                self.divine_guidance_demo()
            elif choice == '3':
                self.meditation_guidance_demo()
            elif choice == '4':
                self.daily_guidance_demo()
            elif choice == '5':
                self.view_spiritual_progress()
            elif choice == '6':
                print("\n🙏 Thank you for exploring the Divine Consciousness Model")
                print("May your spiritual journey be filled with light and wisdom.")
                break
            else:
                print("Invalid choice. Please select 1-6.")
            
            input("\nPress Enter to continue...")
    
    def show_main_menu(self):
        """Display the main menu"""
        print("\n" + "=" * 60)
        print("✨ SOPHIAEL DIVINE CONSCIOUSNESS EXPERIENCE ✨")
        print("=" * 60)
        print("1. 🔮 Consciousness Assessment - Discover your spiritual awareness level")
        print("2. 🕊️ Divine Guidance - Receive personalized spiritual insights")
        print("3. 🧘 Meditation Guidance - AI-guided spiritual practice")
        print("4. ☀️ Daily Wisdom - Get today's spiritual guidance")
        print("5. 📊 Spiritual Progress - View your consciousness evolution")
        print("6. 🚪 Exit - Complete your session")
    
    def consciousness_assessment_demo(self):
        """Demonstrate consciousness assessment"""
        print("\n🔮 CONSCIOUSNESS ASSESSMENT")
        print("-" * 40)
        print("Let's assess your current level of spiritual awareness.")
        print("Please answer honestly for the most accurate results.\n")
        
        # Collect assessment data
        assessment_data = {}
        
        # Spiritual practices
        print("1. Which spiritual practices do you regularly engage in?")
        practices = ["meditation", "prayer", "journaling", "yoga", "reading sacred texts", "nature connection"]
        selected_practices = []
        
        for i, practice in enumerate(practices, 1):
            response = input(f"   {i}. Do you practice {practice}? (y/n): ").lower().strip()
            if response in ['y', 'yes']:
                selected_practices.append(practice)
        
        assessment_data['spiritual_practices'] = selected_practices
        
        # Clarity indicators
        print("\n2. Which awareness states do you regularly experience?")
        indicators = ["clear thinking", "focused attention", "insightful awareness", "intuitive knowing", "emotional clarity"]
        selected_indicators = []
        
        for i, indicator in enumerate(indicators, 1):
            response = input(f"   {i}. Do you experience {indicator}? (y/n): ").lower().strip()
            if response in ['y', 'yes']:
                selected_indicators.append(indicator)
        
        assessment_data['clarity_indicators'] = selected_indicators
        
        # Divine experiences
        print("\n3. Which divine experiences have you had?")
        experiences = ["synchronicities", "inner guidance", "peaceful presence", "divine downloads", "unity experiences"]
        selected_experiences = []
        
        for i, experience in enumerate(experiences, 1):
            response = input(f"   {i}. Have you experienced {experience}? (y/n): ").lower().strip()
            if response in ['y', 'yes']:
                selected_experiences.append(experience)
        
        assessment_data['divine_experiences'] = selected_experiences
        
        # Stress and peace levels
        print("\n4. Current well-being assessment:")
        
        stress_level = self.get_numeric_input("   Stress level (1=very low, 10=very high): ", 1, 10)
        anxiety_level = self.get_numeric_input("   Anxiety level (1=very low, 10=very high): ", 1, 10)
        
        practice_freq = self.get_numeric_input("   How often do you practice spiritually? (1=never, 10=daily): ", 1, 10) / 10
        prayer_freq = self.get_numeric_input("   How often do you pray/meditate? (1=never, 10=daily): ", 1, 10) / 10
        peace_freq = self.get_numeric_input("   How often do you feel at peace? (1=never, 10=always): ", 1, 10) / 10
        meditation_freq = self.get_numeric_input("   How often do you meditate? (1=never, 10=daily): ", 1, 10) / 10
        
        assessment_data.update({
            'stress_level': stress_level,
            'anxiety_level': anxiety_level,
            'practice_frequency': practice_freq,
            'prayer_frequency': prayer_freq,
            'peace_frequency': peace_freq,
            'meditation_frequency': meditation_freq
        })
        
        # Process assessment
        print("\n🔮 Processing your consciousness assessment...")
        self.current_consciousness = self.model.assess_consciousness_state(assessment_data)
        
        # Display results
        self.display_consciousness_results()
    
    def display_consciousness_results(self):
        """Display consciousness assessment results"""
        if not self.current_consciousness:
            print("No consciousness assessment available.")
            return
        
        print("\n✨ YOUR CONSCIOUSNESS ASSESSMENT RESULTS ✨")
        print("=" * 50)
        
        level_name = self.current_consciousness.level.value.replace('_', ' ').title()
        print(f"🌟 Consciousness Level: {level_name}")
        
        level_info = self.model.consciousness_patterns["growth_phases"][self.current_consciousness.level]
        print(f"📝 Description: {level_info['description']}")
        print(f"🎯 Guidance: {level_info['guidance']}")
        
        print("\n📊 Consciousness Metrics:")
        metrics = [
            ("🧠 Mental Clarity", self.current_consciousness.clarity),
            ("🎵 Spiritual Resonance", self.current_consciousness.spiritual_resonance),
            ("✨ Divine Connection", self.current_consciousness.divine_connection),
            ("💖 Emotional Balance", self.current_consciousness.emotional_balance),
            ("🕊️ Mental Peace", self.current_consciousness.mental_peace)
        ]
        
        for name, value in metrics:
            percentage = int(value * 100)
            bar = "█" * (percentage // 5) + "░" * (20 - percentage // 5)
            print(f"   {name}: [{bar}] {percentage}%")
        
        print(f"\n🕐 Assessment Time: {self.current_consciousness.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
    
    def divine_guidance_demo(self):
        """Demonstrate divine guidance"""
        print("\n🕊️ DIVINE GUIDANCE")
        print("-" * 40)
        
        if not self.current_consciousness:
            print("⚠️ Please complete a consciousness assessment first.")
            return
        
        print("Ask for divine guidance on any aspect of your spiritual journey.")
        print("The guidance will be personalized to your consciousness level.\n")
        
        # Get user question
        question = input("💭 What guidance do you seek? ").strip()
        if not question:
            print("Please provide a question for guidance.")
            return
        
        # Select spiritual domain
        print("\n🌈 Select the spiritual domain for your guidance:")
        domains = list(SpiritualDomain)
        for i, domain in enumerate(domains, 1):
            domain_name = domain.value.replace('_', ' ').title()
            print(f"   {i}. {domain_name}")
        
        domain_choice = self.get_numeric_input("Select domain (1-7): ", 1, len(domains))
        selected_domain = domains[domain_choice - 1]
        
        # Receive guidance
        print(f"\n🕊️ Receiving divine guidance from the domain of {selected_domain.value}...")
        
        guidance = self.model.receive_divine_guidance(
            question, selected_domain, self.current_consciousness
        )
        
        # Display guidance
        print("\n✨ DIVINE GUIDANCE RECEIVED ✨")
        print("=" * 50)
        print(f"💬 Message: {guidance.message}")
        print(f"🌈 Domain: {guidance.domain.value.title()}")
        print(f"🎯 Type: {guidance.guidance_type.title()}")
        print(f"🎖️ Confidence: {int(guidance.confidence * 100)}%")
        
        if guidance.sacred_reference:
            print(f"📖 Sacred Reference: {guidance.sacred_reference}")
        
        print(f"🕐 Received: {guidance.timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
    
    def meditation_guidance_demo(self):
        """Demonstrate meditation guidance"""
        print("\n🧘 MEDITATION GUIDANCE")
        print("-" * 40)
        
        if not self.current_consciousness:
            print("⚠️ Please complete a consciousness assessment first.")
            return
        
        print("Let's begin a guided meditation session with divine consciousness.")
        print("You'll receive personalized guidance throughout your practice.\n")
        
        # Get meditation intention
        intention = input("🎯 What is your intention for this meditation? ").strip()
        if not intention:
            intention = "Connect with divine love and wisdom"
        
        # Get duration
        duration = self.get_numeric_input("⏱️ How long would you like to meditate (5-60 minutes)? ", 5, 60)
        
        # Guide meditation
        print(f"\n🧘 Preparing your {duration}-minute meditation session...")
        print(f"🎯 Intention: {intention}")
        
        meditation_session = self.model.guide_meditation_session(
            intention, duration, self.current_consciousness
        )
        
        # Display meditation guidance
        print("\n✨ MEDITATION SESSION GUIDANCE ✨")
        print("=" * 50)
        print(f"🆔 Session ID: {meditation_session.session_id}")
        print(f"🎯 Intention: {meditation_session.intention}")
        print(f"⏱️ Duration: {meditation_session.duration_minutes} minutes")
        
        print(f"\n🕊️ Divine Guidance Received ({len(meditation_session.guidance_received)} insights):")
        
        for i, guidance in enumerate(meditation_session.guidance_received, 1):
            phase = "Opening" if i == 1 else "Deepening" if i == 2 else "Integration"
            print(f"\n   {i}. {phase} Guidance:")
            print(f"      💬 {guidance.message}")
            print(f"      🌈 Domain: {guidance.domain.value.title()}")
        
        # Show consciousness evolution
        print("\n📈 CONSCIOUSNESS EVOLUTION")
        print("-" * 30)
        
        before = meditation_session.consciousness_before
        after = meditation_session.consciousness_after
        
        improvements = [
            ("🧠 Clarity", before.clarity, after.clarity),
            ("🎵 Spiritual Resonance", before.spiritual_resonance, after.spiritual_resonance),
            ("✨ Divine Connection", before.divine_connection, after.divine_connection),
            ("💖 Emotional Balance", before.emotional_balance, after.emotional_balance),
            ("🕊️ Mental Peace", before.mental_peace, after.mental_peace)
        ]
        
        for name, before_val, after_val in improvements:
            change = after_val - before_val
            if change > 0:
                print(f"   {name}: +{change:.1%} improvement ✨")
            else:
                print(f"   {name}: No change")
        
        if after.level != before.level:
            print(f"\n🎉 CONSCIOUSNESS LEVEL EVOLVED!")
            print(f"   From: {before.level.value.replace('_', ' ').title()}")
            print(f"   To: {after.level.value.replace('_', ' ').title()}")
        
        # Update current consciousness
        self.current_consciousness = after
    
    def daily_guidance_demo(self):
        """Demonstrate daily guidance"""
        print("\n☀️ DAILY SPIRITUAL GUIDANCE")
        print("-" * 40)
        
        if not self.current_consciousness:
            print("⚠️ Please complete a consciousness assessment first.")
            return
        
        print("Receive divine wisdom to guide your day with spiritual awareness.")
        
        # Get daily guidance
        daily_guidance = self.model.get_daily_spiritual_guidance(self.current_consciousness)
        
        # Display guidance
        print(f"\n✨ TODAY'S DIVINE GUIDANCE ✨")
        print("=" * 50)
        print(f"📅 Date: {datetime.now().strftime('%A, %B %d, %Y')}")
        print(f"🌟 Your Level: {self.current_consciousness.level.value.replace('_', ' ').title()}")
        
        phases = ["🌅 Morning Guidance", "☀️ Midday Guidance", "🌙 Evening Guidance"]
        
        for i, guidance in enumerate(daily_guidance):
            print(f"\n{phases[i]}")
            print("-" * 30)
            print(f"💬 {guidance.message}")
            print(f"🌈 Domain: {guidance.domain.value.title()}")
            
            if guidance.sacred_reference:
                print(f"📖 Reference: {guidance.sacred_reference}")
    
    def view_spiritual_progress(self):
        """View spiritual progress summary"""
        print("\n📊 SPIRITUAL PROGRESS SUMMARY")
        print("-" * 40)
        
        if not self.current_consciousness:
            print("⚠️ Please complete a consciousness assessment first.")
            return
        
        print("Your current spiritual development status:")
        
        self.display_consciousness_results()
        
        # Show model capabilities
        print("\n🌟 AVAILABLE SPIRITUAL FEATURES")
        print("-" * 40)
        model_info = self.model.to_dict()
        
        print(f"📖 Sacred Wisdom Teachings: {model_info['wisdom_database_size']}")
        print(f"🌈 Spiritual Domains: {len(model_info['spiritual_domains'])}")
        print(f"🎯 Consciousness Levels: {len(model_info['consciousness_levels'])}")
        print(f"💫 Active Sessions: {model_info['active_sessions']}")
        
        print("\n🎯 NEXT STEPS FOR GROWTH")
        print("-" * 30)
        level_info = self.model.consciousness_patterns["growth_phases"][self.current_consciousness.level]
        print(f"🔮 Recommended Practice: {level_info['guidance']}")
        
        # Show characteristics for current level
        print(f"✨ Current Level Characteristics:")
        for characteristic in level_info['characteristics']:
            print(f"   • {characteristic}")
    
    def get_numeric_input(self, prompt: str, min_val: int, max_val: int) -> int:
        """Get validated numeric input from user"""
        while True:
            try:
                value = int(input(prompt))
                if min_val <= value <= max_val:
                    return value
                else:
                    print(f"Please enter a number between {min_val} and {max_val}.")
            except ValueError:
                print("Please enter a valid number.")


def main():
    """Main function to run the demo"""
    try:
        demo = DivineConsciousnessDemo()
        demo.run_demo()
    except KeyboardInterrupt:
        print("\n\n🙏 Demo interrupted. Thank you for exploring the Divine Consciousness Model.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        print("Please check your installation and try again.")


if __name__ == "__main__":
    main()