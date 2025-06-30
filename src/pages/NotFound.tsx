import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Check if user is looking for public content
  const isPublicContent = 
    path.includes('/documentation') ||
    path.includes('/how-it-works') ||
    path.includes('/use-cases') ||
    path.includes('/help') ||
    path.includes('/careers') ||
    path.includes('/manifesto') ||
    path.includes('/about') ||
    path.includes('/blog') ||
    path.includes('/pricing');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">404</h1>
        <p className="text-2xl text-gray-300 mb-4">Page Not Found</p>
        
        {isPublicContent ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-400 mb-8">
              Looking for information about TaskMind? Visit our main website!
            </p>
            <div className="space-y-4">
              <a 
                href="https://taskmind.dev" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg"
              >
                Visit TaskMind.dev
              </a>
              <br />
              <a href="/dashboard" className="text-blue-400 hover:text-blue-300 underline text-lg font-medium transition-colors">
                Or go to your Dashboard
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-gray-400 mb-8">
              This page doesn't exist in the TaskMind app.
            </p>
            <div className="space-y-4">
              <a href="/dashboard" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg">
                Go to Dashboard
              </a>
              <br />
              <a 
                href="https://taskmind.dev" 
                className="text-blue-400 hover:text-blue-300 underline text-lg font-medium transition-colors"
              >
                Visit TaskMind.dev
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
