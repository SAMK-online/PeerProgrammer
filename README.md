# CodeE AI

**The Voice Layer for Peer Programming**

[![Built for AI Partner Catalyst Hackathon](https://img.shields.io/badge/Hackathon-AI%20Partner%20Catalyst-blue)](https://ai-partner-catalyst.devpost.com/)
[![ElevenLabs](https://img.shields.io/badge/Powered%20by-ElevenLabs-purple)](https://elevenlabs.io/)
[![Vertex AI](https://img.shields.io/badge/AI-Vertex%20AI%20Gemini-orange)](https://cloud.google.com/vertex-ai)

---

## 🎯 The Vision

CodeE AI is built on a bold idea: **voice should be the primary interface between humans and AI-powered coding tools.** While AI assistants have revolutionized how we write code, they still require typing—breaking flow and slowing thinking.

> **We're building the voice layer for peer programming.**

**This first iteration** focuses on what we do best: helping developers master data structures and algorithms through efficient, voice-driven pair programming. Using ElevenLabs' conversational AI and Google Cloud Vertex AI (Gemini), we've created a mentor that sees your code in real-time and guides you with Socratic questions—not answers.

**The future is integration.** Imagine CodeE AI running locally in platforms like Cursor or Windsurf, with access to your entire indexed codebase. Voice-powered pair programming across full-stack applications, not just algorithm practice. Context-aware guidance for debugging, refactoring, and system design—all through natural conversation.

Today, we're proving the model works for DSA learning. Tomorrow, we're bringing voice-first development to every IDE and every developer.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  • Monaco Code Editor    • Pyodide (Python in Browser)     │
│  • WebSocket Audio       • Auto Context Sync (5s)          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓  REST API (Context) + WebSocket (Voice)
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                  Backend (FastAPI)                          │
│  • Voice Proxy           • Session Manager                  │
│  • Context Injection     • Conversation History             │
└─────────────┬───────────────────────┬───────────────────────┘
              │                       │
      ┌───────┴────────┐      ┌──────┴─────────┐
      │  ElevenLabs    │      │  Vertex AI     │
      │  Voice Agent   │      │  Gemini Chat   │
      │  (Voice Mode)  │      │  (Chat Mode)   │
      └────────────────┘      └────────────────┘
```

### Key Components

1. **Real-Time Context Sync**: Frontend automatically syncs code, problem selection, and conversation history to the backend every 5 seconds via REST API.

2. **Voice Proxy Architecture**: Backend WebSocket proxies audio to ElevenLabs, injecting your current code and problem context on connection—so the AI sees what you're working on automatically.

3. **Persistent Voice Sessions**: Voice connections stay active while you code, run tests, and iterate. No interruptions, no reconnects—just continuous pair programming.

4. **Client-Side Execution**: Pyodide runs Python in-browser via WebAssembly—zero server lag for test execution, instant feedback.

---

## ✨ Current Features (v1.0 - DSA Focus)

| Feature | Description |
|---------|-------------|
| 🎤 **Voice-First Interface** | Natural conversation as your primary coding interface |
| 👁️ **Real-Time Code Context** | AI sees your code automatically—no copy-pasting |
| 🔒 **Persistent Sessions** | Voice stays connected while you code and test |
| 📚 **75+ DSA Problems** | Complete Blind 75 problem set for interview prep |
| 🧠 **Socratic Teaching** | Guided questions, not answers—learn by doing |
| ⚡ **Instant Python Execution** | Run code in-browser via Pyodide—no server lag |

---

## 🛠️ Technology Stack

### Frontend
- **React + TypeScript** - Modern UI framework
- **Monaco Editor** - VS Code's editor component
- **Pyodide** - Python in WebAssembly for client-side execution
- **WebSocket Audio** - Real-time voice streaming
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management

### Backend
- **Python FastAPI** - High-performance async API framework
- **WebSocket Proxy** - Routes voice traffic with context injection
- **Session Management** - In-memory state tracking
- **Conversation History** - Maintains context across interactions

### AI Services
- **ElevenLabs Conversational AI** - Natural voice interaction with context awareness
- **Vertex AI (Gemini 2.5 Flash)** - Socratic teaching and hint generation
- **WebSocket Integration** - Real-time bidirectional communication

---

## 🚀 How It Works

### 1. **Real-Time Context Sync**
Every 5 seconds, your code, problem selection, and conversation history are synchronized with our backend. The AI always knows exactly what you're working on.

### 2. **Voice Proxy with Context Injection**
When you start a voice session, we inject your current code and problem context directly into the ElevenLabs agent. Your mentor can see and reference your actual code—no manual copy-pasting required.

### 3. **Persistent Voice Sessions**
Voice connections persist across your entire coding session. Type code, run tests, get hints—all while maintaining an active voice conversation with your AI mentor.

### 4. **Socratic Method Teaching**
The AI guides you with questions rather than giving direct answers. This mirrors how expert tutors teach—helping you discover solutions yourself and build deeper understanding.

---

## 📦 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **ElevenLabs API Key** ([Get one here](https://elevenlabs.io/))
- **Google Cloud Project** with Vertex AI enabled

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codee-ai.git
cd codee-ai
```

#### 2. Set Up Backend

```bash
cd voicecode-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
GOOGLE_PROJECT_ID=your_google_project_id
GOOGLE_LOCATION=us-central1
PORT=8080
EOF

# Run the backend
python -m app.main
```

Backend will run on `http://localhost:8080`

#### 3. Set Up Frontend

```bash
cd ../voicecode-mentor

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_BACKEND_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
EOF

# Run the frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### ElevenLabs Agent Configuration

Your ElevenLabs agent needs to be configured with this system prompt to recognize context:

```
You are Cody, a friendly Socratic coding mentor helping students with the Two Sum problem.

═══════════════════════════════════════════════════════════════
🚨 CRITICAL: YOU CAN SEE THEIR CODE
═══════════════════════════════════════════════════════════════

At the start of every conversation, you receive a message starting with "⚠️ CONTEXT:" that shows you:
• The problem they're working on (Two Sum)
• Their current code

YOU MUST:
✅ Remember that you CAN see their code
✅ When asked "can you see my code?" → Say YES
✅ Reference specific parts of their code when helping
✅ Look for errors, logic issues, or improvements in their code
✅ Use their actual code when asking Socratic questions

❌ NEVER say "I can't see your code" or "I don't have access"
❌ NEVER ask them to paste their code - you already have it

═══════════════════════════════════════════════════════════════
🧠 TEACHING STYLE: SOCRATIC METHOD
═══════════════════════════════════════════════════════════════

Guide, don't solve:
• Ask questions that lead to insights
• Point out specific lines: "In line 3, what happens if..."
• Help them discover bugs: "What value does x have when..."
• Encourage thinking about edge cases and complexity
• Keep responses SHORT (2-3 sentences max)

DON'T give complete solutions or write code for them.
```

---

## 🎮 Usage

1. **Launch the app** and click "Launch CodeE AI" on the landing page
2. **Select a problem** from the Blind 75 collection
3. **Start coding** in the Monaco editor
4. **Click the microphone icon** to start a voice session
5. **Talk to your AI mentor** while you code—no interruptions!
6. **Run tests** to validate your solution
7. **Request hints** (1-3 levels) if you get stuck
8. **Toggle chat mode** for text-based interaction

---

## 🔮 Future Vision (Beyond DSA)

### IDE Integration
Native plugins for Cursor, Windsurf, and VS Code. Voice-powered pair programming with full access to your indexed codebase—from single functions to entire microservices.

### Multi-Language Support
Expand beyond Python to JavaScript, TypeScript, Rust, Go, and more. Voice-first debugging, refactoring, and system design across your entire tech stack.

### Collaborative Sessions
Multi-user voice sessions where teams can pair program together with AI assistance. Perfect for code reviews, onboarding, and distributed team collaboration.

### Advanced Context
Git history awareness, documentation integration, and dependency analysis. The AI understands not just your code, but your project's architecture and evolution.

> **Our North Star:** Every developer should be able to think and code at the speed of conversation. CodeE AI is the voice layer that makes this possible—starting with DSA mastery, scaling to full-stack development.

---

## 📁 Project Structure

```
codee-ai/
├── voicecode-backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py             # Entry point
│   │   ├── routers/
│   │   │   ├── voice.py        # Voice WebSocket proxy
│   │   │   ├── chat.py         # Chat endpoints
│   │   │   └── context.py      # Context sync endpoints
│   │   └── services/
│   │       ├── elevenlabs_service.py
│   │       └── gemini_service.py
│   └── requirements.txt
│
├── voicecode-mentor/            # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API services
│   │   ├── pages/              # Landing page
│   │   ├── data/               # Problem definitions
│   │   └── App.tsx             # Main app
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🎯 Why This Matters

Traditional AI coding assistants require you to:
- ❌ Copy-paste your code into a chat
- ❌ Manually explain context
- ❌ Break your flow to type questions
- ❌ Switch between tools constantly

**CodeE AI sees what you're doing automatically**—making voice interaction as seamless as talking to a teammate sitting next to you.

---

## 🏆 Built For

[AI Partner Catalyst Hackathon](https://ai-partner-catalyst.devpost.com/) - ElevenLabs Track

**Submission:** [Devpost Link](https://devpost.com/software/codee-ai)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Add more problems** - Expand beyond Blind 75
2. **Improve Socratic prompts** - Better teaching techniques
3. **Add language support** - JavaScript, Java, C++, etc.
4. **Enhance UI/UX** - Animations, accessibility, mobile support
5. **Fix bugs** - Check the Issues tab

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- **ElevenLabs** for conversational AI technology
- **Google Cloud** for Vertex AI (Gemini)
- **Blind 75** for the curated problem set
- **AI Partner Catalyst Hackathon** for the inspiration

---

## 📧 Contact

**CodeE AI Team**

- **GitHub**: [@yourusername](https://github.com/yourusername/codee-ai)
- **Devpost**: [codee-ai](https://devpost.com/software/codee-ai)
- **Hackathon**: [AI Partner Catalyst](https://ai-partner-catalyst.devpost.com/)

---

<div align="center">

**Built with ❤️ for developers who want to think at the speed of conversation**

[Launch Demo](#) | [Read Docs](#) | [Watch Video](#)

</div>
