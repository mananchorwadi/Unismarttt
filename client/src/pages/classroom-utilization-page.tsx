import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, MapPin, Users, Calendar } from "lucide-react";

export default function ClassroomUtilizationPage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  if (!user || user.role !== ROLES.STUDENT) {
    return (
      <DashLayout title="Access Denied" description="This page is only available to students">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">This feature is only available to students.</p>
        </div>
      </DashLayout>
    );
  }

  // Get current time and day as defaults
  useEffect(() => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    setSelectedDay(currentDay);
    setStartTime(currentTime);
    // Set end time to 1 hour later
    const endDate = new Date(now.getTime() + 60 * 60 * 1000);
    setEndTime(endDate.toTimeString().slice(0, 5));
  }, []);

  // Query for free classrooms
  const { data: freeClassrooms, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/free-classrooms', selectedDay, startTime, endTime],
    enabled: !!(selectedDay && startTime && endTime),
    queryFn: async () => {
      const params = new URLSearchParams({
        day: selectedDay,
        startTime,
        endTime
      });
      
      const response = await fetch(`/api/free-classrooms?${params}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch free classrooms');
      }
      
      return response.json();
    }
  });

  // Query for all classrooms and timetable (for display purposes)
  const { data: allClassrooms } = useQuery({
    queryKey: ['/api/classrooms'],
    queryFn: async () => {
      const response = await fetch('/api/classrooms', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch classrooms');
      }
      
      return response.json();
    }
  });

  const handleSearch = () => {
    if (selectedDay && startTime && endTime) {
      refetch();
    }
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  return (
    <DashLayout 
      title="Free Classroom Finder" 
      description="Find available classrooms for your study sessions"
    >
      <div className="space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Free Classrooms
            </CardTitle>
            <CardDescription>
              Search for available classrooms by day and time slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button 
                  onClick={handleSearch}
                  disabled={!selectedDay || !startTime || !endTime || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Searching..." : "Find Free Rooms"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                Error: {error.message}
              </div>
            </CardContent>
          </Card>
        )}

        {freeClassrooms && freeClassrooms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Available Classrooms
                </span>
                <Badge variant="secondary">
                  {freeClassrooms.length} rooms available
                </Badge>
              </CardTitle>
              <CardDescription>
                Free from {formatTime12Hour(startTime)} to {formatTime12Hour(endTime)} on {selectedDay}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {freeClassrooms.map((classroom: any) => (
                  <Card key={classroom.id} className="relative">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{classroom.roomNo}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Available
                          </Badge>
                        </div>
                        
                        {classroom.building && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {classroom.building}
                          </div>
                        )}
                        
                        {classroom.capacity && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Capacity: {classroom.capacity} students
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Free until: {classroom.freeUntil ? formatTime12Hour(classroom.freeUntil) : "End of day"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {freeClassrooms && freeClassrooms.length === 0 && selectedDay && startTime && endTime && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>No classrooms available for the selected time slot</p>
                  <p className="text-sm">Try a different day or time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Classrooms Info */}
        {allClassrooms && (
          <Card>
            <CardHeader>
              <CardTitle>All Classrooms</CardTitle>
              <CardDescription>
                Complete list of available classrooms in the university
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {allClassrooms.map((classroom: any) => (
                  <div key={classroom.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div>
                      <span className="font-medium">{classroom.roomNo}</span>
                      {classroom.building && (
                        <span className="text-sm text-muted-foreground ml-2">• {classroom.building}</span>
                      )}
                    </div>
                    {classroom.capacity && (
                      <Badge variant="outline" className="text-xs">
                        {classroom.capacity} seats
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashLayout>
  );
}