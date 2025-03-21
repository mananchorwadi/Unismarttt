import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar, Clock, Users, MapPin, BookOpen, Plus, Download, 
  Filter, ChevronLeft, ChevronRight
} from "lucide-react";

export default function SchedulePage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [filter, setFilter] = useState<string>("all");
  
  if (!user) return <div className="hidden"></div>; // Return empty div instead of null
  
  const isFaculty = user.role === ROLES.FACULTY;
  
  // Get today, tomorrow, and day after tomorrow
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Current week dates
  const getCurrentWeekDates = () => {
    const currentDate = new Date(date);
    const day = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Calculate first day of the week (Sunday)
    const firstDay = new Date(currentDate);
    firstDay.setDate(currentDate.getDate() - day);
    
    // Generate array of dates for the week
    const weekDates = Array(7).fill(null).map((_, i) => {
      const d = new Date(firstDay);
      d.setDate(firstDay.getDate() + i);
      return d;
    });
    
    return weekDates;
  };
  
  const weekDates = getCurrentWeekDates();
  
  // Format time slot
  const formatTimeSlot = (start: string, end: string) => {
    return `${start} - ${end}`;
  };
  
  // Mock schedule data
  const scheduleEvents = [
    // Monday
    {
      id: 1,
      title: "Introduction to Computer Science",
      type: "class",
      day: "Monday",
      location: "H-301",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      instructor: isFaculty ? null : "Dr. Michael Reynolds",
      students: isFaculty ? 35 : null,
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 2,
      title: "Advanced Calculus",
      type: "class",
      day: "Monday",
      location: "S-101",
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      instructor: isFaculty ? null : "Dr. James Wilson",
      students: isFaculty ? 28 : null,
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      id: 3,
      title: "Office Hours",
      type: "office",
      day: "Monday",
      location: "H-220",
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      students: isFaculty ? null : null,
      color: "bg-amber-100 border-amber-300 text-amber-800"
    },
    
    // Tuesday
    {
      id: 4,
      title: "Data Structures and Algorithms",
      type: "class",
      day: "Tuesday",
      location: "H-302",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      instructor: isFaculty ? null : "Dr. Sarah Connor",
      students: isFaculty ? 30 : null,
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      id: 5,
      title: "Department Meeting",
      type: "meeting",
      day: "Tuesday",
      location: "Admin Building, Room A-110",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      attendees: isFaculty ? "All Faculty" : null,
      color: "bg-red-100 border-red-300 text-red-800"
    },
    
    // Wednesday
    {
      id: 6,
      title: "Introduction to Computer Science",
      type: "class",
      day: "Wednesday",
      location: "H-301",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      instructor: isFaculty ? null : "Dr. Michael Reynolds",
      students: isFaculty ? 35 : null,
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 7,
      title: "Advanced Calculus",
      type: "class",
      day: "Wednesday",
      location: "S-101",
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      instructor: isFaculty ? null : "Dr. James Wilson",
      students: isFaculty ? 28 : null,
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      id: 8,
      title: "Study Group",
      type: "study",
      day: "Wednesday",
      location: "Library, Study Room 3",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      participants: isFaculty ? null : "5 students",
      color: "bg-teal-100 border-teal-300 text-teal-800"
    },
    
    // Thursday
    {
      id: 9,
      title: "Data Structures and Algorithms",
      type: "class",
      day: "Thursday",
      location: "H-302",
      startTime: "11:00 AM",
      endTime: "12:30 PM",
      instructor: isFaculty ? null : "Dr. Sarah Connor",
      students: isFaculty ? 30 : null,
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      id: 10,
      title: "Office Hours",
      type: "office",
      day: "Thursday",
      location: "H-220",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      students: isFaculty ? null : null,
      color: "bg-amber-100 border-amber-300 text-amber-800"
    },
    
    // Friday
    {
      id: 11,
      title: "Introduction to Computer Science",
      type: "class",
      day: "Friday",
      location: "H-301",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      instructor: isFaculty ? null : "Dr. Michael Reynolds",
      students: isFaculty ? 35 : null,
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 12,
      title: "Faculty Research Symposium",
      type: "event",
      day: "Friday",
      location: "Conference Center",
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      description: "Annual faculty research presentations",
      color: "bg-indigo-100 border-indigo-300 text-indigo-800"
    },
  ];
  
  // Filter events by day
  const getEventsForDay = (dayName: string) => {
    return scheduleEvents.filter(event => event.day === dayName);
  };
  
  // Filter events by type if filter is active
  const filterEvents = (events: typeof scheduleEvents) => {
    if (filter === "all") return events;
    return events.filter(event => event.type === filter);
  };
  
  // Get today's events
  const todayEvents = filterEvents(getEventsForDay(
    today.toLocaleDateString('en-US', { weekday: 'long' })
  ));
  
  // Get tomorrow's events
  const tomorrowEvents = filterEvents(getEventsForDay(
    tomorrow.toLocaleDateString('en-US', { weekday: 'long' })
  ));
  
  // Get day after tomorrow's events
  const dayAfterEvents = filterEvents(getEventsForDay(
    dayAfter.toLocaleDateString('en-US', { weekday: 'long' })
  ));
  
  // Time slots for the week view
  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  
  // Check if an event falls within a time slot
  const eventInTimeSlot = (event: typeof scheduleEvents[0], timeSlot: string) => {
    const slotHour = parseInt(timeSlot.split(':')[0]);
    const isAM = timeSlot.includes('AM');
    const slotHour24 = isAM ? (slotHour === 12 ? 0 : slotHour) : (slotHour === 12 ? 12 : slotHour + 12);
    
    const eventStartHour = parseInt(event.startTime.split(':')[0]);
    const eventIsAM = event.startTime.includes('AM');
    const eventStartHour24 = eventIsAM ? (eventStartHour === 12 ? 0 : eventStartHour) : (eventStartHour === 12 ? 12 : eventStartHour + 12);
    
    const eventEndHour = parseInt(event.endTime.split(':')[0]);
    const eventEndIsAM = event.endTime.includes('AM');
    const eventEndHour24 = eventEndIsAM ? (eventEndHour === 12 ? 0 : eventEndHour) : (eventEndHour === 12 ? 12 : eventEndHour + 12);
    
    return (eventStartHour24 <= slotHour24 && eventEndHour24 > slotHour24);
  };
  
  // Get events for a day and time slot
  const getEventsForTimeSlot = (day: string, timeSlot: string) => {
    return filterEvents(scheduleEvents).filter(
      event => event.day === day && eventInTimeSlot(event, timeSlot)
    );
  };
  
  // Go to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    setDate(newDate);
  };
  
  // Go to next week
  const goToNextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7);
    setDate(newDate);
  };
  
  // Go to current week
  const goToCurrentWeek = () => {
    setDate(new Date());
  };
  
  // Render event card
  const renderEventCard = (event: typeof scheduleEvents[0]) => {
    return (
      <Card 
        key={event.id} 
        className={`mb-3 border-l-4 ${event.color}`}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{event.title}</h4>
              <Badge variant="outline" className="text-xs">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
            
            <div className="flex flex-col text-sm space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{formatTimeSlot(event.startTime, event.endTime)}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{event.location}</span>
              </div>
              
              {event.instructor && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{event.instructor}</span>
                </div>
              )}
              
              {event.students && (
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{event.students} Students</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashLayout 
      title="Schedule" 
      description="View and manage your academic schedule"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Select value={view} onValueChange={(value) => setView(value as "day" | "week" | "month")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="class">Classes</SelectItem>
                <SelectItem value="office">Office Hours</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="study">Study Groups</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Select Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
            
            {isFaculty && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="week" value={view} className="space-y-4">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {formatDate(date)}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => {
                      const newDate = new Date(date);
                      newDate.setDate(date.getDate() - 1);
                      setDate(newDate);
                    }}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => {
                      const newDate = new Date(date);
                      newDate.setDate(date.getDate() + 1);
                      setDate(newDate);
                    }}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filterEvents(getEventsForDay(
                    date.toLocaleDateString('en-US', { weekday: 'long' })
                  )).length > 0 ? (
                    filterEvents(getEventsForDay(
                      date.toLocaleDateString('en-US', { weekday: 'long' })
                    )).sort((a, b) => {
                      // Sort by time
                      const aTime = a.startTime;
                      const bTime = b.startTime;
                      
                      const aHour = parseInt(aTime.split(':')[0]);
                      const bHour = parseInt(bTime.split(':')[0]);
                      
                      const aAM = aTime.includes('AM');
                      const bAM = bTime.includes('AM');
                      
                      const aHour24 = aAM ? (aHour === 12 ? 0 : aHour) : (aHour === 12 ? 12 : aHour + 12);
                      const bHour24 = bAM ? (bHour === 12 ? 0 : bHour) : (bHour === 12 ? 12 : bHour + 12);
                      
                      return aHour24 - bHour24;
                    }).map(event => renderEventCard(event))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No events scheduled for this day.</p>
                      {isFaculty && (
                        <Button variant="outline" className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Event
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>
                  Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} 
                  - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                      <tr>
                        <th className="w-20 border-r p-2 text-left font-medium text-muted-foreground"></th>
                        {weekDates.map((date, index) => {
                          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayNum = date.getDate();
                          const isCurrentDay = date.toDateString() === new Date().toDateString();
                          
                          return (
                            <th 
                              key={index} 
                              className={`border-r p-2 text-center font-medium text-sm ${
                                isCurrentDay ? 'bg-primary/10' : ''
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                <span className="text-muted-foreground">{dayName}</span>
                                <span className={`w-7 h-7 flex items-center justify-center rounded-full ${
                                  isCurrentDay ? 'bg-primary text-primary-foreground' : ''
                                }`}>
                                  {dayNum}
                                </span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((timeSlot, timeIndex) => (
                        <tr key={timeIndex} className={timeIndex % 2 === 0 ? 'bg-muted/50' : ''}>
                          <td className="border-r p-2 text-xs text-muted-foreground">
                            {timeSlot}
                          </td>
                          {weekDates.map((date, dateIndex) => {
                            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                            const events = getEventsForTimeSlot(dayName, timeSlot);
                            
                            return (
                              <td key={dateIndex} className="border-r p-1 h-20 relative align-top">
                                {events.map(event => (
                                  <div 
                                    key={event.id} 
                                    className={`p-1 text-xs rounded-md border overflow-hidden ${event.color}`}
                                  >
                                    <div className="font-medium truncate">{event.title}</div>
                                    <div className="flex items-center text-xs">
                                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                      <span className="truncate">{formatTimeSlot(event.startTime, event.endTime)}</span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                      <span className="truncate">{event.location}</span>
                                    </div>
                                  </div>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t p-3 flex justify-end">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Schedule
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly View</CardTitle>
                <CardDescription>
                  Coming soon. Please use Day or Week view for now.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Monthly calendar view is under development. 
                    Please use the Day or Week view to see your schedule.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today</CardTitle>
              <CardDescription>
                {formatDate(today)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                todayEvents.map(event => renderEventCard(event))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No events scheduled for today.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tomorrow</CardTitle>
              <CardDescription>
                {formatDate(tomorrow)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tomorrowEvents.length > 0 ? (
                tomorrowEvents.map(event => renderEventCard(event))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No events scheduled for tomorrow.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Day After</CardTitle>
              <CardDescription>
                {formatDate(dayAfter)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dayAfterEvents.length > 0 ? (
                dayAfterEvents.map(event => renderEventCard(event))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No events scheduled for {formatDate(dayAfter)}.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashLayout>
  );
}