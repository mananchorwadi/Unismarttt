import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Faculty {
  id: number;
  fullName: string;
  universityId: string;
}

interface CallbackRequest {
  id: number;
  facultyId: number;
  subject: string;
  preferredTime: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: string;
  facultyName: string;
}

export default function RequestCallbackPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    facultyId: "",
    subject: "",
    preferredTime: "",
  });

  // Fetch faculty list
  const { data: facultyList = [], isLoading: facultyLoading } = useQuery<Faculty[]>({
    queryKey: ["/api/faculty"],
  });

  // Fetch student's requests
  const { data: requests = [], isLoading: requestsLoading } = useQuery<CallbackRequest[]>({
    queryKey: ["/api/student/requests"],
    enabled: user?.role === "student",
  });

  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/student/request-callback", {
        ...data,
        facultyId: parseInt(data.facultyId),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request sent successfully",
        description: "Your callback request has been sent to the faculty member.",
      });
      setFormData({ facultyId: "", subject: "", preferredTime: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/student/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.facultyId || !formData.subject || !formData.preferredTime) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    createRequestMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "default",
      Accepted: "secondary",
      Rejected: "destructive",
      Completed: "outline",
    } as const;

    const icons = {
      Pending: <Clock className="h-3 w-3" />,
      Accepted: <CheckCircle className="h-3 w-3" />,
      Rejected: <XCircle className="h-3 w-3" />,
      Completed: <CheckCircle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  if (!user || user.role !== "student") {
    return (
      <DashLayout title="Access Denied" description="Only students can access this page">
        <div className="text-center py-8">
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout 
      title="Request Callback" 
      description="Request a meeting or callback from faculty members"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              New Callback Request
            </CardTitle>
            <CardDescription>
              Fill out the form below to request a callback from a faculty member.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Select Faculty</Label>
                <Select
                  value={formData.facultyId}
                  onValueChange={(value) => setFormData({ ...formData, facultyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a faculty member" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyLoading ? (
                      <SelectItem value="" disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading faculty...
                      </SelectItem>
                    ) : (
                      (facultyList as Faculty[]).map((faculty: Faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id.toString()}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{faculty.fullName} ({faculty.universityId})</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject/Reason</Label>
                <Textarea
                  id="subject"
                  placeholder="Brief description of what you'd like to discuss..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Date & Time</Label>
                <Input
                  id="preferredTime"
                  type="datetime-local"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
            <CardDescription>
              Track the status of your callback requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading requests...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No requests yet. Create your first callback request!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(requests as CallbackRequest[]).map((request: CallbackRequest) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{request.facultyName}</h4>
                        <p className="text-sm text-muted-foreground">{request.subject}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Preferred: {new Date(request.preferredTime).toLocaleString()}</span>
                      <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashLayout>
  );
}