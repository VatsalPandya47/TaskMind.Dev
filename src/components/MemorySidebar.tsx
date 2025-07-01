import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Search, 
  Clock, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Loader2,
  Sparkles,
  X,
  ChevronRight,
  Zap,
  TrendingUp,
  History,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { useMemory, MemoryResult } from "@/hooks/useMemory";
import { formatDistanceToNow } from "date-fns";

interface MemorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MemorySidebar = ({ isOpen, onClose }: MemorySidebarProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  
  const { searchMemory } = useMemory();

  // Load recent queries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taskmind-recent-queries');
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent queries:', error);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      await searchMemory.mutateAsync({
        query: query.trim(),
        threshold: 0.7,
        limit: 5
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleQuickQuery = (quickQuery: string) => {
    setQuery(quickQuery);
    // Auto-search after a short delay
    setTimeout(() => {
      searchMemory.mutateAsync({
        query: quickQuery,
        threshold: 0.7,
        limit: 5
      });
    }, 100);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <MessageSquare className="h-3 w-3" />;
      case 'summary':
        return <FileText className="h-3 w-3" />;
      case 'task':
        return <CheckSquare className="h-3 w-3" />;
      case 'decision':
        return <Brain className="h-3 w-3" />;
      case 'note':
        return <FileText className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'summary':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'task':
        return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'decision':
        return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'note':
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const formatSimilarity = (similarity: number) => {
    if (isNaN(similarity) || similarity === null || similarity === undefined) {
      return "N/A";
    }
    return `${Math.round(similarity * 100)}%`;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-400 bg-green-500/20 border-green-400/30';
    if (similarity >= 0.8) return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
    if (similarity >= 0.7) return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
    return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMetadataDisplay = (metadata: Record<string, any>, type: string) => {
    switch (type) {
      case 'meeting':
        return {
          title: metadata.title || 'Untitled Meeting',
          date: metadata.date ? new Date(metadata.date).toLocaleDateString() : 'Unknown Date'
        };
      case 'task':
        return {
          title: metadata.task || 'Untitled Task',
          assignee: metadata.assignee || 'Unassigned'
        };
      case 'summary':
        return {
          title: 'Meeting Summary',
          model: metadata.ai_model || 'Unknown Model'
        };
      default:
        return {
          title: 'Content',
          date: 'Unknown Date'
        };
    }
  };

  const quickActions = [
    {
      icon: MessageSquare,
      title: "Last Meeting",
      description: "What was discussed?",
      query: "What was discussed in my last meeting?"
    },
    {
      icon: CheckSquare,
      title: "Pending Tasks",
      description: "What needs to be done?",
      query: "What are my pending tasks?"
    },
    {
      icon: Brain,
      title: "Recent Decisions",
      description: "What was decided?",
      query: "What decisions were made recently?"
    },
    {
      icon: TrendingUp,
      title: "This Week",
      description: "Show me this week's work",
      query: "What happened this week?"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700/50 shadow-2xl z-50 animate-in slide-in-from-right duration-300 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Memory Recall</h2>
              <p className="text-xs text-gray-300">AI-powered search</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-700/20 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Ask anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10 text-sm pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSearching}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  </div>
                )}
              </div>
              <Button 
                size="sm"
                onClick={handleSearch} 
                disabled={!query.trim() || isSearching}
                className="h-10 px-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSearching ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Search your meetings, tasks, and decisions
            </p>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {searchMemory.data && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Found {searchMemory.data.results.length} results</span>
                  <span>{searchMemory.data.search_duration_ms}ms</span>
                </div>
                
                {searchMemory.data.results.length > 0 ? (
                  searchMemory.data.results.map((result: MemoryResult) => {
                    const metadata = getMetadataDisplay(result.metadata, result.content_type);
                    
                    return (
                      <Card key={result.id} className="bg-gray-800/30 border border-gray-600/30 hover:bg-gray-700/30 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {getContentTypeIcon(result.content_type)}
                              <Badge className={`text-xs border ${getContentTypeColor(result.content_type)}`}>
                                {result.content_type}
                              </Badge>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getSimilarityColor(result.similarity)}`}>
                              {formatSimilarity(result.similarity)}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium text-sm mb-1 line-clamp-1 text-white">
                            {metadata.title}
                          </h4>
                          
                          <p className="text-xs text-gray-300 mb-2 line-clamp-2 leading-relaxed">
                            {truncateText(result.content_text, 80)}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              {result.content_type === 'meeting' && metadata.date}
                              {result.content_type === 'task' && `Assigned to ${metadata.assignee}`}
                              {result.content_type === 'summary' && `Generated with ${metadata.model}`}
                            </span>
                            <span>
                              {formatDistanceToNow(new Date(result.metadata.created_at || Date.now()), { addSuffix: true })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50 text-gray-400" />
                    <p className="text-sm text-gray-300">No results found</p>
                    <p className="text-xs text-gray-400">Try different search terms</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            {!searchMemory.data && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Lightbulb className="h-4 w-4 text-purple-400" />
                  Quick Actions
                </div>
                
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all duration-200"
                      onClick={() => handleQuickQuery(action.query)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded backdrop-blur-sm">
                          <action.icon className="h-3 w-3 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white">{action.title}</div>
                          <div className="text-xs text-gray-400">{action.description}</div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Recent Searches */}
                {recentQueries.length > 0 && (
                  <>
                    <Separator className="bg-gray-600" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <History className="h-4 w-4 text-blue-400" />
                        Recent Searches
                      </div>
                      
                      <div className="space-y-1">
                        {recentQueries.slice(0, 3).map((recentQuery, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickQuery(recentQuery)}
                            className="w-full justify-start text-left h-auto p-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                          >
                            <div className="truncate">{recentQuery}</div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Error State */}
            {searchMemory.error && (
              <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-medium">Search Error</span>
                  </div>
                  <p className="text-red-300 text-xs mt-1">
                    {searchMemory.error.message || 'An unexpected error occurred'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-700/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>TaskMind Memory</span>
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-gray-400 hover:text-purple-400 hover:bg-gray-700/50 transition-all duration-200">
              View Full Memory
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorySidebar; 