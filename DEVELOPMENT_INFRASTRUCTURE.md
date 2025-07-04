# Development Infrastructure Guide

This document provides a comprehensive overview of the development infrastructure set up for TaskMind, including testing, CI/CD, logging, backup systems, and fallback UI components.

## 📋 Overview

The TaskMind development infrastructure includes:
- ✅ **Unit Testing**: Comprehensive tests for `useTasks` and `useMemory` hooks
- 🔄 **CI/CD Pipeline**: Automated testing, building, and deployment with GitHub Actions
- 📊 **Enhanced Logging**: Structured logging with context tracking and performance monitoring
- 💾 **Database Backup**: Automated Supabase backup system with scheduled runs
- 🛡️ **Fallback UI**: Error boundaries, loading states, and offline support

---

## 🧪 Unit Testing Infrastructure

### Current Status: ✅ COMPLETE
All tests are passing with 100% success rate:
- **useTasks Hook**: 11 tests covering CRUD operations, authentication, Slack integration
- **useMemory Hook**: 19 tests covering search, retry logic, embeddings, and statistics
- **Total**: 30 tests passing

### Test Configuration
- **Framework**: Vitest with React Testing Library
- **Setup**: Comprehensive mocking for Supabase, toast notifications, and Slack service
- **Coverage**: Full hook functionality including error handling and loading states

### Running Tests
```bash
# Run all tests
npm test

# Run specific hook tests
npm run test:hooks

# Run tests with coverage
npm run test:coverage

# Interactive test UI
npm run test:ui

# Single test run
npm run test:run
```

### Test Structure
```
src/hooks/__tests__/
├── useTasks.test.ts      # 11 comprehensive tests
├── useMemory.test.ts     # 19 comprehensive tests
└── README.md             # Test documentation
```

---

## 🔄 CI/CD Pipeline

### Current Status: ✅ COMPLETE
Comprehensive GitHub Actions workflow with 8 parallel jobs:

### Pipeline Jobs
1. **🧪 Test & Quality Check**: Multi-node testing (Node 18, 20) with ESLint
2. **🏗️ Build Application**: Production build with artifact upload
3. **🔒 Security Audit**: npm audit and Snyk security scanning
4. **💾 Database Backup**: Automated backup on production deployments
5. **🚀 Deploy to Staging**: Deploy develop branch to staging environment
6. **🌟 Deploy to Production**: Deploy main branch with Slack notifications
7. **⚡ Performance Testing**: Lighthouse CI for performance monitoring
8. **🧹 Cleanup**: Artifact cleanup and housekeeping

### Workflow Features
- **Parallel Execution**: Jobs run simultaneously for faster builds
- **Environment-specific Deployments**: Staging vs Production
- **Automatic Backups**: Database backup before production deploys
- **Security Scanning**: Continuous vulnerability assessment
- **Performance Monitoring**: Lighthouse CI integration
- **Slack Integration**: Deployment notifications

### Required GitHub Secrets
```bash
# Supabase Configuration
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PROJECT_ID

# Deployment
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Monitoring & Notifications
SLACK_WEBHOOK_URL
SNYK_TOKEN
LHCI_GITHUB_APP_TOKEN
```

### Pipeline Configuration
```yaml
# Triggers
- Push to main/develop branches
- Pull requests to main
- Manual workflow dispatch

# Matrix Testing
- Node.js versions: 18, 20
- Operating system: ubuntu-latest
```

---

## 📊 Enhanced Logging System

### Current Status: ✅ COMPLETE
Structured logging system with context tracking and performance monitoring.

### Features
- **Multiple Log Levels**: debug, info, warn, error, success
- **Context Tracking**: Session ID, user ID, component tracking
- **Performance Monitoring**: Built-in timer utilities
- **Persistent Storage**: Local storage integration for debugging
- **Remote Logging**: Optional remote endpoint support
- **Hook-specific Loggers**: Context-aware logging for React hooks

### Usage Examples
```typescript
import { logger } from '@/lib/logger';

// Basic logging
logger.info('User logged in', { userId: '123' });
logger.error('API call failed', error, { component: 'useTasks' });

// Hook-specific logging
const hookLogger = logger.createHookLogger('useTasks');
hookLogger.success('Task created successfully', { taskId: 'task_123' });

// Performance tracking
const stopTimer = logger.startTimer('API Call');
// ... perform operation
stopTimer(); // Logs duration automatically

// Async operation with automatic logging
const result = await logger.withLogging(
  () => apiCall(),
  { name: 'Create Task', component: 'useTasks' }
);
```

### Configuration
```typescript
// Environment-based configuration
const logger = new EnhancedLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  enablePerformance: true,
  persistToLocalStorage: true,
});
```

### Log Analysis Tools
- `logger.getRecentLogs(50)`: Get recent log entries
- `logger.exportLogs()`: Export logs for analysis
- `logger.getLogStats()`: Get logging statistics
- `logger.clearLogs()`: Clear log buffer

---

## 💾 Database Backup System

### Current Status: ✅ COMPLETE
Automated Supabase backup with comprehensive error handling and manifest generation.

### Features
- **Schema Backup**: Full database schema using Supabase CLI
- **Data Backup**: All table data exported as JSON
- **Manifest Generation**: Detailed backup metadata and statistics
- **Error Handling**: Graceful handling of failed table backups
- **Retry Logic**: Built-in retry for transient failures
- **Timestamped Storage**: Organized backup directory structure

### Running Backups
```bash
# Manual backup
npm run backup:db

# Scheduled backup (with different configuration)
npm run backup:scheduled

# Direct execution
node scripts/supabase-backup.js
```

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=your_project_id
```

### Backup Structure
```
backups/
└── 2024-01-15T10-30-00/
    ├── manifest.json         # Backup metadata
    ├── schema.sql           # Database schema
    ├── tasks.json           # Table data
    ├── meetings.json        # Table data
    ├── summaries.json       # Table data
    ├── memory_embeddings.json
    ├── memory_search_logs.json
    ├── user_summaries.json
    └── zoom_meetings.json
```

### Backup Configuration
```javascript
// Tables included in backup
const TABLES_TO_BACKUP = [
  'tasks',
  'meetings',
  'summaries', 
  'memory_embeddings',
  'memory_search_logs',
  'user_summaries',
  'zoom_meetings'
];
```

### Manifest Example
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "backup_path": "./backups/2024-01-15T10-30-00",
  "supabase_project_id": "jsxupnogyvfynjgkwdyj",
  "schema": {
    "path": "./backups/2024-01-15T10-30-00/schema.sql",
    "size": 15420
  },
  "summary": {
    "total_tables": 7,
    "successful_tables": 7,
    "failed_tables": 0,
    "total_records": 1247
  }
}
```

---

## 🛡️ Fallback UI System

### Current Status: ✅ COMPLETE
Comprehensive error handling and fallback UI components for better user experience.

### Components Overview

#### 1. Error Boundary
```typescript
import { ErrorBoundary, withErrorBoundary } from '@/components/ui/fallback-ui';

// Wrap components with error boundary
<ErrorBoundary componentName="TaskList">
  <TaskList />
</ErrorBoundary>

// HOC wrapper
const SafeTaskList = withErrorBoundary(TaskList);
```

#### 2. Loading States
```typescript
import { LoadingFallback } from '@/components/ui/fallback-ui';

<LoadingFallback 
  message="Loading tasks..."
  type="skeleton"
  size="md"
/>
```

#### 3. Network Awareness
```typescript
import { NetworkAware, useNetworkStatus } from '@/components/ui/fallback-ui';

const isOnline = useNetworkStatus();

<NetworkAware fallback={<OfflineMessage />}>
  <OnlineContent />
</NetworkAware>
```

#### 4. Retry Mechanisms
```typescript
import { RetryFallback, TimeoutFallback } from '@/components/ui/fallback-ui';

<RetryFallback 
  onRetry={handleRetry}
  title="Failed to load"
  description="Unable to fetch tasks"
/>

<TimeoutFallback 
  onRetry={handleRetry}
  autoRetry={true}
  timeout={30000}
/>
```

### Features
- **Error Boundaries**: Catch React component errors with detailed reporting
- **Loading States**: Skeleton, spinner, and pulse loading indicators
- **Network Status**: Online/offline detection with automatic reconnection
- **Retry Logic**: Smart retry mechanisms with exponential backoff
- **Error Reporting**: Clipboard copy for error details and debugging
- **Accessibility**: ARIA labels and keyboard navigation support

### Integration Examples
```typescript
// Hook with error boundary
const SafeUseTasks = withErrorBoundary(useTasks, {
  componentName: 'TasksHook',
  onError: (error, errorInfo) => {
    logger.error('Hook error caught', error, { 
      component: 'useTasks',
      errorInfo 
    });
  }
});

// Component with multiple fallbacks
<ErrorBoundary componentName="TaskDashboard">
  <NetworkAware>
    <React.Suspense fallback={<LoadingFallback type="skeleton" />}>
      <TaskDashboard />
    </React.Suspense>
  </NetworkAware>
</ErrorBoundary>
```

---

## 🚀 Getting Started

### 1. Prerequisites
```bash
# Required tools
- Node.js 18+
- npm or yarn
- Supabase CLI
- Git
```

### 2. Environment Setup
```bash
# Copy environment variables
cp .env.example .env.local

# Install dependencies
npm install

# Run tests to verify setup
npm run test:hooks
```

### 3. Development Workflow
```bash
# Start development server
npm run dev

# Run tests in watch mode
npm test

# View test UI
npm run test:ui

# Backup database
npm run backup:db

# Lint code
npm run lint
```

### 4. CI/CD Setup
1. Configure GitHub secrets (see CI/CD section)
2. Create staging and production environments
3. Set up Slack webhook for notifications
4. Configure Vercel for deployments

---

## 📈 Monitoring & Maintenance

### Daily Tasks
- [ ] Check CI/CD pipeline status
- [ ] Review error logs and metrics
- [ ] Monitor test coverage reports
- [ ] Verify backup completion

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Check security audit results
- [ ] Clean up old backup files

### Monthly Tasks
- [ ] Review and update documentation
- [ ] Analyze logging patterns
- [ ] Optimize CI/CD pipeline
- [ ] Security audit review

---

## 🔧 Troubleshooting

### Common Issues

#### Tests Failing
```bash
# Clear test cache
npm run test -- --clearCache

# Check mock configurations
# Verify environment variables
# Review test setup files
```

#### CI/CD Pipeline Issues
```bash
# Check GitHub secrets
# Verify workflow permissions
# Review environment configurations
# Check Supabase connectivity
```

#### Backup Failures
```bash
# Verify environment variables
# Check Supabase CLI installation
# Review service role permissions
# Check disk space
```

#### Logging Issues
```bash
# Check browser console
# Verify localStorage permissions
# Review logger configuration
# Check remote endpoint connectivity
```

---

## 📝 Contributing

### Adding New Tests
1. Create test file in `src/hooks/__tests__/`
2. Follow existing test patterns
3. Mock external dependencies
4. Include error cases and edge scenarios
5. Update test documentation

### Extending CI/CD
1. Add new job in `.github/workflows/ci-cd.yml`
2. Configure job dependencies
3. Add required secrets
4. Test in staging environment
5. Update documentation

### Enhancing Logging
1. Extend logger class in `src/lib/logger.ts`
2. Add new log levels or methods
3. Update type definitions
4. Add tests for new functionality
5. Update usage examples

---

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Performance Monitoring with Lighthouse](https://web.dev/lighthouse-ci/)

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: TaskMind Development Team 