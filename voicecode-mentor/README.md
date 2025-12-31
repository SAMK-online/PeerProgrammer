# VoiceCode Mentor 🎤

> **Stop Autocompleting. Start Understanding.**

AI that accelerates learning, not replaces it.

---

## 🎯 Overview

**VoiceCode Mentor** is a voice-driven pair programming mentor that teaches Data Structures & Algorithms through Socratic questioning instead of instant solutions. Built for the [Google Cloud AI Partner Catalyst Hackathon](https://googlecloud.devpost.com/) (ElevenLabs Challenge).

### The Problem

Current AI coding tools (Copilot, Cursor, ChatGPT) optimize for **speed over learning**:
- Developers hit Tab without thinking
- Junior engineers can't debug code they didn't write
- Interview performance declining despite AI usage
- Creating "prompt engineers" who can't code fundamentals

### The Solution

A **voice-first mentor** that:
1. Asks clarifying questions before solving
2. Guides through progressive hints (never full solutions upfront)
3. Forces articulation of thinking through speech
4. Teaches patterns, not just answers
5. Mimics real technical interview preparation

---

## ✨ Features

### 🎙️ Voice-First Interface
- Real-time bidirectional conversation with ElevenLabs AI
- Natural turn-taking and low-latency responses
- Hands stay on keyboard while learning

### 🧠 Socratic Teaching Method
- Never provides instant solutions
- Progressive 3-level hint system:
  - **Level 1:** Pattern recognition ("Think about hash maps...")
  - **Level 2:** Approach guidance ("Store values with O(1) lookup...")
  - **Level 3:** Implementation details ("Initialize a hash map, then...")

### 💻 Integrated Code Editor
- Monaco Editor (VS Code engine) with syntax highlighting
- Support for Python, JavaScript, and TypeScript
- Real-time code analysis powered by Google Gemini
- Test case runner with pass/fail feedback

### 📚 Curated Problem Library
7 hand-picked DSA problems covering:
- **Easy:** Two Sum, Valid Parentheses, Merge Sorted Lists
- **Medium:** Container With Most Water, Longest Substring, Product of Array
- **Hard:** Trapping Rain Water

Each problem includes:
- Clear constraints and examples
- Pattern tags (two-pointers, sliding-window, hash-map, etc.)
- 3 levels of contextual hints
- Comprehensive test cases

### 🎨 Clean, Developer-Friendly UI
- Dark mode by default
- 3-panel layout: Problem | Editor | Conversation
- Real-time conversation transcript
- Visual hint level indicators

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- ElevenLabs API key ([Get one here](https://elevenlabs.io))
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/voicecode-mentor.git
cd voicecode-mentor

# Install dependencies
npm install

# Configure API keys
cp .env.example .env
# Edit .env and add your API keys:
# VITE_ELEVENLABS_API_KEY=your_key_here
# VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
# VITE_GEMINI_API_KEY=your_key_here

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### ElevenLabs Setup

1. Create an account at [ElevenLabs](https://elevenlabs.io)
2. Create a new **Conversational AI Agent** in your dashboard
3. Copy your **API Key** and **Agent ID**
4. Add them to your `.env` file

### Google Gemini Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

---

## 🎬 How to Use

1. **Select a Problem:** Click "Browse Problems" to choose from 7 curated DSA challenges
2. **Start Voice Session:** Click the microphone button to begin voice mentoring
3. **Ask Questions:** Speak naturally - "How do I approach this?" or "Give me a hint"
4. **Write Code:** Implement your solution while the AI guides you
5. **Run Tests:** Validate your solution against test cases
6. **Request Hints:** Use voice commands or the hint button when stuck

### Voice Commands

- *"Give me a hint"* - Get next level hint
- *"I'm stuck"* - AI asks clarifying questions
- *"Show me the solution"* - Get complete answer (after struggling!)
- *"Run the code"* - Execute test cases

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS v3 |
| **Voice AI** | [ElevenLabs Conversational AI](https://elevenlabs.io) |
| **Code Analysis** | [Google Gemini API](https://ai.google.dev/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| **State Management** | Zustand |
| **Deployment** | Google Cloud Run (planned) |

---

## 📁 Project Structure

```
voicecode-mentor/
├── src/
│   ├── components/          # React components
│   │   ├── VoiceInterface.tsx       # ElevenLabs integration
│   │   ├── CodeEditor.tsx           # Monaco editor wrapper
│   │   ├── ProblemPanel.tsx         # Problem display
│   │   ├── ConversationTranscript.tsx
│   │   ├── TestResults.tsx
│   │   ├── ProblemSelector.tsx
│   │   └── HintPanel.tsx
│   ├── services/            # API & business logic
│   │   ├── elevenlabs.ts            # Voice service
│   │   ├── vertexai.ts              # Gemini integration
│   │   ├── problemLibrary.ts        # Problem management
│   │   ├── codeAnalyzer.ts          # Code complexity analysis
│   │   ├── hintGenerator.ts         # Progressive hints
│   │   └── testRunner.ts            # Test execution
│   ├── prompts/             # AI system prompts
│   │   ├── mentorSystemPrompt.ts    # Socratic teaching rules
│   │   └── hintTemplates.ts
│   ├── types/               # TypeScript definitions
│   ├── context/             # Global state (Zustand)
│   ├── data/                # Problem definitions (JSON)
│   ├── config/              # Monaco & app config
│   └── App.tsx              # Main application
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── .env.example             # Environment template
└── README.md
```

---

## 🎓 The Pedagogy Behind VoiceCode

### Why Socratic Teaching?

Research shows that **active retrieval** (struggling to recall/solve) creates stronger neural pathways than **passive recognition** (reading answers). VoiceCode implements:

1. **Desirable Difficulty:** Forces effortful thinking
2. **Spaced Hints:** Progressive disclosure prevents overwhelming
3. **Verbalization:** Speaking forces clearer mental models
4. **Pattern Recognition:** Teaches transferable problem-solving skills

### Why Voice?

- **Prevents Tab-Spam:** Can't hit Accept 50 times per minute
- **Mimics Real Interviews:** Natural conversation flow
- **Accessibility:** Helps dyslexic/visually impaired developers
- **Workflow Efficiency:** Hands stay on keyboard

---

## 🗺️ Roadmap

### Phase 2: IDE Integration
- [ ] Cursor plugin architecture
- [ ] VS Code extension
- [ ] Context-aware mentoring during real development

### Phase 3: Expanded Curriculum
- [ ] System design practice
- [ ] Code review coaching
- [ ] Debugging assistance
- [ ] Architecture discussions

### Phase 4: Enterprise & Education
- [ ] Company onboarding programs
- [ ] Bootcamp partnerships
- [ ] University CS course integration
- [ ] Corporate training packages

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ElevenLabs** for the incredible Conversational AI SDK
- **Google Cloud** for Gemini API access
- **Microsoft** for Monaco Editor
- **LeetCode/NeetCode** for problem inspiration
- All the developers who believe learning fundamentals still matters

---

## 📞 Contact

**Built for:** [Google Cloud AI Partner Catalyst Hackathon](https://googlecloud.devpost.com/)  
**Category:** ElevenLabs Challenge  
**Deadline:** December 31, 2025

---

## 🌟 Star Us!

If VoiceCode Mentor helped you learn something new, please give us a star ⭐️

**Remember:** The best AI doesn't replace your thinking—it amplifies it.

---

*Made with 💙 by developers who still believe in understanding, not just autocompleting.*
