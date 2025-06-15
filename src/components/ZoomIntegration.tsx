
import { useState } from "react";
import { useZoomAuth } from "@/hooks/useZoomAuth";
import { useZoomMeetings } from "@/hooks/useZoomMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, RefreshCw, Download, ExternalLink, Unlink, Brain } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ZoomIntegration = () => {
  const { isConnected, disconnectZoom } = useZoomAuth();
  const { zoomMeetings, isLoading, syncMeetings, extractTranscript } = useZoomMeetings();
  const [isConnecting, setIsConnecting] = useState(false);
  const [processingMeetings, setProcessingMeetings] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleZoomConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Initiating Zoom connection...');
      
      // Get the auth URL from the backend
      const { data, error } = await supabase.functions.invoke('get-zoom-auth-url', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Auth URL response:', { data, error });
      
      if (error) {
        console.error('Error getting auth URL:', error);
        throw new Error(error.message || 'Failed to get authorization URL');
      }
      
      if (data?.authUrl) {
        // Generate state parameter for security
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('zoom_oauth_state', state);
        console.log('Generated OAuth state:', state);
        
        // Add state to the auth URL
        const authUrlWithState = `${data.authUrl}&state=${state}`;
        console.log('Redirecting to:', authUrlWithState);
        
        // Use window.location.href for iframe compatibility
        if (window.parent !== window) {
          // We're in an iframe, use parent window
          window.parent.location.href = authUrlWithState;
        } else {
          // We're in the main window
          window.location.href = authUrlWithState;
        }
      } else {
        throw new Error('Failed to get authorization URL from server');
      }
    } catch (error: any) {
      console.error('Failed to initiate Zoom connection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Zoom. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleExtractAndProcess = async (meetingId: string) => {
    setProcessingMeetings(prev => new Set([...prev, meetingId]));
    
    try {
      console.log('Starting transcript extraction and processing for meeting:', meetingId);
      
      // Extract the transcript and create tasks
      await extractTranscript.mutateAsync(meetingId);
      
    } catch (error: any) {
      console.error('Failed to extract and process transcript:', error);
      // Error is already handled by the mutation
    } finally {
      setProcessingMeetings(prev => {
        const newSet = new Set(prev);
        newSet.delete(meetingId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Zoom Integration
          </CardTitle>
          <CardDescription>
            Connect your Zoom account to automatically sync meetings and extract actionable tasks from recordings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium">
                {isConnected ? 'Connected to Zoom' : 'Not connected'}
              </span>
              {isConnected && (
                <Badge variant="outline" className="text-green-600">
                  AI-Powered Task Extraction
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {isConnected ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => syncMeetings.mutate()}
                    disabled={syncMeetings.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncMeetings.isPending ? 'animate-spin' : ''}`} />
                    Sync Meetings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => disconnectZoom.mutate()}
                    disabled={disconnectZoom.isPending}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={handleZoomConnect} disabled={isConnecting}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Zoom'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Zoom Meetings with AI Task Extraction</CardTitle>
            <CardDescription>
              Your recent Zoom meetings with recordings. Extract transcripts and automatically create tasks with AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : zoomMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
                <p className="text-gray-600 mb-4">Sync your Zoom account to see meetings here.</p>
                <Button onClick={() => syncMeetings.mutate()} disabled={syncMeetings.isPending}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncMeetings.isPending ? 'animate-spin' : ''}`} />
                  Sync Now
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zoomMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">{meeting.topic || 'Untitled Meeting'}</TableCell>
                      <TableCell>
                        {meeting.start_time ? format(new Date(meeting.start_time), "PPp") : 'N/A'}
                      </TableCell>
                      <TableCell>{meeting.duration ? `${meeting.duration} min` : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {meeting.meeting_id ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Tasks Extracted
                            </Badge>
                          ) : meeting.transcript_file_url ? (
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                              Transcript Available
                            </Badge>
                          ) : meeting.recording_files ? (
                            <Badge variant="outline" className="text-blue-600">
                              Recording Available
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              No Recording
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {meeting.recording_files && !meeting.meeting_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExtractAndProcess(meeting.id)}
                              disabled={processingMeetings.has(meeting.id) || extractTranscript.isPending}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {processingMeetings.has(meeting.id) ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Brain className="h-4 w-4 mr-1" />
                                  Extract & Create Tasks
                                </>
                              )}
                            </Button>
                          )}
                          {meeting.meeting_id && (
                            <Badge variant="outline" className="text-green-600">
                              ✅ Complete
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZoomIntegration;
