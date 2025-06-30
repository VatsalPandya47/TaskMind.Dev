import { useUserSummaries } from "@/hooks/useUserSummaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calendar, 
  Clock, 
  Music, 
  Eye, 
  Loader2,
  AlertCircle,
  CheckCircle,
  History
} from "lucide-react";
import { format } from "date-fns";

// Utility function to parse and format the summary (same as in TranscriptSummarizer)
const formatSummary = (summaryText: string) => {
  const sections = {
    keyTopics: '',
    decisions: '',
    actionItems: '',
    insights: '',
    nextSteps: ''
  };

  // Split the summary into lines and parse sections
  const lines = summaryText.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect section headers
    if (trimmedLine.toLowerCase().includes('key topics') || trimmedLine.toLowerCase().includes('topics discussed')) {
      currentSection = 'keyTopics';
      continue;
    } else if (trimmedLine.toLowerCase().includes('important decisions') || trimmedLine.toLowerCase().includes('decisions')) {
      currentSection = 'decisions';
      continue;
    } else if (trimmedLine.toLowerCase().includes('action items') || trimmedLine.toLowerCase().includes('tasks')) {
      currentSection = 'actionItems';
      continue;
    } else if (trimmedLine.toLowerCase().includes('key insights') || trimmedLine.toLowerCase().includes('insights')) {
      currentSection = 'insights';
      continue;
    } else if (trimmedLine.toLowerCase().includes('next steps') || trimmedLine.toLowerCase().includes('next steps')) {
      currentSection = 'nextSteps';
      continue;
    }
    
    // Add content to current section
    if (currentSection && trimmedLine && !trimmedLine.startsWith('#')) {
      sections[currentSection as keyof typeof sections] += (sections[currentSection as keyof typeof sections] ? '\n' : '') + trimmedLine;
    }
  }

  return sections;
};

// Component to display a formatted section
const SummarySection = ({ 
  title, 
  content, 
  icon: Icon, 
  color = "blue" 
}: { 
  title: string; 
  content: string; 
  icon: any; 
  color?: string;
}) => {
  if (!content.trim()) return null;

  const colorClasses = {
    blue: "border-blue-400/30 bg-blue-500/10",
    green: "border-green-400/30 bg-green-500/10", 
    orange: "border-orange-400/30 bg-orange-500/10",
    purple: "border-purple-400/30 bg-purple-500/10",
    red: "border-red-400/30 bg-red-500/10"
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
    purple: "text-purple-400",
    red: "text-red-400"
  };

  return (
    <Card className={`${colorClasses[color as keyof typeof colorClasses]} border-2 bg-gray-800/50 backdrop-blur-sm`}>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <Icon className={`h-4 w-4 ${iconColors[color as keyof typeof iconColors]} flex-shrink-0`} />
          <span className="break-words">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

export default function SummaryHistory() {
  const { summaries, isLoading, error } = useUserSummaries();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">My Summary History</h1>
              <p className="text-gray-300">View all your AI-generated meeting summaries</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                <CardHeader>
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">My Summary History</h1>
              <p className="text-gray-300">View all your AI-generated meeting summaries</p>
            </div>
          </div>
          
          <Alert variant="destructive" className="bg-red-900/50 border-red-700/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Failed to load summaries: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">My Summary History</h1>
            <p className="text-gray-300">View all your AI-generated meeting summaries</p>
          </div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-400" />
            <Badge variant="outline" className="border-purple-400/30 text-purple-300">
              {summaries.length} summaries
            </Badge>
          </div>
        </div>

        {summaries.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No summaries yet</h3>
              <p className="text-gray-300 mb-4 text-center max-w-md">
                Generate your first summary by processing a meeting transcript using the AI summarizer.
              </p>
              <Badge variant="outline" className="text-sm border-purple-400/30 text-purple-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to summarize
              </Badge>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {summaries.map((summary) => {
              const formattedSummary = formatSummary(summary.summary);
              
              return (
                <Card key={summary.id} className="bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {summary.audio_name ? (
                            <Music className="h-4 w-4 text-purple-400" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-medium text-lg text-white">
                            {summary.audio_name || "Manual Entry"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(summary.created_at), "PPP")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(summary.created_at), "p")}
                          </div>
                          <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                            {summary.transcript.length} chars transcript
                          </Badge>
                          <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                            {summary.summary.length} chars summary
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Summary Sections */}
                    <div className="grid gap-3">
                      <SummarySection
                        title="Key Topics Discussed"
                        content={formattedSummary.keyTopics}
                        icon={FileText}
                        color="blue"
                      />
                      
                      <SummarySection
                        title="Important Decisions"
                        content={formattedSummary.decisions}
                        icon={CheckCircle}
                        color="green"
                      />
                      
                      <SummarySection
                        title="Action Items"
                        content={formattedSummary.actionItems}
                        icon={AlertCircle}
                        color="orange"
                      />
                      
                      <SummarySection
                        title="Key Insights"
                        content={formattedSummary.insights}
                        icon={FileText}
                        color="purple"
                      />
                      
                      <SummarySection
                        title="Next Steps"
                        content={formattedSummary.nextSteps}
                        icon={FileText}
                        color="red"
                      />
                    </div>

                    <Separator className="bg-gray-700/50" />

                    {/* Raw Summary and Transcript */}
                    <details className="group">
                      <summary className="flex items-center gap-2 text-purple-400 cursor-pointer hover:text-purple-300 font-medium transition-colors">
                        <Eye className="h-4 w-4" />
                        View Raw Summary & Transcript
                      </summary>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-300">Raw Summary</h4>
                          <div className="bg-gray-700/50 p-3 rounded-md border border-gray-600/50">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                              {summary.summary}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-300">Original Transcript</h4>
                          <div className="bg-gray-700/50 p-3 rounded-md max-h-40 overflow-y-auto border border-gray-600/50">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                              {summary.transcript}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 