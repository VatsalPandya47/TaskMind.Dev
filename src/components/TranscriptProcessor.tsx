
import { useState } from "react";
import { useAIProcessing } from "@/hooks/useAIProcessing";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Loader2 } from "lucide-react";

interface TranscriptProcessorProps {
  meetingId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TranscriptProcessor = ({ meetingId, isOpen, onClose }: TranscriptProcessorProps) => {
  const [transcript, setTranscript] = useState("");
  const { processTranscript, isProcessing } = useAIProcessing();

  const handleProcess = async () => {
    if (!transcript.trim()) {
      return;
    }

    try {
      await processTranscript.mutateAsync({
        meetingId,
        transcript: transcript.trim(),
      });
      setTranscript("");
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Transcript Processing
          </DialogTitle>
          <DialogDescription>
            Upload your meeting transcript and let AI extract actionable tasks automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it works</CardTitle>
              <CardDescription>
                Our AI analyzes your transcript to extract:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Action Items:</strong> Clear tasks and deliverables</li>
                <li>• <strong>Assignees:</strong> Who's responsible for each task</li>
                <li>• <strong>Deadlines:</strong> Due dates and timeframes</li>
                <li>• <strong>Priority:</strong> Urgency based on meeting context</li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="transcript">Meeting Transcript</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {transcript.length} characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcess} 
            disabled={!transcript.trim() || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Extract Tasks
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptProcessor;
