import { useState } from "react";
import { useUserSummaries } from "@/hooks/useUserSummaries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
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
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50", 
    orange: "border-orange-200 bg-orange-50",
    purple: "border-purple-200 bg-purple-50",
    red: "border-red-200 bg-red-50"
  };

  return (
    <Card className={`${colorClasses[color as keyof typeof colorClasses]} border-2`}>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${color}-600 flex-shrink-0`} />
          <span className="break-words">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

const SummariesTab = () => {
  const { summaries, isLoading, error } = useUserSummaries();
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Summaries 🧠</h1>
            <p className="text-gray-600">Your AI-generated meeting summaries and insights</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading your summaries...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Summaries 🧠</h1>
            <p className="text-gray-600">Your AI-generated meeting summaries and insights</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Oops! Failed to load summaries: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formattedSummary = selectedSummary ? formatSummary(selectedSummary.summary) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Summaries 🧠</h1>
          <p className="text-gray-600">Your AI-generated meeting summaries and insights</p>
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Your Summary Stats
          </CardTitle>
          <CardDescription>
            Overview of your AI-generated meeting summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summaries.length}</div>
              <div className="text-sm text-gray-600">Total Summaries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {summaries.filter(s => s.audio_name).length}
              </div>
              <div className="text-sm text-gray-600">Audio Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">GPT-4o</div>
              <div className="text-sm text-gray-600">AI Model</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summaries List */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Summaries</CardTitle>
          <CardDescription>
            Browse and view your AI-generated meeting summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries yet</h3>
              <p className="text-gray-600 mb-4">
                Generate your first summary by processing a meeting transcript.
              </p>
              <Badge variant="outline" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to summarize
              </Badge>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Audio File</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Transcript Length</TableHead>
                  <TableHead>Summary Length</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((summary) => (
                  <TableRow key={summary.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {summary.audio_name ? (
                          <Music className="h-4 w-4 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="truncate max-w-[200px]">
                          {summary.audio_name || "Manual Entry"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">
                          {format(new Date(summary.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {summary.transcript.length} chars
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {summary.summary.length} chars
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSummary(summary)}
                          className="text-blue-600 hover:text-blue-800"
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
          <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Meeting Summary
              </DialogTitle>
              <DialogDescription>
                {selectedSummary.audio_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Music className="h-4 w-4" />
                    {selectedSummary.audio_name}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
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

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Raw Summary</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {selectedSummary.summary}
                  </pre>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SummariesTab; 