
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Search, Video, Users } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: string[];
  duration: string;
  hasRecording: boolean;
  summary?: string;
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Q3 Product Planning",
    date: "2025-06-10",
    participants: ["Alice", "Bob", "Charlie"],
    duration: "45 min",
    hasRecording: true,
    summary: "Discussed Q3 roadmap and feature priorities"
  },
  {
    id: "2",
    title: "Marketing Strategy Review",
    date: "2025-06-08",
    participants: ["Diana", "Edward", "Alice"],
    duration: "30 min",
    hasRecording: true,
    summary: "Reviewed campaign performance and budget allocation"
  },
  {
    id: "3",
    title: "Team Standup",
    date: "2025-06-07",
    participants: ["Bob", "Charlie", "Diana"],
    duration: "15 min",
    hasRecording: false
  }
];

const MeetingsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [meetings] = useState<Meeting[]>(mockMeetings);

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <Button>
          <Video className="w-4 h-4 mr-2" />
          Connect Zoom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Meeting History
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search meetings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meeting.title}</div>
                      {meeting.summary && (
                        <div className="text-sm text-gray-500 mt-1">{meeting.summary}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{meeting.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{meeting.participants.join(", ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>{meeting.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      meeting.hasRecording 
                        ? "bg-green-100 text-green-600" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {meeting.hasRecording ? "Processed" : "No Recording"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsTab;
