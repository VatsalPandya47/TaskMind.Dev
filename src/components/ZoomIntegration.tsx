import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useZoomAuth } from "@/hooks/useZoomAuth";
import { useZoomMeetings } from "@/hooks/useZoomMeetings";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  TrendingUp,
  FileText,
  Download,
  Play
} from "lucide-react";

const ZoomIntegration = () => {
  const { isConnected, disconnectZoom } = useZoomAuth();
  const { zoomMeetings, isLoading, error, syncMeetings } = useZoomMeetings();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // This would need to be implemented based on your Zoom OAuth flow
      console.log("Connecting to Zoom...");
      // For now, we'll just simulate the connection
      setTimeout(() => {
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to connect to Zoom:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectZoom.mutateAsync();
    } catch (error) {
      console.error("Failed to disconnect from Zoom:", error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm">
            <Video className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Zoom Integration
            </h2>
            <p className="text-gray-300">
              Connect your Zoom account to automatically sync meetings and recordings
            </p>
          </div>
        </div>
        
              {isConnected && (
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
                </Badge>
                  <Button
                    variant="outline"
              size="sm"
                    onClick={() => syncMeetings.mutate()}
                    disabled={syncMeetings.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              {syncMeetings.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
                </Button>
          </div>
        )}
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              Not Connected
            </CardTitle>
            <CardDescription className="text-gray-300">
              Connect your Zoom account to start syncing meetings automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                <h4 className="font-medium text-white mb-2">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Automatic meeting sync
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Recording access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Transcript extraction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    AI-powered summaries
                  </li>
                </ul>
              </div>
              
                            <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isConnecting ? (
                                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                                </>
                              ) : (
                                <>
                    <Video className="h-4 w-4 mr-2" />
                    Connect Zoom Account
                                </>
                              )}
                            </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Total Meetings</p>
                    <p className="text-2xl font-bold text-white">{zoomMeetings?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">This Month</p>
                    <p className="text-2xl font-bold text-white">
                      {zoomMeetings?.filter(m => {
                        const meetingDate = new Date(m.start_time);
                        const now = new Date();
                        return meetingDate.getMonth() === now.getMonth() && 
                               meetingDate.getFullYear() === now.getFullYear();
                      }).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/30 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileText className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">With Recordings</p>
                    <p className="text-2xl font-bold text-white">
                      {zoomMeetings?.filter(m => m.recording_files && Array.isArray(m.recording_files) && m.recording_files.length > 0).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings List */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Recent Meetings</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={disconnectZoom.isPending}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  {disconnectZoom.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your Zoom meetings will appear here automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Error loading meetings</h3>
                  <p className="text-gray-300 mb-4">{error.message}</p>
                  <Button onClick={() => syncMeetings.mutate()} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                    Try Again
                  </Button>
                </div>
              ) : zoomMeetings && zoomMeetings.length > 0 ? (
                <div className="space-y-4">
                  {zoomMeetings.slice(0, 10).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-600/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white mb-1 truncate">
                            {meeting.topic || 'Untitled Meeting'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(meeting.start_time)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(meeting.duration)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Meeting
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {meeting.recording_files && Array.isArray(meeting.recording_files) && meeting.recording_files.length > 0 && (
                            <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                              <Download className="h-3 w-3 mr-1" />
                              Recording
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-gray-600/50"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No meetings found</h3>
                  <p className="text-gray-300 mb-4">
                    Your Zoom meetings will appear here once you have some scheduled or completed meetings.
                  </p>
                  <Button onClick={() => syncMeetings.mutate()} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
};

export default ZoomIntegration;
