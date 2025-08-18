import { useAuth } from "@/hooks/use-auth";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FacultyRequest {
  id: number;
  studentId: number;
  subject: string;
  preferredTime: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: string;
  studentName: string;
  studentUniversityId: string;
}

export default function FacultyRequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch faculty's requests with proper typing
  const { data: requests, isLoading: requestsLoading } = useQuery<FacultyRequest[]>({
    queryKey: ["/api/faculty/requests"],
    enabled: user?.role === "faculty",
    select: (data: any) => data || [],
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/faculty/request/${requestId}`, { status });
      return res.json();
    },
    onSuccess: (_, { status }) => {
      toast({
        title: "Request updated",
        description: `Request has been marked as ${status.toLowerCase()}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/faculty/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (requestId: number, status: string) => {
    updateStatusMutation.mutate({ requestId, status });
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

  const getStatusCounts = () => {
    if (!requests) return {};
    return requests.reduce((acc: any, req: FacultyRequest) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (!user || user.role !== "faculty") {
    return (
      <DashLayout title="Access Denied" description="Only faculty members can access this page">
        <div className="text-center py-8">
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout 
      title="Requests to Me" 
      description="Manage callback requests from students"
    >
      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Accepted || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Completed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Requests</CardTitle>
          <CardDescription>
            Review and respond to callback requests from students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading requests...</span>
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No requests yet. Students haven't sent any callback requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request: FacultyRequest) => (
                <div key={request.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <h4 className="font-medium">{request.studentName}</h4>
                        <Badge variant="outline">{request.studentUniversityId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.subject}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Preferred: {new Date(request.preferredTime).toLocaleString()}</span>
                    </div>
                    <span>•</span>
                    <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>

                  {request.status === 'Pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, 'Accepted')}
                        disabled={updateStatusMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {request.status === 'Accepted' && (
                    <div className="pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'Completed')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Completed
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashLayout>
  );
}