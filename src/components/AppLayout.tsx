import { ReactNode, useState } from "react";
import Navigation from "./Navigation";
import { Button } from "./ui/button";
import { Brain, X, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [showAIHelper, setShowAIHelper] = useState(false);

  const aiTips = [
    "Connect your Zoom account to automatically extract tasks from meetings",
    "Use priority levels to focus on what matters most",
    "Set due dates to get smart reminders about upcoming deadlines",
    "Search your memory to quickly find past decisions and discussions",
    "Review AI summaries to stay on top of important conversations"
  ];

  const randomTip = aiTips[Math.floor(Math.random() * aiTips.length)];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <main className="flex-1 overflow-auto relative min-w-0">
        <div className="main-container h-full overflow-safe">
        {children}
        </div>
        
        {/* Floating AI Assistant */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowAIHelper(!showAIHelper)}
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Brain className="h-6 w-6" />
          </Button>
          
          {showAIHelper && (
            <Card className="absolute bottom-16 right-0 w-80 bg-card/95 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">Quick Tips</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIHelper(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {aiTips[Math.floor(Math.random() * aiTips.length)]}
                </p>
                <Button
                  onClick={() => setShowAIHelper(false)}
                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                  variant="outline"
                >
                  Got it
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppLayout; 