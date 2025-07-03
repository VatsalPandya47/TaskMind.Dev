// components/PageShell.tsx
import React from "react";

export default function ThemeGradientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-blue-400 to-gray-200 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-800/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-800/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-800/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-20 space-y-8">
        {children}
      </div>
    </div>
  );
}
