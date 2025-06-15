
import { useState } from "react";
import { useZoomAuth } from "@/hooks/useZoomAuth";
import { useZoomMeetings } from "@/hooks/useZoomMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, RefreshCw, Download, ExternalLink, Unlink, Check } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SlackIntegration } from "./SlackIntegration";

const ZoomIntegration = () => {
  const { isConnected, disconnectZoom } = useZoomAuth();
  const { zoomMeetings, isLoading, syncMeetings, extractTranscript } = useZoomMeetings();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleZoomConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Initiating Zoom connection...');
      
      const { data, error } = await supabase.functions.invoke('get-zoom-auth-url');
      
      console.log('Auth URL response:', { data, error });
      
      if (error) throw error;
      
      if (data?.authUrl) {
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('zoom_oauth_state', state);
        console.log('Generated OAuth state:', state);
        
        const authUrlWithState = `${data.authUrl}&state=${state}`;
        console.log('Redirecting to:', authUrlWithState);
        
        window.top.location.href = authUrlWithState;
      } else {
        throw new Error('Failed to get authorization URL from server');
      }
    } catch (error: any) {
      console.error('Failed to initiate Zoom connection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Zoom",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-slate-200/60 card-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Video className="h-5 w-5 text-blue-600" />
            </div>
            Zoom Integration
          </CardTitle>
          <CardDescription className="text-slate-600">
            Connect your Zoom account to automatically sync meetings and extract recordings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isConnected ? (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-blue-500 rounded-full">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-blue-800">Connected to Zoom</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => syncMeetings.mutate()}
                    disabled={syncMeetings.isPending}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncMeetings.isPending ? 'animate-spin' : ''}`} />
                    Sync Meetings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectZoom.mutate()}
                    disabled={disconnectZoom.isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-3">
                    Connect your Zoom account to automatically sync meetings and extract transcripts.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    <span>Automatic meeting sync</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                    <span>AI-powered transcript extraction</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleZoomConnect} 
                  disabled={isConnecting}
                  className="w-full h-11 gradient-bg text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Zoom'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SlackIntegration />

      {isConnected && (
        <Card className="bg-white border border-slate-200/60 card-shadow">
          <CardHeader>
            <CardTitle className="text-slate-900">Zoom Meetings</CardTitle>
            <CardDescription className="text-slate-600">
              Your recent Zoom meetings with recordings and transcripts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : zoomMeetings.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No meetings found</h3>
                <p className="text-slate-600 mb-4">Sync your Zoom account to see meetings here.</p>
                <Button 
                  onClick={() => syncMeetings.mutate()}
                  className="gradient-bg text-white rounded-xl shadow-lg shadow-purple-500/25"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
              </div>
            ) : (
              <div className="bg-slate-50/50 rounded-xl p-1">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200/60">
                      <TableHead className="text-slate-600 font-medium">Topic</TableHead>
                      <TableHead className="text-slate-600 font-medium">Date</TableHead>
                      <TableHead className="text-slate-600 font-medium">Duration</TableHead>
                      <TableHead className="text-slate-600 font-medium">Status</TableHead>
                      <TableHead className="text-slate-600 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zoomMeetings.map((meeting) => (
                      <TableRow key={meeting.id} className="border-slate-200/60 hover:bg-white/50">
                        <TableCell className="font-medium text-slate-900">{meeting.topic || 'Untitled Meeting'}</TableCell>
                        <TableCell className="text-slate-600">
                          {meeting.start_time ? format(new Date(meeting.start_time), "PPp") : 'N/A'}
                        </TableCell>
                        <TableCell className="text-slate-600">{meeting.duration ? `${meeting.duration} min` : 'N/A'}</TableCell>
                        <TableCell>
                          {meeting.transcript_file_url ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Transcript Available
                            </Badge>
                          ) : meeting.recording_files ? (
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Recording Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500 border-slate-200">
                              No Recording
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {meeting.recording_files && !meeting.transcript_file_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => extractTranscript.mutate(meeting.id)}
                                disabled={extractTranscript.isPending}
                                className="text-purple-600 hover:bg-purple-50"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Extract
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZoomIntegration;
