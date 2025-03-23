# 🎓 GradeAid

GradeAid is an AI-powered multimodal learning application designed specifically for neurodivergent children. The app adapts to individual learning styles and preferences, making education more accessible, engaging, and effective.

## ✨ Features

- **Personalized Onboarding**: Profile setup with name, learning style preferences, and UI theme selection
- **Multiple Learning Modalities**:
  - 🖼️ **Image-to-Learning**: Convert any image into educational content
  - 🎬 **Video Learning**: Extract and simplify concepts from YouTube videos
  - 🧮 **Real-Life Math Practice**: Apply math to everyday situations
  - 📚 **Structured Learning Paths**: Personalized learning journeys
- **Fun Zone**: Educational games and interactive activities
- **Multilingual Support**: Available in English and Danish
- **Adaptive UI**: Customizable interface with high-contrast themes
- **Progress Tracking**: Monitor learning achievements and milestones
- **Badge System**: Gamified rewards for completed activities

## 🚀 Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **AI Integration**: OpenAI APIs (GPT-4, DALL-E, Whisper)
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/   # Reusable UI components
├── contexts/     # React context providers
├── hooks/        # Custom React hooks
├── lib/          # Utility libraries and configurations
├── locales/      # Internationalization files (en, da)
├── pages/        # Main application pages/screens
├── services/     # API and service integrations
│   ├── imageAnalysisService.ts    # Image processing with AI
│   ├── realLifeActivityService.ts # Real-world scenarios
│   ├── structuredLearningService.ts # Learning content generation
│   └── youtubeService.ts          # Video content extraction
├── types/        # TypeScript type definitions
└── utils/        # Helper functions
```

## 🔧 Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ciocaion/gradeaid-mvp.git
   cd gradeaid-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory with:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080` (or another port if 8080 is in use).

## 🤖 AI Integration

GradeAid leverages OpenAI's APIs to deliver personalized educational content:

- **GPT-4**: Powers the core learning content generation, creates personalized explanations, and adapts content difficulty based on user preferences
- **DALL-E**: Generates visual aids and illustrations for complex concepts
- **Whisper**: Transcribes spoken input for accessibility features

The AI integration is handled through service modules that format prompts based on the user's learning style, difficulty preference, and language selection. All prompts include specialized instructions for supporting neurodivergent learning needs.

## 🛣️ Adaptive Learning Path

GradeAid creates personalized learning experiences by:

1. **Initial Assessment**: Gathering preferences during onboarding
2. **Learning Style Adaptation**: Visual, auditory, reading/writing, or kinesthetic approaches
3. **Difficulty Scaling**: Automatically adjusting complexity based on user interaction
4. **Multiple Modalities**: Presenting the same concept through different learning approaches
5. **Reward System**: Providing positive reinforcement through badges and achievements

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## 🔮 Future Roadmap

- **Enhanced AI Agent**: More proactive learning assistant capabilities
- **Teacher Dashboard**: Tools for educators to monitor progress and customize content
- **Expanded Multilingual Support**: Additional language options
- **Offline Mode**: Core functionality without internet connection
- **Parent Portal**: Progress monitoring and customization options for parents
- **Integration with School Curricula**: Alignment with educational standards
- **Advanced Analytics**: Deeper insights into learning patterns and progress

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for making education accessible to all learners.
