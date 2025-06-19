# TaskMind.Dev 🤖

**AI-Powered Meeting Task Extraction & Management Platform**

TaskMind.Dev transforms your meeting conversations into actionable tasks automatically. Connect your Zoom meetings, let our AI extract action items, and never miss a follow-up again.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Features

### 🎯 **Smart Task Extraction**
- **AI-Powered Analysis**: Advanced GPT-4 integration extracts actionable tasks from meeting transcripts
- **Automatic Assignment**: Intelligently identifies task owners and due dates from conversation context
- **Priority Detection**: AI determines task urgency based on meeting context and language

### 🔗 **Seamless Zoom Integration**
- **One-Click Connection**: Connect your Zoom account with OAuth 2.0
- **Automatic Sync**: Fetch and sync your recent Zoom meetings with recordings
- **Transcript Processing**: Extract and process meeting transcripts automatically
- **Real-time Updates**: Live status updates during processing

### 📊 **Comprehensive Dashboard**
- **Meeting Management**: View, organize, and manage all your meetings
- **Task Tracking**: Monitor task completion, assignments, and deadlines
- **Analytics**: Track productivity metrics and meeting insights
- **Search & Filter**: Find specific meetings or tasks quickly

### 🔒 **Enterprise-Grade Security**
- **Row-Level Security**: Supabase RLS ensures data isolation
- **OAuth Integration**: Secure Zoom authentication
- **Privacy First**: User controls over data processing and deletion
- **GDPR Compliant**: Full data portability and deletion rights

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend & Infrastructure
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security
  - Edge functions
- **OpenAI GPT-4** - AI task extraction
- **Zoom API** - Meeting integration

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Capacitor** - Mobile app support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Zoom App credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TaskMind.Dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_ZOOM_CLIENT_ID=your_zoom_client_id
   ```

4. **Database Setup**
   ```bash
   # Run Supabase migrations
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### 1. **Connect Zoom Account**
- Click "Connect Zoom" in the Meetings tab
- Authorize TaskMind.Dev in Zoom
- Grant necessary permissions for meeting access

### 2. **Sync Meetings**
- Click "Sync Meetings" to fetch recent Zoom recordings
- View your meeting list with recording status
- Meetings with transcripts are marked for processing

### 3. **Extract Tasks**
- Click "Extract & Create Tasks" on any meeting with recordings
- AI processes the transcript and identifies action items
- Review and edit extracted tasks as needed

### 4. **Manage Tasks**
- View all extracted tasks in the Tasks tab
- Assign priorities, due dates, and owners
- Mark tasks as complete and track progress

## 🏗️ Project Structure

```
TaskMind.Dev/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── TasksTab.tsx    # Task management
│   │   ├── MeetingsTab.tsx # Meeting management
│   │   └── ZoomIntegration.tsx # Zoom integration
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── integrations/       # External service integrations
│   └── lib/                # Utility functions
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── extract-zoom-transcript/
│   │   ├── process-transcript/
│   │   └── sync-zoom-meetings/
│   └── migrations/         # Database migrations
└── ai/                     # AI prompts and evaluation
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Configure OAuth providers
4. Set up edge functions

### Zoom App Configuration
1. Create a Zoom App in the Marketplace
2. Configure OAuth scopes:
   - `meeting:read`
   - `recording:read`
3. Set redirect URLs

### OpenAI Configuration
1. Obtain API key from OpenAI
2. Configure rate limiting
3. Set up monitoring for API usage

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.taskmind.dev](https://docs.taskmind.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/taskmind-dev/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/taskmind-dev/discussions)
- **Email**: support@taskmind.dev

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [Zoom](https://zoom.us/) for meeting integration

---

**Made with ❤️ by the TaskMind.Dev Team**

*Transform your meetings into actionable insights with AI-powered task extraction.*