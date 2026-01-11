import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Check, Clock, FileText, Search, UserPlus, X, BarChart3 } from "lucide-react";

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5000/api';

// --- API Client ---
class AttendanceAPI {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      return await response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      return { success: false, message: 'Cannot connect to the local server. Please ensure it is running.' };
    }
  }

  static startAttendance(lectureData) {
    return this.request('/start-camera', { method: 'POST', body: JSON.stringify(lectureData) });
  }

  static stopAttendance() {
    return this.request('/stop-camera', { method: 'POST' });
  }

  static registerStudent(studentData) {
    return this.request('/register-student', { method: 'POST', body: JSON.stringify(studentData) });
  }

  static getRegistrationStatus() {
    return this.request('/registration-status');
  }

  static getSystemStatus() {
    return this.request('/status');
  }

  static healthCheck() {
    return this.request('/health');
  }

  static getAttendanceReport(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/attendance-report?${queryParams}`);
  }
}

// --- Main Component ---
export default function AttendancePage() {
  const { user } = useAuth();
  const [systemStatus, setSystemStatus] = useState({ camera_running: false, registration_running: false });
  const [serverConnected, setServerConnected] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({ student_id: '', name: '', department: '' });
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);

  // --- Constants as per your request ---
  const TOTAL_STUDENTS_IN_CLASS = 66;

  // Mock class data
  const classes = [
    { id: "QR101", name: "Quantum Computing", schedule: "Mon/Wed 11:00 AM" },
    { id: "DS303", name: "Data Structures", schedule: "Tue/Thu 2:00 PM" },
    { id: "AI202", name: "Advanced AI", schedule: "Fri 9:00 AM" },
  ];

  // --- Effects ---
  useEffect(() => {
    const checkServer = async () => {
      const health = await AttendanceAPI.healthCheck();
      const isConnected = health.status === 'healthy';
      setServerConnected(isConnected);
      if (isConnected) {
        const status = await AttendanceAPI.getSystemStatus();
        setSystemStatus(status);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Helper Function ---
  const formatDateForId = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- API Handlers ---
  const handleStartAttendance = async () => {
    if (!selectedClass) {
      setApiMessage('Please select a class first.');
      return;
    }

    setLoading(true);
    setApiMessage('Starting attendance system...');
    setAttendanceData([]); // Clear previous logs

    const lectureData = {
      lecture_id: `${selectedClass}_${formatDateForId(selectedDate)}`, // <-- THE FIX IS HERE
      course_code: selectedClass,
      instructor: user?.name || "Prof. Michael Brown", // Fetch from profile or use default
      room: "A-317", // Default room
    };

    const result = await AttendanceAPI.startAttendance(lectureData);

    if (result.success) {
      setApiMessage(`Attendance started for ${lectureData.course_code} in room ${lectureData.room}.\nLecture ID: ${result.lecture_id}`);
    } else {
      setApiMessage(`Error starting attendance: ${result.message}`);
    }
    setLoading(false);
  };

  const handleStopAttendance = async () => {
    setLoading(true);
    setApiMessage('Stopping attendance system...');
    const result = await AttendanceAPI.stopAttendance();

    if (result.success) {
      setApiMessage(`Attendance stopped.\nTotal students marked: ${result.attendance_count}`);

      if (result.lecture_id) {
        const report = await AttendanceAPI.getAttendanceReport({ lecture_id: result.lecture_id });
        if (report.success) {
          const realAttendanceData = report.data.map((record, index) => ({
            id: index + 1,
            name: record.student_id,
            studentId: record.student_id,
            status: "present",
            timeIn: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            verificationMethod: "face",
          }));
          setAttendanceData(realAttendanceData);
        }
      }
    } else {
      setApiMessage(`Error stopping attendance: ${result.message}`);
    }
    setLoading(false);
  };

  const handleRegisterStudent = async () => {
    if (!registrationForm.student_id || !registrationForm.name || !registrationForm.department) {
      setApiMessage('Please fill all registration fields.');
      return;
    }
    setLoading(true);
    setApiMessage(`Starting registration for ${registrationForm.name}...`);
    const result = await AttendanceAPI.registerStudent(registrationForm);

    if (result.success) {
      setApiMessage('Registration process started. A camera window will open. Please follow the instructions there.');
      const poll = setInterval(async () => {
        const status = await AttendanceAPI.getRegistrationStatus();
        if (status.status === 'completed') {
          setApiMessage(`Registration successful for ${registrationForm.name}!`);
          clearInterval(poll);
          setLoading(false);
          setShowRegistrationForm(false);
          setRegistrationForm({ student_id: '', name: '', department: '' });
        } else if (status.status === 'failed') {
          setApiMessage(`Registration failed: ${status.error}`);
          clearInterval(poll);
          setLoading(false);
        }
      }, 3000);
    } else {
      setApiMessage(`Error starting registration: ${result.message}`);
      setLoading(false);
    }
  };

  // --- Statistics Calculation (Updated Logic) ---
  const presentCount = attendanceData.length;
  const absentCount = TOTAL_STUDENTS_IN_CLASS - presentCount;
  const presentPercentage = TOTAL_STUDENTS_IN_CLASS > 0 ? Math.round((presentCount / TOTAL_STUDENTS_IN_CLASS) * 100) : 0;

  const attendanceStats = {
    present: presentCount,
    late: 0,
    absent: absentCount < 0 ? 0 : absentCount,
    total: TOTAL_STUDENTS_IN_CLASS,
  };

  return (
    <DashLayout title="Smart Attendance" description="AI-powered attendance tracking system">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
            <CardDescription>Track attendance for your classes with AI facial recognition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!serverConnected ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <strong>Backend Server Not Running.</strong> Please start it with: <code className="bg-red-100 px-1 rounded">python api_server.py</code>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                <strong>System Status:</strong> Camera {systemStatus.camera_running ? '🟢 Active' : '⚪ Stopped'} | Registration {systemStatus.registration_running ? '🟡 In Progress' : '⚪ Ready'}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="class-select">Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass} disabled={systemStatus.camera_running}>
                  <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus /></PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Attendance Control</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleStartAttendance} disabled={loading || !serverConnected || systemStatus.camera_running || !selectedClass} className="flex-1 min-w-[150px]">Start Attendance</Button>
                <Button variant="destructive" onClick={handleStopAttendance} disabled={loading || !serverConnected || !systemStatus.camera_running} className="flex-1 min-w-[150px]">Stop Attendance</Button>
                <Button variant="outline" onClick={() => setShowRegistrationForm(!showRegistrationForm)} disabled={loading || !serverConnected || systemStatus.registration_running} className="flex-1 min-w-[150px]"><UserPlus className="mr-2 h-4 w-4" /> Register Student</Button>
              </div>
            </div>

            {showRegistrationForm && (
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Register New Student</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Student ID" value={registrationForm.student_id} onChange={(e) => setRegistrationForm({...registrationForm, student_id: e.target.value})} disabled={loading} />
                  <Input placeholder="Full Name" value={registrationForm.name} onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})} disabled={loading} />
                  <Input placeholder="Department" value={registrationForm.department} onChange={(e) => setRegistrationForm({...registrationForm, department: e.target.value})} disabled={loading} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRegisterStudent} disabled={loading}>Start Face Registration</Button>
                  <Button variant="outline" onClick={() => setShowRegistrationForm(false)} disabled={loading}>Cancel</Button>
                </div>
              </div>
            )}

            {apiMessage && <div className="border rounded-lg p-4 bg-gray-50"><pre className="whitespace-pre-wrap text-sm font-medium">{apiMessage}</pre></div>}

            <div className="border rounded-lg">
              <div className="p-4 border-b"><h3 className="font-medium">Attendance Logs</h3></div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.length > 0 ? attendanceData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Present</span></TableCell>
                      <TableCell>{student.timeIn}</TableCell>
                      <TableCell><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">AI</span></TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="text-center">No attendance marked yet for this session.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
            <CardDescription>{selectedClass ? `${classes.find(c => c.id === selectedClass)?.name}` : "Select a class"}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">Overall Attendance</span><span className="text-sm font-medium">{presentPercentage}%</span></div>
                  <Progress value={presentPercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-3 text-center"><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p></div>
                  <div className="rounded-lg border p-3 text-center"><p className="text-sm text-muted-foreground">Late</p><p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p></div>
                  <div className="rounded-lg border p-3 text-center"><p className="text-sm text-muted-foreground">Absent</p><p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p></div>
                </div>
                <div className="space-y-2 pt-4">
                  <h4 className="text-sm font-medium">Class Information</h4>
                  <div className="rounded-lg border divide-y">
                    <div className="px-4 py-3 flex justify-between"><span className="text-sm text-muted-foreground">Total Students</span><span className="text-sm font-medium">{attendanceStats.total}</span></div>
                    <div className="px-4 py-3 flex justify-between"><span className="text-sm text-muted-foreground">Instructor</span><span className="text-sm font-medium">{user?.name || "Prof. M. Brown"}</span></div>
                    <div className="px-4 py-3 flex justify-between"><span className="text-sm text-muted-foreground">Room</span><span className="text-sm font-medium">A-317</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center"><BarChart3 className="mx-auto h-12 w-12 opacity-50" /><p className="mt-2">Select a class to view statistics</p></div>
              </div>
            )}
          </CardContent>
          {selectedClass && <CardFooter><Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" /> Generate Report</Button></CardFooter>}
        </Card>
      </div>
    </DashLayout>
  );
}
