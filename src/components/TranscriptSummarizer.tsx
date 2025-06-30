import { useState, useEffect } from "react";
import { useSummarize } from "@/hooks/useSummarize";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Loader2, TestTube, AlertCircle, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import AudioFileUpload from "./AudioFileUpload";

interface TranscriptSummarizerProps {
  isOpen: boolean;
  onClose: () => void;
  audio_name?: string;
}

// Utility function to parse and format the summary
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!content.trim()) return null;

  const colorClasses = {
    blue: "border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm",
    green: "border-green-500/30 bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-sm", 
    orange: "border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-orange-800/10 backdrop-blur-sm",
    purple: "border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm",
    red: "border-red-500/30 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm"
  };

  const iconColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400", 
    purple: "text-purple-400",
    red: "text-red-400"
  };

  return (
    <Card className={`${colorClasses[color as keyof typeof colorClasses]} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-white">
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColors[color as keyof typeof iconColors]} flex-shrink-0`} />
            <span className="break-words">{title}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 hover:bg-gray-700/50 text-gray-300 hover:text-white"
          >
            {copied ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="whitespace-pre-wrap text-xs sm:text-sm text-gray-200 leading-relaxed">
          {content}
        </div>
      </CardContent>
    </Card>
  );
};

const TranscriptSummarizer = ({ isOpen, onClose, audio_name }: TranscriptSummarizerProps) => {
  const [transcript, setTranscript] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { summarizeTranscript, isSummarizing } = useSummarize();

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTranscript("");
      setDryRun(false);
      setLocalError(null);
      setIsProcessing(false);
      setGeneratedSummary(null);
      setSelectedAudioFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [isOpen]);

  // Track processing state
  useEffect(() => {
    setIsProcessing(isSummarizing);
  }, [isSummarizing]);

  const handleAudioFileSelect = (file: File, fileName: string) => {
    setSelectedAudioFile(file);
    setLocalError(null);
  };

  const handleAudioFileRemove = () => {
    setSelectedAudioFile(null);
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setLocalError("Please enter a transcript to summarize.");
      return;
    }

    setLocalError(null);
    setGeneratedSummary(null);
    
    // Use the audio file name if available, otherwise use the prop
    const audioFileName = selectedAudioFile ? selectedAudioFile.name : audio_name;
    
    try {
      const result = await summarizeTranscript.mutateAsync({
        transcript: transcript.trim(),
        dry_run: dryRun,
        audio_name: audioFileName,
      });
      
      // Set the generated summary for display
      if (result.summary) {
        setGeneratedSummary(result.summary);
      }
      
      // Don't close dialog immediately - let user see the summary
      if (!dryRun) {
        // For non-dry runs, close after a delay to show success
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error: any) {
      // Set local error for UI display
      setLocalError(error.message || "Failed to generate summary. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  const isFormValid = transcript.trim().length > 0;
  const isButtonDisabled = !isFormValid || isProcessing;
  const formattedSummary = generatedSummary ? formatSummary(generatedSummary) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 backdrop-blur-sm">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
            AI Transcript Summarization
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-300">
            Generate comprehensive meeting summaries using AI. Upload audio files or enter transcripts manually. Test mode allows you to preview without saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Error Alert */}
          {localError && (
            <Alert variant="destructive" className="border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/10 backdrop-blur-sm p-3 sm:p-4">
              <XCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <AlertDescription className="text-red-200 text-sm sm:text-base">
                {localError}
              </AlertDescription>
            </Alert>
          )}

          {/* Processing Alert */}
          {isProcessing && (
            <Alert className="border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-blue-800/10 backdrop-blur-sm p-3 sm:p-4">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400 flex-shrink-0" />
              <AlertDescription className="text-blue-200 text-sm sm:text-base">
                <strong>Processing...</strong> Generating your summary. This may take a few moments.
              </AlertDescription>
            </Alert>
          )}

          {/* Generated Summary Display */}
          {generatedSummary && (
            <div className="space-y-3 sm:space-y-4">
              <Alert className="border-green-500/30 bg-gradient-to-r from-green-900/20 to-green-800/10 backdrop-blur-sm p-3 sm:p-4">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <AlertDescription className="text-green-200 text-sm sm:text-base">
                  <strong>Summary Generated Successfully!</strong>
                  {dryRun ? " This is a test summary (not saved to database)." : " Summary has been saved to your meeting."}
                </AlertDescription>
              </Alert>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  Meeting Summary
                </h3>
                
                <div className="grid gap-3 sm:gap-4">
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
                    icon={TestTube}
                    color="purple"
                  />
                  
                  <SummarySection
                    title="Next Steps"
                    content={formattedSummary?.nextSteps || ''}
                    icon={FileText}
                    color="red"
                  />
                </div>

                <Separator className="my-3 sm:my-4 bg-gray-700/50" />
              </div>
            </div>
          )}

          {/* Input Form - Only show if no summary generated or in dry run mode */}
          {(!generatedSummary || dryRun) && (
            <>
              {/* Audio File Upload */}
              <AudioFileUpload
                onFileSelect={handleAudioFileSelect}
                onFileRemove={handleAudioFileRemove}
                selectedFile={selectedAudioFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={localError}
                onTranscription={setTranscript}
              />

              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-600/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-white">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                    How it works
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-300">
                    Our AI creates structured summaries including:
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                      <span><strong className="text-white">Key Topics:</strong> Main subjects and themes discussed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                      <span><strong className="text-white">Important Decisions:</strong> Decisions made during the meeting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                      <span><strong className="text-white">Action Items:</strong> Tasks assigned and responsibilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                      <span><strong className="text-white">Key Insights:</strong> Important points and revelations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                      <span><strong className="text-white">Next Steps:</strong> What happens after the meeting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="transcript" className="text-sm sm:text-base font-medium text-white">
                  Meeting Transcript
                  <span className="text-red-400 ml-1">*</span>
                </Label>
                <Textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder="Paste your meeting transcript here..."
                  rows={6}
                  className={`resize-none transition-all duration-200 text-sm sm:text-base bg-gray-800/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm ${
                    isProcessing 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:border-gray-500'
                  }`}
                  disabled={isProcessing}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm">
                  <span className={`${transcript.length === 0 ? 'text-gray-500' : 'text-gray-400'}`}>
                    {transcript.length} characters
                  </span>
                  {transcript.length > 0 && (
                    <span className={`${
                      transcript.length < 100 ? 'text-orange-400' : 
                      transcript.length < 500 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {transcript.length < 100 ? 'Very short' : 
                       transcript.length < 500 ? 'Short' : 'Good length'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 sm:p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/50">
                <Switch
                  id="dry-run"
                  checked={dryRun}
                  onCheckedChange={setDryRun}
                  disabled={isProcessing}
                />
                <Label 
                  htmlFor="dry-run" 
                  className={`flex items-center gap-2 cursor-pointer text-sm sm:text-base text-gray-200 ${
                    isProcessing ? 'opacity-60 cursor-not-allowed' : 'hover:text-white'
                  }`}
                >
                  <TestTube className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                  Test Mode (dry_run)
                </Label>
              </div>
              
              {dryRun && (
                <Alert className="border-orange-500/30 bg-gradient-to-r from-orange-900/20 to-orange-800/10 backdrop-blur-sm p-3 sm:p-4">
                  <TestTube className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                  <AlertDescription className="text-orange-200 text-sm sm:text-base">
                    <strong>Test Mode Active:</strong> Summary will be generated but not saved to the database. 
                    This is useful for testing the AI response before committing to a permanent summary.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-4 sm:pt-6">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isProcessing}
            className="min-w-[80px] sm:min-w-[100px] text-sm sm:text-base border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Please wait...</span>
                <span className="sm:hidden">Wait...</span>
              </>
            ) : (
              generatedSummary ? 'Close' : 'Cancel'
            )}
          </Button>
          
          {(!generatedSummary || dryRun) && (
            <Button 
              onClick={handleSummarize} 
              disabled={isButtonDisabled}
              className={`min-w-[100px] sm:min-w-[140px] transition-all duration-200 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl ${
                isButtonDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Summarizing...</span>
                  <span className="sm:hidden">Processing...</span>
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {dryRun ? "Test Summary" : "Generate Summary"}
                  </span>
                  <span className="sm:hidden">
                    {dryRun ? "Test" : "Generate"}
                  </span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptSummarizer; 