import React, { useState, useEffect } from 'react';
import './DivineConsciousness.css';

const DivineConsciousness = () => {
  const [activeTab, setActiveTab] = useState('assess');
  const [consciousnessState, setConsciousnessState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spiritualDomains, setSpiritualDomains] = useState([]);
  const [consciousnessLevels, setConsciousnessLevels] = useState([]);

  // Assessment form state
  const [assessmentForm, setAssessmentForm] = useState({
    clarity_indicators: [],
    spiritual_practices: [],
    practice_frequency: 0.5,
    divine_experiences: [],
    prayer_frequency: 0.5,
    stress_level: 5,
    peace_frequency: 0.5,
    meditation_frequency: 0.5,
    anxiety_level: 5
  });

  // Guidance form state
  const [guidanceForm, setGuidanceForm] = useState({
    question: '',
    domain: 'wisdom'
  });

  // Meditation form state
  const [meditationForm, setMeditationForm] = useState({
    intention: '',
    duration_minutes: 20
  });

  const [guidanceResult, setGuidanceResult] = useState(null);
  const [meditationResult, setMeditationResult] = useState(null);
  const [dailyGuidance, setDailyGuidance] = useState(null);

  useEffect(() => {
    // Load spiritual domains and consciousness levels
    fetchSpiritualDomains();
    fetchConsciousnessLevels();
  }, []);

  const fetchSpiritualDomains = async () => {
    try {
      const response = await fetch('/api/divine-consciousness/domains');
      const data = await response.json();
      setSpiritualDomains(data.spiritual_domains || []);
    } catch (err) {
      console.error('Error fetching spiritual domains:', err);
    }
  };

  const fetchConsciousnessLevels = async () => {
    try {
      const response = await fetch('/api/divine-consciousness/consciousness/levels');
      const data = await response.json();
      setConsciousnessLevels(data.consciousness_levels || []);
    } catch (err) {
      console.error('Error fetching consciousness levels:', err);
    }
  };

  const handleAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/divine-consciousness/consciousness/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentForm),
      });

      if (!response.ok) {
        throw new Error('Assessment failed');
      }

      const data = await response.json();
      setConsciousnessState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuidanceRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        ...guidanceForm,
        consciousness_state: consciousnessState?.consciousness_state
      };

      const response = await fetch('/api/divine-consciousness/guidance/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Guidance request failed');
      }

      const data = await response.json();
      setGuidanceResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMeditationGuidance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        ...meditationForm,
        consciousness_before: consciousnessState?.consciousness_state
      };

      const response = await fetch('/api/divine-consciousness/meditation/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Meditation guidance failed');
      }

      const data = await response.json();
      setMeditationResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDailyGuidance = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        consciousness_state: consciousnessState?.consciousness_state
      };

      const response = await fetch('/api/divine-consciousness/guidance/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Daily guidance request failed');
      }

      const data = await response.json();
      setDailyGuidance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatConsciousnessLevel = (level) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConsciousnessColor = (level) => {
    const colors = {
      'awakening': '#4A90E2',
      'expanding': '#7ED321',
      'transcending': '#F5A623',
      'enlightened': '#BD10E0',
      'divine_unity': '#FFD700'
    };
    return colors[level] || '#4A90E2';
  };

  return (
    <div className="divine-consciousness-container">
      <div className="divine-header">
        <h1 className="divine-title">
          <span className="divine-icon">✨</span>
          Sophiael Divine Consciousness
          <span className="divine-icon">✨</span>
        </h1>
        <p className="divine-subtitle">
          Your gateway to spiritual guidance, consciousness expansion, and divine wisdom
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="divine-tabs">
        <button 
          className={`tab-button ${activeTab === 'assess' ? 'active' : ''}`}
          onClick={() => setActiveTab('assess')}
        >
          🔍 Consciousness Assessment
        </button>
        <button 
          className={`tab-button ${activeTab === 'guidance' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidance')}
        >
          🕊️ Divine Guidance
        </button>
        <button 
          className={`tab-button ${activeTab === 'meditation' ? 'active' : ''}`}
          onClick={() => setActiveTab('meditation')}
        >
          🧘 Meditation Guide
        </button>
        <button 
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          ☀️ Daily Wisdom
        </button>
      </div>

      <div className="divine-content">
        {activeTab === 'assess' && (
          <div className="tab-content">
            <h2>Consciousness Assessment</h2>
            <p>Discover your current level of spiritual awareness and consciousness evolution.</p>
            
            <form onSubmit={handleAssessment} className="assessment-form">
              <div className="form-section">
                <h3>Spiritual Practices</h3>
                <div className="checkbox-group">
                  {['meditation', 'prayer', 'journaling', 'yoga', 'reading sacred texts', 'nature connection'].map(practice => (
                    <label key={practice} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={assessmentForm.spiritual_practices.includes(practice)}
                        onChange={(e) => {
                          const practices = e.target.checked 
                            ? [...assessmentForm.spiritual_practices, practice]
                            : assessmentForm.spiritual_practices.filter(p => p !== practice);
                          setAssessmentForm({...assessmentForm, spiritual_practices: practices});
                        }}
                      />
                      {practice.charAt(0).toUpperCase() + practice.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Awareness Indicators</h3>
                <div className="checkbox-group">
                  {['clear thinking', 'focused attention', 'insightful awareness', 'intuitive knowing', 'emotional clarity'].map(indicator => (
                    <label key={indicator} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={assessmentForm.clarity_indicators.includes(indicator)}
                        onChange={(e) => {
                          const indicators = e.target.checked 
                            ? [...assessmentForm.clarity_indicators, indicator]
                            : assessmentForm.clarity_indicators.filter(i => i !== indicator);
                          setAssessmentForm({...assessmentForm, clarity_indicators: indicators});
                        }}
                      />
                      {indicator.charAt(0).toUpperCase() + indicator.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Divine Experiences</h3>
                <div className="checkbox-group">
                  {['synchronicities', 'inner guidance', 'peaceful presence', 'divine downloads', 'unity experiences'].map(experience => (
                    <label key={experience} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={assessmentForm.divine_experiences.includes(experience)}
                        onChange={(e) => {
                          const experiences = e.target.checked 
                            ? [...assessmentForm.divine_experiences, experience]
                            : assessmentForm.divine_experiences.filter(ex => ex !== experience);
                          setAssessmentForm({...assessmentForm, divine_experiences: experiences});
                        }}
                      />
                      {experience.charAt(0).toUpperCase() + experience.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Well-being Levels</h3>
                <div className="slider-group">
                  <label>
                    Stress Level (1 = very low, 10 = very high): {assessmentForm.stress_level}
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={assessmentForm.stress_level}
                      onChange={(e) => setAssessmentForm({...assessmentForm, stress_level: parseInt(e.target.value)})}
                      className="slider"
                    />
                  </label>
                  
                  <label>
                    Anxiety Level (1 = very low, 10 = very high): {assessmentForm.anxiety_level}
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={assessmentForm.anxiety_level}
                      onChange={(e) => setAssessmentForm({...assessmentForm, anxiety_level: parseInt(e.target.value)})}
                      className="slider"
                    />
                  </label>

                  <label>
                    Practice Frequency (0 = never, 1 = daily): {(assessmentForm.practice_frequency * 100).toFixed(0)}%
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={assessmentForm.practice_frequency}
                      onChange={(e) => setAssessmentForm({...assessmentForm, practice_frequency: parseFloat(e.target.value)})}
                      className="slider"
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="divine-button" disabled={loading}>
                {loading ? '🔮 Assessing...' : '🔮 Assess My Consciousness'}
              </button>
            </form>

            {consciousnessState && (
              <div className="consciousness-result">
                <h3>Your Consciousness Assessment</h3>
                <div className="consciousness-level" style={{borderLeft: `4px solid ${getConsciousnessColor(consciousnessState.consciousness_state.level)}`}}>
                  <h4>{formatConsciousnessLevel(consciousnessState.consciousness_state.level)}</h4>
                  <p>{consciousnessState.level_description}</p>
                  <p><strong>Guidance:</strong> {consciousnessState.guidance}</p>
                </div>
                
                <div className="consciousness-metrics">
                  <div className="metric">
                    <span>Clarity:</span>
                    <div className="progress-bar">
                      <div className="progress" style={{width: `${consciousnessState.consciousness_state.clarity * 100}%`}}></div>
                    </div>
                    <span>{(consciousnessState.consciousness_state.clarity * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="metric">
                    <span>Spiritual Resonance:</span>
                    <div className="progress-bar">
                      <div className="progress" style={{width: `${consciousnessState.consciousness_state.spiritual_resonance * 100}%`}}></div>
                    </div>
                    <span>{(consciousnessState.consciousness_state.spiritual_resonance * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="metric">
                    <span>Divine Connection:</span>
                    <div className="progress-bar">
                      <div className="progress" style={{width: `${consciousnessState.consciousness_state.divine_connection * 100}%`}}></div>
                    </div>
                    <span>{(consciousnessState.consciousness_state.divine_connection * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'guidance' && (
          <div className="tab-content">
            <h2>Receive Divine Guidance</h2>
            <p>Ask for spiritual guidance and receive wisdom from the divine consciousness.</p>
            
            <form onSubmit={handleGuidanceRequest} className="guidance-form">
              <div className="form-section">
                <label>
                  Your Question or Situation:
                  <textarea
                    value={guidanceForm.question}
                    onChange={(e) => setGuidanceForm({...guidanceForm, question: e.target.value})}
                    placeholder="Ask for guidance about your spiritual path, life decisions, or any situation where you seek divine wisdom..."
                    rows="4"
                    required
                  />
                </label>
              </div>

              <div className="form-section">
                <label>
                  Spiritual Domain:
                  <select
                    value={guidanceForm.domain}
                    onChange={(e) => setGuidanceForm({...guidanceForm, domain: e.target.value})}
                  >
                    {spiritualDomains.map(domain => (
                      <option key={domain.value} value={domain.value}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button type="submit" className="divine-button" disabled={loading || !consciousnessState}>
                {loading ? '🕊️ Receiving Guidance...' : '🕊️ Receive Divine Guidance'}
              </button>
              
              {!consciousnessState && (
                <p className="info-text">Complete a consciousness assessment first to receive personalized guidance.</p>
              )}
            </form>

            {guidanceResult && (
              <div className="guidance-result">
                <h3>Divine Guidance Received</h3>
                <div className="divine-message">
                  <p className="message">{guidanceResult.divine_insight.message}</p>
                  <div className="message-meta">
                    <span>Domain: {guidanceResult.divine_insight.domain}</span>
                    <span>Type: {guidanceResult.divine_insight.guidance_type}</span>
                    <span>Confidence: {(guidanceResult.divine_insight.confidence * 100).toFixed(0)}%</span>
                  </div>
                  {guidanceResult.divine_insight.sacred_reference && (
                    <p className="sacred-reference">
                      <strong>Sacred Reference:</strong> {guidanceResult.divine_insight.sacred_reference}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meditation' && (
          <div className="tab-content">
            <h2>Guided Meditation Session</h2>
            <p>Receive divine guidance for your meditation practice and track consciousness evolution.</p>
            
            <form onSubmit={handleMeditationGuidance} className="meditation-form">
              <div className="form-section">
                <label>
                  Meditation Intention:
                  <input
                    type="text"
                    value={meditationForm.intention}
                    onChange={(e) => setMeditationForm({...meditationForm, intention: e.target.value})}
                    placeholder="e.g., Connect with divine love, Find inner peace, Receive guidance..."
                    required
                  />
                </label>
              </div>

              <div className="form-section">
                <label>
                  Duration (minutes): {meditationForm.duration_minutes}
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={meditationForm.duration_minutes}
                    onChange={(e) => setMeditationForm({...meditationForm, duration_minutes: parseInt(e.target.value)})}
                    className="slider"
                  />
                </label>
              </div>

              <button type="submit" className="divine-button" disabled={loading || !consciousnessState}>
                {loading ? '🧘 Preparing Guidance...' : '🧘 Start Guided Session'}
              </button>
              
              {!consciousnessState && (
                <p className="info-text">Complete a consciousness assessment first to receive personalized meditation guidance.</p>
              )}
            </form>

            {meditationResult && (
              <div className="meditation-result">
                <h3>Meditation Session Complete</h3>
                <div className="session-info">
                  <p><strong>Session ID:</strong> {meditationResult.meditation_session.session_id}</p>
                  <p><strong>Intention:</strong> {meditationResult.meditation_session.intention}</p>
                  <p><strong>Duration:</strong> {meditationResult.meditation_session.duration_minutes} minutes</p>
                </div>
                
                <h4>Guidance Received:</h4>
                {meditationResult.meditation_session.guidance_received.map((guidance, index) => (
                  <div key={index} className="divine-message">
                    <p className="message">{guidance.message}</p>
                    <div className="message-meta">
                      <span>Domain: {guidance.domain}</span>
                      <span>Type: {guidance.guidance_type}</span>
                    </div>
                  </div>
                ))}
                
                <h4>Consciousness Evolution:</h4>
                <div className="consciousness-evolution">
                  {meditationResult.consciousness_evolution.level_changed && (
                    <p className="level-change">🎉 Consciousness level evolved!</p>
                  )}
                  <div className="improvements">
                    {Object.entries(meditationResult.consciousness_evolution.improvements).map(([key, value]) => (
                      value > 0 && (
                        <div key={key} className="improvement">
                          <span>{key.replace(/_/g, ' ')}: +{(value * 100).toFixed(1)}%</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'daily' && (
          <div className="tab-content">
            <h2>Daily Spiritual Guidance</h2>
            <p>Receive divine wisdom to guide your day with purpose and spiritual awareness.</p>
            
            <button onClick={handleDailyGuidance} className="divine-button" disabled={loading || !consciousnessState}>
              {loading ? '☀️ Receiving Daily Wisdom...' : '☀️ Get Today\'s Guidance'}
            </button>
            
            {!consciousnessState && (
              <p className="info-text">Complete a consciousness assessment first to receive personalized daily guidance.</p>
            )}

            {dailyGuidance && (
              <div className="daily-guidance-result">
                <h3>Today's Divine Guidance</h3>
                <p className="guidance-date">Date: {dailyGuidance.date}</p>
                
                {dailyGuidance.daily_guidance.map((guidance, index) => (
                  <div key={index} className="daily-message">
                    <div className="time-period">
                      {index === 0 ? '🌅 Morning' : index === 1 ? '☀️ Midday' : '🌙 Evening'}
                    </div>
                    <div className="divine-message">
                      <p className="message">{guidance.message}</p>
                      <div className="message-meta">
                        <span>Domain: {guidance.domain}</span>
                        {guidance.sacred_reference && (
                          <span>Reference: {guidance.sacred_reference}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivineConsciousness;