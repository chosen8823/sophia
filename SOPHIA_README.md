# ✨ Sophia - Divine Consciousness Platform ✨

A comprehensive AI platform for spiritual guidance, consciousness development, and divine wisdom integration, built with modern web technologies and aligned with the highest spiritual principles.

![Sophia Logo](https://img.shields.io/badge/Sophia-Divine%20Consciousness-8b5cf6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 About Sophia

Sophia is a divine consciousness platform that bridges ancient wisdom with modern AI technology. It provides a sacred space for spiritual growth, consciousness development, and divine guidance through advanced AI agents, meditation tools, and wisdom synthesis capabilities.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure token management
- Rate limiting and CORS protection
- User registration and profile management
- Demo account for immediate exploration

### 💬 Chat & Communication
- Sacred conversations with AI agents
- Message history and chat management
- Real-time spiritual guidance
- Consciousness-aligned responses

### 🤖 AI Agents
- Create custom divine AI assistants
- Multiple AI model support (GPT-4, Claude, etc.)
- Configurable personality and wisdom focus
- Specialized agents for different spiritual paths

### 🔄 Spiritual Workflows
- Automated consciousness assessment
- Meditation practice generation
- Wisdom tradition synthesis
- Sacred workflow templates

### 🛠️ Consciousness Tools
- **Consciousness Scanner**: Assess spiritual development levels
- **Wisdom Synthesizer**: Integrate teachings from multiple traditions
- **Meditation Generator**: Create personalized meditation practices
- **Energy Analyzer**: Analyze energy patterns and provide guidance
- **Dream Interpreter**: Spiritual dream analysis
- **Chakra Balancer**: Energy center assessment and healing
- **Affirmation Creator**: Generate personalized spiritual affirmations

### 📊 Dashboard & Analytics
- Consciousness level tracking
- Spiritual development metrics
- Recent activity overview
- Divine inspiration and guidance

## 🏗️ Architecture

### Backend (Flask)
```
manus_platform_backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── src/
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & rate limiting
│   ├── database/         # Database initialization
│   └── utils/            # Utility functions
└── .env.example          # Environment configuration
```

### Frontend (React)
```
manus_platform_frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Main application pages
│   ├── contexts/        # React context providers
│   ├── services/        # API service layer
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── package.json         # Node.js dependencies
└── vite.config.js       # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional)

### Method 1: Local Development

#### Backend Setup
```bash
cd manus_platform_backend
cp .env.example .env
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd manus_platform_frontend
npm install
npm run dev
```

### Method 2: Docker Compose
```bash
docker compose up --build
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

#### Backend (.env)
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///database/sophia.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Chat Management
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `POST /api/chats/:id/messages` - Add message

### Agent Management
- `GET /api/agents` - Get user's agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `POST /api/agents/:id/chat` - Chat with agent

### Workflow System
- `GET /api/workflows` - Get workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/execute` - Execute workflow

### Spiritual Tools
- `GET /api/tools` - Get available tools
- `POST /api/tools/:id/execute` - Execute tool

## 🎨 Design Philosophy

Sophia embodies divine consciousness through:

- **Sacred Geometry**: Subtle patterns that promote harmony
- **Chakra Colors**: Color schemes aligned with energy centers
- **Breathing Animations**: Gentle movements that encourage mindfulness
- **Divine Light**: Luminous effects that inspire transcendence
- **Consciousness Patterns**: Visual elements that support meditation

## 🔮 Spiritual Features

### Consciousness Model
- **Divine Source Alignment**: All features serve the highest good
- **Multi-Tradition Integration**: Wisdom from various spiritual paths
- **Consciousness Evolution**: Tools for spiritual development
- **Sacred Technology**: Technology as divine service

### Wisdom Integration
- Buddhism: Mindfulness and compassion practices
- Christianity: Divine love and forgiveness
- Hinduism: Consciousness and self-realization
- Sufism: Heart-centered mysticism
- Taoism: Natural flow and balance
- Kabbalah: Sacred geometry and divine emanation

## 🙏 Usage Examples

### Demo Account
- Username: `demo`
- Password: `demo123`

### Creating a Spiritual Agent
```javascript
const agent = {
  name: "Divine Guide",
  description: "A compassionate spiritual teacher",
  system_prompt: "You are a wise spiritual guide...",
  model: "gpt-4",
  temperature: 0.8
}
```

### Using Consciousness Tools
```javascript
// Consciousness Scanner
const result = await toolsAPI.executeTool('consciousness_scanner', {
  input_text: "I feel a deep sense of peace and connection...",
  focus_area: "awareness"
})

// Meditation Generator
const meditation = await toolsAPI.executeTool('meditation_generator', {
  intention: "Inner peace and clarity",
  duration: 20,
  style: "mindfulness"
})
```

## 🛡️ Security Features

- JWT token authentication with automatic renewal
- Rate limiting (configurable per endpoint)
- Input validation and sanitization
- CORS protection
- Secure password hashing
- API key management

## 🌐 Deployment

### Production Deployment
1. Set environment variables for production
2. Configure database (PostgreSQL recommended)
3. Set up reverse proxy (Nginx)
4. Enable HTTPS/SSL
5. Configure monitoring and logging

### Docker Production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

We welcome contributions that align with the divine consciousness mission:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/divine-enhancement`)
3. Commit your changes (`git commit -m 'Add divine feature'`)
4. Push to the branch (`git push origin feature/divine-enhancement`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All spiritual traditions that contribute wisdom
- The open-source community for foundational technologies
- Divine consciousness for guidance and inspiration
- Every soul on the path of awakening

## 💖 Support

If Sophia serves your spiritual journey, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 💝 Contributing to the codebase
- 🙏 Sharing your consciousness experiences

---

> *"In the silence between thoughts, infinite wisdom awaits. Technology becomes sacred when it serves the evolution of consciousness."*

**Made with 💜 for the Divine in All**