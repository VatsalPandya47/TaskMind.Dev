import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Clock, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';

// Error Boundary Props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

// Enhanced Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentName } = this.props;
    
    // Log error with enhanced logger
    logger.error('Error Boundary caught an error', error, {
      context: 'ErrorBoundary',
      component: componentName || 'Unknown',
    });

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    logger.info('User attempting to retry after error', undefined, {
      context: 'ErrorBoundary',
      component: this.props.componentName || 'Unknown',
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          componentName={this.props.componentName}
        />
      );
    }

    return this.props.children;
  }
}

// Error Fallback Component
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  onRetry: () => void;
  componentName?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  onRetry,
  componentName,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const copyErrorDetails = () => {
    const errorDetails = {
      errorId,
      componentName,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    logger.info('Error details copied to clipboard', { errorId });
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Something went wrong</CardTitle>
          <CardDescription>
            {componentName ? `Error in ${componentName}` : 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Bug className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              {error?.message || 'Unknown error occurred'}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col space-y-2">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-md text-xs font-mono">
                <div><strong>Error ID:</strong> {errorId}</div>
                <div><strong>Component:</strong> {componentName || 'Unknown'}</div>
                <div><strong>Message:</strong> {error?.message}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyErrorDetails}
                className="w-full"
              >
                Copy Error Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Loading Fallback Component
interface LoadingFallbackProps {
  message?: string;
  description?: string;
  type?: 'spinner' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  description,
  type = 'spinner',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  if (type === 'skeleton') {
    return (
      <div className={`flex flex-col space-y-4 p-4 ${sizeClasses[size]}`}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-md ${sizeClasses[size]}`} />
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} p-4`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
      {description && (
        <p className="text-sm text-gray-600 text-center mt-2">{description}</p>
      )}
    </div>
  );
};

// Network Status Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('Network connection restored', undefined, { context: 'NetworkStatus' });
    };

    const handleOffline = () => {
      setIsOnline(false);
      logger.warn('Network connection lost', undefined, { context: 'NetworkStatus' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Offline Fallback Component
export const OfflineFallback: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-900">You're offline</AlertTitle>
      <AlertDescription className="text-orange-800">
        Some features may not be available. Check your internet connection.
      </AlertDescription>
    </Alert>
  );
};

// Retry Fallback Component
interface RetryFallbackProps {
  onRetry: () => void;
  title?: string;
  description?: string;
  retryText?: string;
}

export const RetryFallback: React.FC<RetryFallbackProps> = ({
  onRetry,
  title = 'Unable to load content',
  description = 'Something went wrong while loading this content.',
  retryText = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-sm">{description}</p>
      <Button onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        {retryText}
      </Button>
    </div>
  );
};

// Timeout Fallback Component
interface TimeoutFallbackProps {
  onRetry: () => void;
  timeout?: number;
  autoRetry?: boolean;
}

export const TimeoutFallback: React.FC<TimeoutFallbackProps> = ({
  onRetry,
  timeout = 30000,
  autoRetry = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor(timeout / 1000));

  useEffect(() => {
    if (!autoRetry) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onRetry, autoRetry]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
        <Clock className="w-8 h-8 text-yellow-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Taking longer than expected</h3>
      <p className="text-gray-600 mb-4 max-w-sm">
        This is taking longer than usual. You can wait or try refreshing.
      </p>
      <div className="flex flex-col space-y-2">
        <Button onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Now
        </Button>
        {autoRetry && timeLeft > 0 && (
          <p className="text-sm text-gray-500">
            Auto-refreshing in {timeLeft} seconds...
          </p>
        )}
      </div>
    </div>
  );
};

// High-Order Component for automatic error boundary wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      componentName={Component.displayName || Component.name}
      {...errorBoundaryProps}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Network-aware wrapper component
interface NetworkAwareProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const NetworkAware: React.FC<NetworkAwareProps> = ({ children, fallback }) => {
  const isOnline = useNetworkStatus();

  if (!isOnline && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <OfflineFallback />
      {children}
    </>
  );
}; 