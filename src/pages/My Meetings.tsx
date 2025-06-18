import { useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, FileText, Video, Plus, Search, Filter, Edit, Trash2, Eye, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const MyMeetings = () => {
  const { meetings, isLoading, createMeeting, updateMeeting, deleteMeeting } = useMeetings();
  const { tasks } = useTasks();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    participants: "",
    duration: "",
    summary: "",
  });

  const today = new Date().toISOString().split('T')[0];

  // Filter meetings based on search and filters
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.participants?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "processed" && meeting.transcript) ||
                         (statusFilter === "unprocessed" && !meeting.transcript);
    
    const matchesType = typeFilter === "all" ||
                       (typeFilter === "zoom" && meeting.zoom_meeting_id) ||
                       (typeFilter === "manual" && !meeting.zoom_meeting_id);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalMeetings = meetings.length;
  const processedMeetings = meetings.filter(m => m.transcript).length;
  const zoomMeetings = meetings.filter(m => m.zoom_meeting_id).length;
  const manualMeetings = totalMeetings - zoomMeetings;
  const totalParticipants = meetings.reduce((acc, m) => acc + (m.participants?.length || 0), 0);

  const handleSubmit = async (e) => {
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

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const participantsArray = editingMeeting.participants
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    await updateMeeting.mutateAsync({
      id: editingMeeting.id,
      title: editingMeeting.title,
      date: editingMeeting.date,
      participants: participantsArray,
      duration: editingMeeting.duration || null,
      summary: editingMeeting.summary || null,
    });

    setIsEditDialogOpen(false);
    setEditingMeeting(null);
  };

  const handleDelete = async (meetingId) => {
    if (confirm("Are you sure you want to delete this meeting? This action cannot be undone.")) {
      await deleteMeeting.mutateAsync(meetingId);
    }
  };

  const getMeetingTasks = (meetingId) => {
    return tasks.filter(task => task.meeting_id === meetingId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Meetings</h1>
            <p className="text-muted-foreground">View and manage all your meetings</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Meetings</h1>
          <p className="text-muted-foreground">View and manage all your meetings</p>
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
                    max={today}
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
                    placeholder="e.g., 1 hour, 30 minutes"
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
              <div className="flex justify-end">
                <Button type="submit" disabled={createMeeting.isPending}>
                  {createMeeting.isPending ? "Creating..." : "Create Meeting"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Total Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMeetings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{processedMeetings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Zoom Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{zoomMeetings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalParticipants}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search meetings or participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="unprocessed">Not Processed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="zoom">Zoom Meetings</SelectItem>
            <SelectItem value="manual">Manual Meetings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first meeting or connecting Zoom.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Meeting
            </Button>
            <Button variant="outline" asChild>
              <a href="/settings">Connect Zoom</a>
            </Button>
          </div>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setTypeFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredMeetings.map((meeting) => {
            const meetingTasks = getMeetingTasks(meeting.id);
            const completedTasks = meetingTasks.filter(t => t.completed).length;
            const pendingTasks = meetingTasks.length - completedTasks;
            
            return (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {meeting.zoom_meeting_id && (
                          <Video className="h-5 w-5 text-blue-600" />
                        )}
                        {meeting.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(meeting.date), "PPP")}
                        </div>
                        {meeting.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {meeting.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {meeting.participants?.length || 0} participants
                        </div>
                        {meetingTasks.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {completedTasks}/{meetingTasks.length} tasks completed
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
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
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(meeting)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Meeting
                          </DropdownMenuItem>
                          {meetingTasks.length > 0 && (
                            <DropdownMenuItem asChild>
                              <a href={`/tasks?meeting=${meeting.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Tasks ({meetingTasks.length})
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(meeting.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Meeting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                {(meeting.participants && meeting.participants.length > 0) && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Participants</h4>
                        <div className="flex flex-wrap gap-1">
                          {meeting.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {meeting.summary && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Summary</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {meeting.summary}
                          </p>
                        </div>
                      )}

                      {meetingTasks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Action Items</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {pendingTasks} Pending
                            </Badge>
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              {completedTasks} Completed
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Meeting Dialog */}
      {editingMeeting && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Meeting</DialogTitle>
              <DialogDescription>
                Update meeting information and details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Meeting Title</Label>
                  <Input
                    id="edit-title"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingMeeting.date}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                    max={today}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-participants">Participants</Label>
                  <Input
                    id="edit-participants"
                    value={editingMeeting.participants}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, participants: e.target.value })}
                    placeholder="Enter names separated by commas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editingMeeting.duration || ""}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, duration: e.target.value })}
                    placeholder="e.g., 1 hour, 30 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-summary">Summary</Label>
                  <Textarea
                    id="edit-summary"
                    value={editingMeeting.summary || ""}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, summary: e.target.value })}
                    placeholder="Meeting summary or notes"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMeeting.isPending}>
                  {updateMeeting.isPending ? "Updating..." : "Update Meeting"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyMeetings;