import { useState, useEffect } from "react";
import { useMemory, MemoryResult } from "@/hooks/useMemory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Brain, 
  Clock, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Loader2,
  RefreshCw,
  Settings,
  Sparkles,
  Zap,
  TrendingUp,
  Filter,
  Info,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MemorySearchProps {
  className?: string;
}

const MemorySearch = ({ className }: MemorySearchProps) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState([0.7]);
  const [limit, setLimit] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  
  const { 
    searchMemory, 
    updateEmbeddings, 
    getMemoryStats,
    isSearching, 
    isUpdating 
  } = useMemory();

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

  const saveRecentQuery = (newQuery: string) => {
    const updated = [newQuery, ...recentQueries.filter(q => q !== newQuery)].slice(0, 5);
    setRecentQueries(updated);
    localStorage.setItem('taskmind-recent-queries', JSON.stringify(updated));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    saveRecentQuery(query.trim());
    
    await searchMemory.mutateAsync({
      query: query.trim(),
      threshold: threshold[0],
      limit
    });
  };

  const handleUpdateEmbeddings = async () => {
    await updateEmbeddings.mutateAsync();
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
      saveRecentQuery(quickQuery);
      searchMemory.mutateAsync({
        query: quickQuery,
        threshold: threshold[0],
        limit
      });
    }, 100);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <MessageSquare className="h-4 w-4" />;
      case 'summary':
        return <FileText className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'decision':
        return <Brain className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMetadataDisplay = (metadata: Record<string, any>, type: string) => {
    switch (type) {
      case 'meeting':
        return {
          title: metadata.title || 'Untitled Meeting',
          date: metadata.date ? new Date(metadata.date).toLocaleDateString() : 'Unknown Date',
          participants: metadata.participants?.length || 0
        };
      case 'task':
        return {
          title: metadata.task || 'Untitled Task',
          assignee: metadata.assignee || 'Unassigned',
          priority: metadata.priority || 'Medium',
          completed: metadata.completed || false
        };
      case 'summary':
        return {
          title: 'Meeting Summary',
          model: metadata.ai_model || 'Unknown Model',
          meetingId: metadata.meeting_id
        };
      default:
        return {
          title: 'Content',
          date: 'Unknown Date'
        };
    }
  };

  const quickQueries = [
    "What was discussed in my last meeting?",
    "What are my pending tasks?",
    "What decisions were made recently?",
    "Show me design-related discussions",
    "Find action items from this week"
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl backdrop-blur-sm">
            <Brain className="h-6 w-6 text-blue-800 dark:text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              TaskMind Memory
            </h2>
            <p className="text-sm text-default">
              Your AI-powered memory assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getMemoryStats.data && (
            <div className="hidden md:flex items-center gap-4 text-sm text-default">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>{getMemoryStats.data.embeddingsCount} items</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>{getMemoryStats.data.searchLogsCount} searches</span>
              </div>
            </div>
          )}
          <Button
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 button-solid-primary"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Search className="h-5 w-5 text-purple-400" />
            Search Your Memory
          </CardTitle>
          <CardDescription className="text-base text-gray-300">
            Ask questions in natural language to find relevant meetings, tasks, and decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="e.g., What was discussed in my last design meeting?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-base pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                </div>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim() || isSearching}
              className="h-12 px-6 flex button-gradient-blue-purple transition-all duration-300 hover:scale-105"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Quick Queries */}
          {!searchMemory.data && !isSearching && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Zap className="h-4 w-4" />
                <span>Quick queries:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQueries.map((quickQuery, index) => (
                  <Button
                    key={index}
                    size="sm"
                    onClick={() => handleQuickQuery(quickQuery)}
                    className="text-xs h-8 button-solid-secondary"
                  >
                    {quickQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Queries */}
          {recentQueries.length > 0 && !searchMemory.data && !isSearching && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>Recent searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentQueries.map((recentQuery, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickQuery(recentQuery)}
                    className="text-xs h-8 bg-gray-700/40 text-gray-300 hover:text-white hover:bg-gray-600"
                  >
                    {recentQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {showAdvanced && (
            <>
              <Separator className="bg-gray-600" />
              <div className="space-y-4 pt-4">
                <div className="space-y-3">
                  <Label className="flex items-center justify-between text-sm font-medium text-gray-200">
                    <span>Similarity Threshold</span>
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-300">
                      {formatSimilarity(threshold[0])} match
                    </Badge>
                  </Label>
                  <Slider
                    value={threshold}
                    onValueChange={setThreshold}
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full [&_[role=slider]]:bg-white"
                  />
                  <p className="text-xs text-gray-400">
                    Higher values return more relevant but fewer results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-200">Maximum Results</Label>
                  <Input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                    min={1}
                    max={50}
                    className="w-32 bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdateEmbeddings}
                    disabled={isUpdating}
                    className="flex items-center gap-2 button-solid-primary"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Update Embeddings
                  </Button>
                  {getMemoryStats.data && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Info className="h-4 w-4" />
                      <span>{getMemoryStats.data.embeddingsCount} items indexed</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchMemory.data && (
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>Search Results</span>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                {searchMemory.data.search_duration_ms}ms
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Found {searchMemory.data.results.length} relevant items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchMemory.data.results.length > 0 ? (
              <div className="space-y-4">
                {searchMemory.data.results.map((result: MemoryResult, index: number) => {
                  const metadata = getMetadataDisplay(result.metadata, result.content_type);
                  
                  return (
                    <Card 
                      key={result.id} 
                      className={`bg-gray-700/30 border border-gray-600/30 hover:bg-gray-600/30 transition-all duration-200 ${
                        index === 0 ? 'ring-2 ring-purple-500/30' : ''
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(result.content_type)}
                            <Badge className={`text-xs border ${getContentTypeColor(result.content_type)}`}>
                              {result.content_type}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getSimilarityColor(result.similarity)}`}>
                              {formatSimilarity(result.similarity)} match
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(result.metadata.created_at || Date.now()), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold mb-2 text-lg text-white">
                          {metadata.title}
                        </h4>
                        
                        <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                          {truncateText(result.content_text)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {result.content_type === 'meeting' && (
                            <>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {metadata.date}
                              </span>
                              <span>{metadata.participants} participants</span>
                            </>
                          )}
                          {result.content_type === 'task' && (
                            <>
                              <span>Assigned to: {metadata.assignee}</span>
                              <span>Priority: {metadata.priority}</span>
                              {metadata.completed && (
                                <span className="text-green-400 font-medium">✓ Completed</span>
                              )}
                            </>
                          )}
                          {result.content_type === 'summary' && (
                            <span>Generated with {metadata.model}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-50 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-white">No results found</h3>
                <p className="text-gray-300 mb-4">
                  Try adjusting your search terms or similarity threshold
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setThreshold([0.5])}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Lower Threshold
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {searchMemory.error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-400">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">Search Error</span>
            </div>
            <p className="text-red-300 mt-2">
              {searchMemory.error.message || 'An unexpected error occurred'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => searchMemory.reset()}
              className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemorySearch; 