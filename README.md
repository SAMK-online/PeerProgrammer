# CodeE AI

**The Voice Layer for Peer Programming**

[![Built for AI Partner Catalyst Hackathon](https://img.shields.io/badge/Hackathon-AI%20Partner%20Catalyst-blue)](https://ai-partner-catalyst.devpost.com/)
[![ElevenLabs](https://img.shields.io/badge/Powered%20by-ElevenLabs-purple)](https://elevenlabs.io/)
[![Vertex AI](https://img.shields.io/badge/AI-Vertex%20AI%20Gemini-orange)](https://cloud.google.com/vertex-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 The Problem

Remember your first pair programming session? Someone sat next to you, watched you code, asked *"What if the array is empty?"*, caught bugs before you ran the code, and helped you think through problems out loud. **That's how developers actually learn.**

But AI assistants today? You have to:
- ❌ Stop coding and type your question
- ❌ Copy-paste your code into a chat
- ❌ Manually explain context
- ❌ Break your flow constantly

**That's not pair programming—that's technical support.**

---

## 💡 The Solution

> **CodeE AI brings back the natural flow of peer programming—through voice.**

It's a voice layer that sits alongside your editor, sees your code automatically, and lets you talk through problems like you would with a teammate. It asks Socratic questions, catches edge cases in real-time, and guides you through debugging—all through natural conversation.

**No typing. No copy-pasting. Just thinking out loud while you code.**

---

## ✨ How It Works

### 1. **Real-Time Code Context**
Your AI mentor sees your code automatically every 5 seconds. No manual sharing, no explaining context—it just knows what you're working on.

### 2. **Voice-First Interface**
Click the microphone and start talking. Ask questions, think out loud, debug problems—all while your hands stay on the keyboard.

### 3. **Persistent Voice Sessions**
Voice connections stay active while you code, run tests, and iterate. No interruptions, no reconnects—just continuous pair programming.

### 4. **Socratic Teaching**
The AI guides you with questions rather than giving direct answers. This mirrors how expert tutors teach—helping you discover solutions yourself and build deeper understanding.

### 5. **Instant Execution**
Run your Python code instantly in-browser with zero server lag. Get immediate feedback as you iterate.

---

## 🎯 Current Features (v1.0 - DSA Focus)

| Feature | Description |
|---------|-------------|
| 🎤 **Voice-First Interface** | Natural conversation as your primary coding interface |
| 👁️ **Real-Time Code Context** | AI sees your code automatically—no copy-pasting |
| 🔒 **Persistent Sessions** | Voice stays connected while you code and test |
| 📚 **75+ DSA Problems** | Complete Blind 75 problem set for interview prep |
| 🧠 **Socratic Teaching** | Guided questions, not answers—learn by doing |
| ⚡ **Instant Python Execution** | Run code in-browser via Pyodide—no server lag |

---

## 🎮 Experience CodeE AI

1. **Launch the app** and select a problem from the Blind 75 collection
2. **Click the microphone icon** to start a voice session
3. **Start coding** in the Monaco editor
4. **Talk to your AI mentor** while you code—no interruptions!
   - *"How should I approach this?"*
   - *"Can you see an issue with my code?"*
   - *"What's the time complexity of this approach?"*
5. **Run tests** to validate your solution
6. **Request progressive hints** (1-3 levels) if you get stuck
7. **Toggle chat mode** for text-based interaction when needed

---

## 🏗️ Technology

### Powered By
- **ElevenLabs Conversational AI** - Natural, context-aware voice interaction
- **Google Cloud Vertex AI (Gemini 2.5 Flash)** - Intelligent Socratic teaching and code analysis
- **Monaco Editor** - VS Code's editor component for a familiar coding experience
- **Pyodide** - Python execution in WebAssembly for instant feedback

### Architecture Highlights
- **WebSocket Voice Streaming** - Low-latency bidirectional audio
- **Automatic Context Injection** - Your code is synced to the AI without manual effort
- **Client-Side Execution** - Zero server lag for running tests
- **Session Persistence** - Voice stays connected across your entire coding session

---

## 🔮 The Future Vision

**This first iteration** focuses on mastering data structures and algorithms through voice-driven pair programming. But the vision is much bigger:

### IDE Integration
Native plugins for **Cursor**, **Windsurf**, and **VS Code**. Voice-powered pair programming with full access to your indexed codebase—from single functions to entire microservices.

### Multi-Language Support
Expand beyond Python to JavaScript, TypeScript, Rust, Go, and more. Voice-first debugging, refactoring, and system design across your entire tech stack.

### Collaborative Sessions
Multi-user voice sessions where teams can pair program together with AI assistance. Perfect for code reviews, onboarding, and distributed team collaboration.

### Advanced Context Awareness
Git history awareness, documentation integration, and dependency analysis. The AI understands not just your code, but your project's architecture and evolution.

> **Our North Star:** Every developer should be able to think and code at the speed of conversation. CodeE AI is the voice layer that makes this possible—starting with DSA mastery, scaling to full-stack development.

---

## 🎯 Why Voice Matters

### Voice Forces Deliberate Thinking
When you speak, you articulate your thoughts more clearly than when you type. This leads to better problem-solving and deeper understanding.

### Voice Maintains Flow
Your hands stay on the keyboard while you ask questions and discuss solutions. No context-switching, no breaking concentration.

### Voice Mimics Human Mentorship
The best learning happens through conversation. Voice makes AI mentorship feel natural and collaborative—like having a senior developer beside you.

### Voice Improves Accessibility
Helps developers with dyslexia, visual impairments, or those who simply think better by talking through problems.

---

## 🏆 Built For

[AI Partner Catalyst Hackathon](https://ai-partner-catalyst.devpost.com/) - ElevenLabs Track

**Submission:** [Devpost Link](https://devpost.com/software/codee-ai)

---

## 📄 Open Source License

CodeE AI is released under the **MIT License** - an [OSI-approved](https://opensource.org/licenses/MIT) open source license.

### What This Means

✅ **Commercial use** - Use it in commercial projects  
✅ **Modification** - Modify the code to fit your needs  
✅ **Distribution** - Share it with others  
✅ **Private use** - Use it privately for any purpose  
✅ **Patent use** - Grants rights to patents from contributors  

**Requirements:**
- Include the original license and copyright notice when distributing

The MIT License is one of the most permissive and widely-used open source licenses, approved by the [Open Source Initiative (OSI)](https://opensource.org/).

See [LICENSE](LICENSE) for full details.

---

## 🤝 Get Involved

We're building the future of voice-first development, and we'd love your help:

### For Developers
- **Contribute code** - Check our [GitHub Issues](https://github.com/SAMK-online/PeerProgrammer/issues)
- **Add features** - IDE integrations, language support, new teaching modes
- **Improve UX** - Better voice interactions, accessibility features

### For Educators
- **Add problems** - Expand our DSA problem library
- **Refine prompts** - Improve Socratic teaching techniques
- **Share insights** - Tell us what works for learning

### For Users
- **Provide feedback** - Tell us what you love and what needs work
- **Share your experience** - Blog posts, tweets, demos
- **Spread the word** - Help other developers discover voice-first coding

---

## 🙏 Acknowledgments

- **[ElevenLabs](https://elevenlabs.io/)** for pioneering conversational AI technology
- **[Google Cloud](https://cloud.google.com/vertex-ai)** for Vertex AI (Gemini)
- **[Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU)** for the curated problem set
- **[AI Partner Catalyst Hackathon](https://ai-partner-catalyst.devpost.com/)** for the inspiration and platform

---

## 📧 Connect With Us

**CodeE AI Team**

- **GitHub**: [SAMK-online/PeerProgrammer](https://github.com/SAMK-online/PeerProgrammer)
- **Devpost**: [CodeE AI](https://devpost.com/software/codee-ai)
- **Hackathon**: [AI Partner Catalyst](https://ai-partner-catalyst.devpost.com/)

---

<div align="center">

**Built with ❤️ for developers who want to think at the speed of conversation**

*Stop typing. Start talking. Experience peer programming reimagined.*

</div>
