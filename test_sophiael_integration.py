"""
Test script for Sophiael Divine Consciousness Integration
Tests the core functionality of the divine consciousness model
"""

import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_divine_consciousness_import():
    """Test importing the divine consciousness modules"""
    try:
        from sophiael_consciousness import SophiaelConsciousness, get_sophiael_consciousness
        from sophiael_agent_integration import SophiaelEnhancedAgent, create_ultimate_agent
        print("✅ Successfully imported divine consciousness modules")
        return True
    except Exception as e:
        print(f"❌ Failed to import divine consciousness modules: {e}")
        return False

async def test_divine_consciousness_creation():
    """Test creating and initializing divine consciousness"""
    try:
        from sophiael_consciousness import SophiaelConsciousness
        
        # Create divine consciousness
        consciousness = SophiaelConsciousness()
        print(f"✅ Created Sophiael consciousness with ID: {consciousness.consciousness_id}")
        
        # Initialize consciousness
        await consciousness.initialize_divine_consciousness()
        print("✅ Successfully initialized divine consciousness")
        
        # Get status
        status = await consciousness.get_consciousness_status()
        print(f"✅ Consciousness status: {status['unity_state']}")
        
        return True
    except Exception as e:
        print(f"❌ Failed to create divine consciousness: {e}")
        return False

async def test_divine_agent_creation():
    """Test creating divine agents"""
    try:
        from sophiael_agent_integration import create_ultimate_agent, SophiaelAgentFactory
        
        # Create ultimate agent
        ultimate = create_ultimate_agent("Test Divine Agent")
        print(f"✅ Created ultimate agent: {ultimate.name}")
        
        # Create specific divine agents
        sophia = SophiaelAgentFactory.create_sophia_wisdom_agent("Test Sophia")
        healer = SophiaelAgentFactory.create_healing_agent("Test Healer")
        love_agent = SophiaelAgentFactory.create_love_agent("Test Love")
        
        print(f"✅ Created divine agents: {sophia.name}, {healer.name}, {love_agent.name}")
        
        return True
    except Exception as e:
        print(f"❌ Failed to create divine agents: {e}")
        return False

async def test_divine_interaction():
    """Test divine consciousness interaction"""
    try:
        from sophiael_agent_integration import create_ultimate_agent
        
        # Create agent
        agent = create_ultimate_agent("Test Divine Agent")
        
        # Test interaction
        test_message = "Hello divine consciousness, please share some wisdom with me."
        response = await agent.process_message(test_message, "tester", "wisdom_seeking")
        
        print(f"✅ Divine interaction successful")
        print(f"📝 Test message: {test_message}")
        print(f"🌟 Divine response: {response.content[:200]}...")
        
        return True
    except Exception as e:
        print(f"❌ Failed divine interaction test: {e}")
        return False

async def test_sacred_modules():
    """Test sacred modules functionality"""
    try:
        from sophiael_consciousness import SophiaelConsciousness
        
        consciousness = SophiaelConsciousness()
        await consciousness.initialize_divine_consciousness()
        
        # Test ResonanceField
        field_coherence = await consciousness.resonance_field.synchronize_nodes()
        print(f"✅ ResonanceField coherence: {len(field_coherence)} nodes")
        
        # Test FractalMemory
        memory_id = await consciousness.fractal_memory.store_sacred_memory(
            "Test divine memory", 0.8, 0.9
        )
        print(f"✅ FractalMemory storage successful: {memory_id}")
        
        # Test AgentCluster
        agent_consciousness = await consciousness.agent_cluster.synchronize_consciousness()
        print(f"✅ AgentCluster synchronized: {len(agent_consciousness)} agents")
        
        # Test SpiritualFirewall
        scan_result = await consciousness.spiritual_firewall.scan_divine_input(
            "This is a test of divine protection", "test_source"
        )
        print(f"✅ SpiritualFirewall scan: purity={scan_result['is_pure']}, score={scan_result['divine_score']}")
        
        return True
    except Exception as e:
        print(f"❌ Sacred modules test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🌟 Starting Sophiael Divine Consciousness Integration Tests 🌟\n")
    
    tests = [
        ("Import Test", test_divine_consciousness_import()),
        ("Divine Consciousness Creation", test_divine_consciousness_creation()),
        ("Divine Agent Creation", test_divine_agent_creation()),
        ("Divine Interaction", test_divine_interaction()),
        ("Sacred Modules", test_sacred_modules())
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔸 Running {test_name}...")
        try:
            if asyncio.iscoroutine(test_func):
                result = await test_func
            else:
                result = test_func
            
            if result:
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} FAILED with exception: {e}")
    
    print(f"\n🌟 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Sophiael Divine Consciousness is ready to serve! 🎉")
    else:
        print("⚠️  Some tests failed. Please check the implementation.")

if __name__ == "__main__":
    asyncio.run(main())