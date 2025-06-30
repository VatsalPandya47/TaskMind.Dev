import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMeetings } from "@/hooks/useMeetings";
import { useZoomMeetings } from "@/hooks/useZoomMeetings";
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  RefreshCw,
  Download
} from "lucide-react";
import { format, isSameDay, addMonths, subMonths, parseISO } from "date-fns";

interface CalendarTabProps {
  onTabChange?: (tab: string) => void;
}

const CalendarTab = ({ onTabChange }: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<'all' | 'zoom' | 'google' | 'manual'>('all');
  
  const { meetings } = useMeetings();
  const { zoomMeetings, syncMeetings } = useZoomMeetings();

  // Transform meetings data into calendar events
  const calendarEvents = useMemo(() => {
    const events: any[] = [];

    // Add regular meetings
    meetings?.forEach(meeting => {
      if (meeting.date) {
        events.push({
          id: meeting.id,
          title: meeting.title || 'Untitled Meeting',
          date: meeting.date,
          startTime: undefined,
          endTime: undefined,
          type: 'manual',
          attendees: meeting.participants ? meeting.participants.length : 0,
        });
      }
    });

    // Add Zoom meetings
    zoomMeetings?.forEach(meeting => {
      if (meeting.start_time) {
        const startDate = new Date(meeting.start_time);
        events.push({
          id: meeting.id,
          title: meeting.topic || 'Zoom Meeting',
          date: format(startDate, 'yyyy-MM-dd'),
          startTime: format(startDate, 'HH:mm'),
          type: 'zoom',
          attendees: 0,
          hasRecording: Boolean(meeting.recording_files),
        });
      }
    });

    return events;
  }, [meetings, zoomMeetings]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return calendarEvents;
    return calendarEvents.filter(event => event.type === filterType);
  }, [calendarEvents, filterType]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter(event => 
      isSameDay(parseISO(event.date), selectedDate)
    );
  }, [filteredEvents, selectedDate]);

  const stats = useMemo(() => {
    const totalMeetings = filteredEvents.length;
    const zoomMeetings = filteredEvents.filter(e => e.type === 'zoom').length;
    const upcomingMeetings = filteredEvents.filter(e => 
      new Date(e.date) > new Date()
    ).length;

    return { totalMeetings, zoomMeetings, upcomingMeetings };
  }, [filteredEvents]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'zoom': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'google': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">📅 Calendar</h1>
          <p className="text-gray-400">View and manage all your synchronized meetings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="zoom">Zoom Only</SelectItem>
              <SelectItem value="google">Google Calendar</SelectItem>
              <SelectItem value="manual">Manual Entries</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => syncMeetings.mutate()}
            disabled={syncMeetings.isPending}
            className="border-gray-700 hover:bg-gray-800 text-white"
          >
            {syncMeetings.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Sync Meetings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Meetings</p>
                <p className="text-2xl font-bold text-white">{stats.totalMeetings}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Zoom Meetings</p>
                <p className="text-2xl font-bold text-white">{stats.zoomMeetings}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Video className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingMeetings}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border-none"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-white",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative text-white hover:bg-gray-700 rounded-md",
                    day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 hover:text-blue-400 rounded-md",
                    day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                    day_today: "bg-gray-700 text-blue-400 font-bold",
                    day_outside: "text-gray-600 opacity-50",
                    day_disabled: "text-gray-600 opacity-50",
                  }}
                  modifiers={{
                    hasEvents: (date) => filteredEvents.some(event => 
                      isSameDay(parseISO(event.date), date)
                    )
                  }}
                  modifiersStyles={{
                    hasEvents: { 
                      backgroundColor: 'rgba(59, 130, 246, 0.3)',
                      color: '#60A5FA',
                      fontWeight: 'bold',
                      border: '1px solid rgba(59, 130, 246, 0.5)'
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Events */}
        <div>
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
                {format(selectedDate, 'MMM d')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedDateEvents.length} meeting{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-3">No meetings scheduled</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => onTabChange?.('meetings')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                    <div className="flex items-start gap-3">
                      {event.type === 'zoom' ? <Video className="h-4 w-4 mt-0.5" /> : <Users className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        <div className="flex items-center gap-3 text-xs mt-1 opacity-80">
                          {event.startTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.startTime}
                            </span>
                          )}
                          {event.attendees && event.attendees > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs border-current">
                            {event.type}
                          </Badge>
                          {event.hasRecording && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                              📹 Recording
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-400" />
            Upcoming Meetings
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your next scheduled meetings from all sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents
              .filter(event => new Date(event.date) >= new Date())
              .slice(0, 6)
              .map((event) => (
                <div key={event.id} className={`p-4 rounded-lg border transition-all hover:scale-105 ${getEventColor(event.type)}`}>
                  <div className="flex items-start gap-3">
                    {event.type === 'zoom' ? <Video className="h-4 w-4 mt-1" /> : <Users className="h-4 w-4 mt-1" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <p className="text-sm opacity-80 mt-1">
                        {format(parseISO(event.date), 'MMM d')}
                        {event.startTime && ` at ${event.startTime}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs border-current">
                          {event.type}
                        </Badge>
                        {event.hasRecording && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                            📹
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {filteredEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 mb-3">No upcoming meetings</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 hover:bg-gray-800 text-white"
                onClick={() => onTabChange?.('meetings')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Your First Meeting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarTab; 