# 🌾 KisanMitra Platform

A comprehensive AI-powered agricultural chatbot platform designed specifically for Indian farmers. Built with Next.js, TypeScript, and advanced AI models to provide real-time farming advice, market intelligence, and agricultural guidance.

## ✨ Features

### 🤖 AI Agricultural Assistant

- **Multi-language Support**: English, Marathi, Hindi, and more Indian languages
- **Expert Farming Advice**: Crop management, pest control, soil health, and sustainable practices
- **Real-time Market Intelligence**: Current crop prices, market trends, and trading advice
- **Government Scheme Information**: Subsidies, loans, insurance, and agricultural policies
- **Weather & Climate Guidance**: Seasonal planning and climate-smart farming strategies

### 🚀 Technical Features

- **Modern UI/UX**: Beautiful, responsive interface built with Tailwind CSS
- **Real-time Chat**: Interactive chat interface with quick suggestion buttons
- **Language Switching**: Seamless language switching for better accessibility
- **Mobile Optimized**: Works perfectly on all devices
- **Fast & Responsive**: Built with Next.js 15 for optimal performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **AI Models**: Groq (Llama 3.3 70B), Perplexity Sonar Pro
- **Language Support**: Internationalization (i18n)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd KisanMitra-platform
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # AI Model API Keys
   GROQ_API_KEY=your_groq_api_key_here
   PPLX_API_KEY=your_perplexity_api_key_here

   # Optional: Database and other services
   DATABASE_URL=your_database_url
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/Login and create an API key
3. Add it to your `.env.local` file

### Perplexity API Key (Optional)

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Get your API key from the console
3. Add it to your `.env.local` file

## 🌍 Language Support

The platform currently supports:

- **English** (en) - Default language
- **Marathi** (mr) - महाराष्ट्रातील शेतकऱ्यांसाठी
- **Hindi** (hi) - भारतीय किसानों के लिए
- **Bengali** (bn) - ভারতীয় কৃষকদের জন্য
- **Telugu** (te) - భారతీయ రైతుల కోసం
- **Tamil** (ta) - இந்திய விவசாயிகளுக்கான
- **Gujarati** (gu) - ભારતીય ખેડૂતો માટે
- **Kannada** (kn) - ಭಾರತೀಯ ರೈತರಿಗೆ

## 🎯 Use Cases

### For Farmers

- **Crop Planning**: Get advice on what to plant and when
- **Market Intelligence**: Real-time prices and market trends
- **Problem Solving**: Pest control, disease management, soil issues
- **Government Support**: Information about schemes and subsidies
- **Best Practices**: Modern farming techniques and innovations

### For Agricultural Extension Workers

- **Quick Reference**: Fast access to agricultural information
- **Multi-language Support**: Help farmers in their preferred language
- **Updated Information**: Latest agricultural research and practices

## 🏗️ Project Structure

```
KisanMitra-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── chat/              # Chat interface page
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── language-selector.tsx
│   └── theme-provider.tsx
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── styles/                 # Global styles
```

## 🔧 Configuration

### Customizing AI Responses

Edit the system prompts in `app/api/chat/route.ts` to customize:

- Response style and tone
- Specific agricultural focus areas
- Language-specific instructions

### Adding New Languages

1. Add language code to the system prompts
2. Update the language selector component
3. Add translations to the language files

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:

- Code style and standards
- Testing requirements
- Pull request process
- Community guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Agricultural Research Institute (IARI)** for agricultural expertise
- **Krishi Vigyan Kendras** for extension service knowledge
- **Agricultural Universities** across India for research insights
- **Open Source Community** for amazing tools and libraries

---

**Made with ❤️ for Indian Farmers**

_Empowering farmers with AI-driven agricultural intelligence_
