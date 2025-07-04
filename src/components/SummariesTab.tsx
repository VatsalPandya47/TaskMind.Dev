import { useState } from "react";
import { useUserSummaries } from "@/hooks/useUserSummaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useTheme } from '../context/ThemeContext';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Music, 
  Eye, 
  Trash2, 
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import ThemeGradientWrapper from "./ThemeGradientWrapper";

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
    blue: "border-blue-500/30 bg-blue-500/10",
    green: "border-green-500/30 bg-green-500/10", 
    orange: "border-orange-500/30 bg-orange-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
    red: "border-red-500/30 bg-red-500/10"
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

const SummariesTab = () => {
  const { summaries, isLoading, error } = useUserSummaries();
  const { theme } = useTheme();
  const [selectedSummary, setSelectedSummary] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewSummary = (summary: any) => {
    setSelectedSummary(summary);
    setIsViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setIsViewDialogOpen(false);
    setSelectedSummary(null);
  };

  if (isLoading) {
    return (
      <ThemeGradientWrapper>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Summaries
            </h1>
            <p className="text-muted-foreground">
              AI-generated insights from your meetings
            </p>
          </div>
        </div>
        
        <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <span className="text-gray-300">Loading your summaries...</span>
            </div>
          </CardContent>
        </Card>
      </ThemeGradientWrapper>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 relative">
        {/* Decorative blur elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Summaries
            </h1>
            <p className="text-muted-foreground">
              AI-generated insights from your meetings
            </p>
          </div>
        </div>
        
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription>
            Oops! Failed to load summaries: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formattedSummary = selectedSummary ? formatSummary(selectedSummary.summary) : null;

  return (
    <ThemeGradientWrapper>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
            Summaries
          </h1>
          <p className="text-muted-foreground">
            AI-generated insights from your meetings
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-green-400" />
            Your Summary Stats
          </CardTitle>
          <CardDescription className="text-gray-300">
            Overview of your AI-generated meeting summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{summaries.length}</div>
              <div className="text-sm text-gray-300">Total Summaries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {summaries.filter(s => s.audio_name).length}
              </div>
              <div className="text-sm text-gray-300">Audio Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">GPT-4o</div>
              <div className="text-sm text-gray-300">AI Model</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summaries List */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Meeting Summaries</CardTitle>
          <CardDescription className="text-gray-300">
            Browse and view your AI-generated meeting summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No summaries yet</h3>
              <p className="text-gray-300 mb-4">
                Generate your first summary by processing a meeting transcript.
              </p>
              <Badge variant="outline" className="text-sm border-gray-600 text-gray-300">
                <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                Ready to summarize
              </Badge>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/30">
                  <TableHead className="text-gray-200">Audio File</TableHead>
                  <TableHead className="text-gray-200">Created</TableHead>
                  <TableHead className="text-gray-200">Transcript Length</TableHead>
                  <TableHead className="text-gray-200">Summary Length</TableHead>
                  <TableHead className="text-gray-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary) => (
                  <TableRow key={summary.id} className="border-gray-700 hover:bg-gray-700/30 transition-all duration-200">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {summary.audio_name ? (
                          <Music className="h-4 w-4 text-blue-400" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="truncate max-w-[200px]">
                          {summary.audio_name || "Manual Entry"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {format(new Date(summary.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border border-blue-400/30">
                        {summary.transcript.length} chars
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {summary.summary.length} chars
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSummary(summary)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Summary Dialog */}
      {selectedSummary && (
        <Dialog open={isViewDialogOpen} onOpenChange={handleCloseView}>
          <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto bg-gray-800/95 backdrop-blur-sm border border-gray-700/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-green-400" />
                Meeting Summary
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                {selectedSummary.audio_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Music className="h-4 w-4 text-blue-400" />
                    {selectedSummary.audio_name}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {format(new Date(selectedSummary.created_at), "PPP 'at' p")}
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3">
                <SummarySection
                  title="Key Topics Discussed"
                  content={formattedSummary?.keyTopics || ''}
                  icon={FileText}
                  color="blue"
                />
                
                <SummarySection
                  title="Important Decisions"
                  content={formattedSummary?.decisions || ''}
                  icon={CheckCircle}
                  color="green"
                />
                
                <SummarySection
                  title="Action Items"
                  content={formattedSummary?.actionItems || ''}
                  icon={AlertCircle}
                  color="orange"
                />
                
                <SummarySection
                  title="Key Insights"
                  content={formattedSummary?.insights || ''}
                  icon={FileText}
                  color="purple"
                />
                
                <SummarySection
                  title="Next Steps"
                  content={formattedSummary?.nextSteps || ''}
                  icon={FileText}
                  color="red"
                />
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-200">Raw Summary</h4>
                <div className="bg-gray-700/50 p-3 rounded-md border border-gray-600/30">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {selectedSummary.summary}
                  </pre>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
  </ThemeGradientWrapper>
  );
};

export default SummariesTab; 