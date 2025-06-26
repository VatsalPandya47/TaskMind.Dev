import { useState, useEffect } from "react";
import { useMemory, MemoryResult } from "@/hooks/useMemory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'summary':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'task':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'decision':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'note':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatSimilarity = (similarity: number) => {
    if (isNaN(similarity) || similarity === null || similarity === undefined) {
      return "N/A";
    }
    return `${Math.round(similarity * 100)}%`;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (similarity >= 0.8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (similarity >= 0.7) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
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
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TaskMind Memory
            </h2>
            <p className="text-sm text-muted-foreground">
              Your AI-powered memory assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getMemoryStats.data && (
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>{getMemoryStats.data.embeddingsCount} items</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>{getMemoryStats.data.searchLogsCount} searches</span>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-purple-600" />
            Search Your Memory
          </CardTitle>
          <CardDescription className="text-base">
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
                className="h-12 text-base pr-12"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                </div>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!query.trim() || isSearching}
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Quick queries:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQueries.map((quickQuery, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuery(quickQuery)}
                    className="text-xs h-8"
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    className="text-xs h-8 text-muted-foreground hover:text-foreground"
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
              <Separator />
              <div className="space-y-4 pt-4">
                <div className="space-y-3">
                  <Label className="flex items-center justify-between text-sm font-medium">
                    <span>Similarity Threshold</span>
                    <Badge variant="outline" className="text-xs">
                      {formatSimilarity(threshold[0])} match
                    </Badge>
                  </Label>
                  <Slider
                    value={threshold}
                    onValueChange={setThreshold}
                    max={1}
                    min={0}
                    step={0.05}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values return more relevant but fewer results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Maximum Results</Label>
                  <Input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                    min={1}
                    max={50}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdateEmbeddings}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Update Embeddings
                  </Button>
                  {getMemoryStats.data && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {searchMemory.data.search_duration_ms}ms
              </div>
            </CardTitle>
            <CardDescription>
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
                      className={`border-l-4 border-l-purple-500 hover:shadow-md transition-shadow duration-200 ${
                        index === 0 ? 'ring-2 ring-purple-100' : ''
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
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(result.metadata.created_at || Date.now()), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold mb-2 text-lg">
                          {metadata.title}
                        </h4>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {truncateText(result.content_text)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                                <span className="text-green-600 font-medium">✓ Completed</span>
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
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or similarity threshold
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setThreshold([0.5])}
                  className="flex items-center gap-2"
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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-800">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">Search Error</span>
            </div>
            <p className="text-red-700 mt-2">
              {searchMemory.error.message || 'An unexpected error occurred'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => searchMemory.reset()}
              className="mt-3"
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