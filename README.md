# 🔥 Roast My Website
### Powered by [Exa](https://exa.ai) - The Web Search API

App Link: https://roastmywebsite.exa.ai

![Screenshot](https://roastmywebsite.exa.ai/opengraph-image.jpg)

<br>

## 🎯 What is Roast My Website App?

Roast My Website is a free and open-source web application that uses AI to analyze your website and provide brutally honest feedback.

This app scrapes your website content, analyzes it for strengths and weaknesses, and presents the feedback with roasts, jokes, competitor comparisons, and improvement suggestions.

<br>

## 💻 Tech Stack
- **Search Engine API**: [Exa API](https://exa.ai) - Web search API designed for LLMs
- **Language Model**: [Anthropic Claude Sonnet 4](https://www.anthropic.com/claude) - Latest Claude model for intelligent analysis
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) - For caching analysis results
- **Frontend**: [Next.js 14](https://nextjs.org/docs) with App Router, [TailwindCSS](https://tailwindcss.com), TypeScript
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs/ai-sdk-core) with Anthropic provider

<br>

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Anthropic API key - [Get yours here](https://console.anthropic.com/)
- Exa API key - [Get yours here](https://dashboard.exa.ai/api-keys)
- Firebase project - [Create one here](https://console.firebase.google.com/)

### Installation

1. Clone the repository
```bash
git clone https://github.com/exa-labs/roast-my-website.git
cd roast-my-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EXA_API_KEY=your_exa_api_key_here

# Firebase Configuration (for caching results)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

<br>

## 🔑 Where to Get API Keys

- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com/) - For Claude Sonnet 4 AI analysis
- **Exa API Key**: [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys) - For website content scraping
- **Firebase Config**: [console.firebase.google.com](https://console.firebase.google.com/) - Create a new project and get config from Project Settings

Make sure to create the "website_roasts" collection in firebase database.

<br>

## ⭐ About [Exa](https://exa.ai)

This project is powered by [Exa.ai](https://exa.ai), a web search API designed specifically for AI applications. Exa provides:

- **AI-Optimized Search**: Search results relevant for language model consumption
- **Real-time Web Scraping**: Current website data with content extraction
- **LinkedIn Discovery**: Find company profiles and professional information

[Try Exa API](https://dashboard.exa.ai)

<br>

---

Built with ❤️ by [Exa Labs](https://exa.ai)
