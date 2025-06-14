
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
import { Plus, Calendar, Brain, FileText, Trash2, Video } from "lucide-react";
import { format } from "date-fns";
import TranscriptProcessor from "./TranscriptProcessor";
import ZoomIntegration from "./ZoomIntegration";

const MeetingsTab = () => {
  const { meetings, isLoading, createMeeting, deleteMeeting } = useMeetings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isTranscriptDialogOpen, setIsTranscriptDialogOpen] = useState(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600">Manage your meetings and extract tasks with AI</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Meeting</DialogTitle>
              <DialogDescription>
                Add a new meeting to track insights and action items.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Participants</Label>
                  <Input
                    id="participants"
                    value={newMeeting.participants}
                    onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                    placeholder="Enter names separated by commas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                    placeholder="e.g., 1 hour"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={newMeeting.summary}
                    onChange={(e) => setNewMeeting({ ...newMeeting, summary: e.target.value })}
                    placeholder="Meeting summary or notes"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMeeting.isPending}>
                  {createMeeting.isPending ? "Creating..." : "Create Meeting"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Processing Stats */}
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
              <div className="text-2xl font-bold text-blue-600">{meetings.filter(m => m.transcript).length}</div>
              <div className="text-sm text-gray-600">Transcripts Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{meetings.length}</div>
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
          <Card>
            <CardHeader>
              <CardTitle>Meeting History</CardTitle>
              <CardDescription>
                View and manage your meeting records. Process transcripts to extract tasks automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meetings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first meeting.</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meeting
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {meeting.zoom_meeting_id && (
                              <Video className="h-4 w-4 text-blue-600" />
                            )}
                            {meeting.title}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(meeting.date), "PPP")}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {meeting.participants?.map((participant, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            )) || <span className="text-gray-500">No participants</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {meeting.transcript ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <FileText className="h-3 w-3 mr-1" />
                              Processed
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Not Processed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!meeting.transcript && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProcessTranscript(meeting.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Brain className="h-4 w-4 mr-1" />
                                Process
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMeeting.mutate(meeting.id)}
                              disabled={deleteMeeting.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>
        
        <TabsContent value="zoom">
          <ZoomIntegration />
        </TabsContent>
      </Tabs>

      {/* Transcript Processor Dialog */}
      {selectedMeetingId && (
        <TranscriptProcessor
          meetingId={selectedMeetingId}
          isOpen={isTranscriptDialogOpen}
          onClose={() => {
            setIsTranscriptDialogOpen(false);
            setSelectedMeetingId(null);
          }}
        />
      )}
    </div>
  );
};

export default MeetingsTab;
