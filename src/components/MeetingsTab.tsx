import { useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar, 
  Brain, 
  FileText, 
  Trash2, 
  Video, 
  Users, 
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  Play,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import TranscriptProcessor from "./TranscriptProcessor";
import TranscriptSummarizer from "./TranscriptSummarizer";
import ZoomIntegration from "./ZoomIntegration";
import { MeetingSkeleton } from "./LoadingSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MeetingsTab = () => {
  const { meetings, isLoading, createMeeting, deleteMeeting } = useMeetings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isTranscriptDialogOpen, setIsTranscriptDialogOpen] = useState(false);
  const [isSummarizerDialogOpen, setIsSummarizerDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: "",
    hasRecording: ""
  });
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    participants: "",
    duration: "",
    summary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantsArray = newMeeting.participants
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    await createMeeting.mutateAsync({
      title: newMeeting.title,
      date: newMeeting.date,
      participants: participantsArray,
      duration: newMeeting.duration || null,
      summary: newMeeting.summary || null,
    });

    setNewMeeting({
      title: "",
      date: "",
      participants: "",
      duration: "",
      summary: "",
    });
    setIsDialogOpen(false);
  };

  const handleProcessTranscript = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsTranscriptDialogOpen(true);
  };

  const handleSummarizeTranscript = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsSummarizerDialogOpen(true);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await deleteMeeting.mutateAsync(meetingId);
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  // Get today's date in YYYY-MM-DD format for date input max
  const today = new Date().toISOString().split('T')[0];

  // Get the selected meeting for audio_name
  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);

  // Apply filters
  const filteredMeetings = meetings.filter(meeting => {
    if (filters.search && !meeting.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.hasRecording === "yes" && !meeting.has_recording) {
      return false;
    }
    if (filters.hasRecording === "no" && meeting.has_recording) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const totalMeetings = meetings.length;
  const meetingsWithRecordings = meetings.filter(m => m.has_recording).length;
  const meetingsThisMonth = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    const now = new Date();
    return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">Meetings</h1>
              <p className="text-gray-300">Turn every conversation into actionable insights</p>
            </div>
            <Button disabled className="bg-blue-600/50 text-white rounded-2xl">
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
          </div>
          
          <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Brain className="h-5 w-5" />
                AI-Powered Task Extraction
              </CardTitle>
              <CardDescription className="text-gray-300">
                Upload meeting transcripts or connect Zoom to automatically extract actionable tasks, assignees, and deadlines using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">-</div>
                  <div className="text-sm text-gray-400">Transcripts Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">-</div>
                  <div className="text-sm text-gray-400">Total Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">GPT-4o</div>
                  <div className="text-sm text-gray-400">AI Model</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="meetings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 border-gray-700/50">
              <TabsTrigger value="meetings" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Meeting History</TabsTrigger>
              <TabsTrigger value="zoom" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Video className="h-4 w-4 mr-2" />
                Zoom Integration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="meetings">
              <MeetingSkeleton />
            </TabsContent>
            
            <TabsContent value="zoom">
              <ZoomIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">Meetings</h1>
            <p className="text-gray-300">Turn every conversation into actionable insights</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            New Meeting
          </Button>
        </div>

        {/* Main Content */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">Meeting Intelligence</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect your calendar and automatically extract insights from every conversation
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                GPT-4o
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* AI-Powered Task Extraction Card */}
        <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20 shadow-lg hover:border-blue-400/30 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Brain className="h-5 w-5" />
              AI-Powered Task Extraction
            </CardTitle>
            <CardDescription className="text-gray-300">
              Upload meeting transcripts or connect Zoom to automatically extract actionable tasks, assignees, and deadlines using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{totalMeetings}</div>
                <div className="text-sm text-gray-400">Total Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{meetingsWithRecordings}</div>
                <div className="text-sm text-gray-400">With Recordings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{meetingsThisMonth}</div>
                <div className="text-sm text-gray-400">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">GPT-4o</div>
                <div className="text-sm text-gray-400">AI Model</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold text-foreground">{meetings.length}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recorded</p>
                  <p className="text-2xl font-semibold text-foreground">{meetingsWithRecordings}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This month</p>
                  <p className="text-2xl font-semibold text-foreground">{meetingsThisMonth}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5 text-blue-400" />
              Filter Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search meetings..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400"
                />
              </div>

              {/* Recording Filter */}
              <select
                value={filters.hasRecording}
                onChange={(e) => setFilters({ ...filters, hasRecording: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-700/50 bg-gray-800/60 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="">All meetings</option>
                <option value="yes">With recordings</option>
                <option value="no">Without recordings</option>
              </select>

              {/* Clear Filters */}
              {(filters.search || filters.hasRecording) && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ search: "", dateRange: "", hasRecording: "" })}
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-2xl"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="meetings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 border-gray-700/50 rounded-2xl">
            <TabsTrigger value="meetings" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl">Meeting History</TabsTrigger>
            <TabsTrigger value="zoom" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-2xl">
              <Video className="h-4 w-4 mr-2" />
              Zoom Integration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meetings">
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Meeting History
                </CardTitle>
                <CardDescription className="text-gray-300">
                  View and manage your meeting records ({filteredMeetings.length} meetings)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredMeetings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No meetings found</h3>
                    <p className="text-gray-400 mb-4">
                      {meetings.length === 0 ? "Create your first meeting to get started." : "Try adjusting your filters."}
                    </p>
                    {meetings.length === 0 && (
                      <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Meeting
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-2xl hover:bg-gray-600/50 hover:scale-105 transition-all duration-200 border border-gray-600/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-white">{meeting.title}</h3>
                            {meeting.has_recording && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                Recording
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(meeting.date), "MMM d, yyyy")}
                            </span>
                            {meeting.participants && meeting.participants.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meeting.participants.length} participants
                              </span>
                            )}
                            {meeting.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meeting.duration}
                              </span>
                            )}
                          </div>
                          {meeting.summary && (
                            <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                              {meeting.summary}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProcessTranscript(meeting.id)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-2xl"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem onClick={() => handleSummarizeTranscript(meeting.id)} className="text-white hover:bg-gray-700">
                                <Brain className="h-4 w-4 mr-2" />
                                Summarize
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMeeting(meeting.id)} className="text-white hover:bg-gray-700">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="zoom">
            <ZoomIntegration />
          </TabsContent>
        </Tabs>

        {/* Transcript Processing Dialog */}
        {selectedMeeting && (
          <TranscriptProcessor 
            meetingId={selectedMeeting.id}
            isOpen={isTranscriptDialogOpen}
            onClose={() => setIsTranscriptDialogOpen(false)}
          />
        )}

        {/* Transcript Summarizer Dialog */}
        {selectedMeeting && (
          <TranscriptSummarizer 
            isOpen={isSummarizerDialogOpen}
            onClose={() => setIsSummarizerDialogOpen(false)}
            audio_name={selectedMeeting.title}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingsTab;
