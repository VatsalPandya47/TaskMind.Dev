import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-2xl text-gray-600 mb-4">Oops! This page seems to have wandered off 🚶‍♂️</p>
        <p className="text-lg text-gray-500 mb-8">Don't worry, we'll help you find your way back!</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline text-lg font-medium">
          Take me back home 🏠
        </a>
      </div>
    </div>
  );
};

export default NotFound;
