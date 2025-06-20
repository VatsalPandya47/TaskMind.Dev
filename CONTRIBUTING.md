# Contributing to TaskMind.Dev 🤝

Thank you for your interest in contributing to TaskMind.Dev! We welcome contributions from developers, designers, and users who want to help improve our AI-powered meeting task extraction platform.

## 🎯 **How to Contribute**

### **Types of Contributions We Welcome**

- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 💻 **Code Contributions**: Submit pull requests for bug fixes or new features
- 📚 **Documentation**: Improve our docs, README, or help guides
- 🎨 **UI/UX Improvements**: Enhance the user interface and experience
- 🧪 **Testing**: Help us test features and report issues
- 🌍 **Localization**: Help translate the app to other languages

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- A Supabase account (for backend features)
- OpenAI API key (for AI features)
- Zoom App credentials (for integration features)

### **Development Setup**

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/TaskMind.Dev.git
   cd TaskMind.Dev
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Database Setup**
   ```bash
   supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 **Development Guidelines**

### **Code Style**
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### **Component Guidelines**
- Use functional components with hooks
- Follow the existing component structure
- Use shadcn/ui components when possible
- Add proper TypeScript types

### **Testing**
- Write tests for new features
- Ensure existing tests pass
- Test on different browsers and devices

## 🔄 **Pull Request Process**

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link any related issues

### **Commit Message Format**
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 🐛 **Reporting Bugs**

### **Before Submitting a Bug Report**
1. Check if the issue has already been reported
2. Try to reproduce the issue with the latest version
3. Check if it's a configuration issue

### **Bug Report Template**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 **Requesting Features**

### **Feature Request Template**
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🏗️ **Project Structure**

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
│   └── migrations/         # Database migrations
└── ai/                     # AI prompts and evaluation
```

## 🤝 **Community Guidelines**

### **Code of Conduct**
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's coding standards

### **Communication**
- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for general questions
- Be clear and concise in your communication
- Use English as the primary language

## 🎉 **Recognition**

Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes
- Community shoutouts

## 📞 **Need Help?**

- **Documentation**: Check our [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/your-org/taskmind-dev/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/taskmind-dev/discussions)
- **Email**: support@taskmind.dev

---

**Thank you for contributing to TaskMind.Dev!** 🚀

Your contributions help make meeting productivity better for everyone. 