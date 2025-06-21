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
  Play
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting Hub 🎤</h1>
            <p className="text-gray-600">Manage your meetings and extract tasks with AI magic</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        </div>
        
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI-Powered Task Extraction
            </CardTitle>
            <CardDescription>
              Upload meeting transcripts or connect Zoom to automatically extract actionable tasks, assignees, and deadlines using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">-</div>
                <div className="text-sm text-gray-600">Transcripts Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">-</div>
                <div className="text-sm text-gray-600">Total Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">GPT-4o</div>
                <div className="text-sm text-gray-600">AI Model</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="meetings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meetings">Meeting History</TabsTrigger>
            <TabsTrigger value="zoom">
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Hub 🎤</h1>
          <p className="text-gray-600">Manage your meetings and extract tasks with AI magic</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* AI-Powered Task Extraction Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Brain className="h-5 w-5" />
            AI-Powered Task Extraction
          </CardTitle>
          <CardDescription>
            Upload meeting transcripts or connect Zoom to automatically extract actionable tasks, assignees, and deadlines using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalMeetings}</div>
              <div className="text-sm text-gray-600">Total Meetings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{meetingsWithRecordings}</div>
              <div className="text-sm text-gray-600">With Recordings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{meetingsThisMonth}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">GPT-4o</div>
              <div className="text-sm text-gray-600">AI Model</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="h-5 w-5" />
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
                className="pl-10"
              />
            </div>

            {/* Recording Filter */}
            <select
              value={filters.hasRecording}
              onChange={(e) => setFilters({ ...filters, hasRecording: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetings">Meeting History</TabsTrigger>
          <TabsTrigger value="zoom">
            <Video className="h-4 w-4 mr-2" />
            Zoom Integration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meeting History
              </CardTitle>
              <CardDescription>
                View and manage your meeting records ({filteredMeetings.length} meetings)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
                  <p className="text-gray-600 mb-4">
                    {meetings.length === 0 ? "Create your first meeting to get started." : "Try adjusting your filters."}
                  </p>
                  {meetings.length === 0 && (
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Meeting
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                          {meeting.has_recording && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Recording
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {meeting.summary}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcessTranscript(meeting.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Process
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSummarizeTranscript(meeting.id)}>
                              <Brain className="h-4 w-4 mr-2" />
                              Summarize
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMeeting(meeting.id)}>
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
  );
};

export default MeetingsTab;
