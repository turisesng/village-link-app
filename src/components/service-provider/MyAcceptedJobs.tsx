import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface JobRequest {
  id: string;
  resident_name: string;
  resident_address: string;
  service_description: string;
  available_time: string;
  status: string;
  created_at: string;
}

interface MyAcceptedJobsProps {
  onUpdate: () => void;
}

export function MyAcceptedJobs({ onUpdate }: MyAcceptedJobsProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_requests')
        .select('*')
        .eq('provider_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Job marked as completed!');
      fetchRequests();
      onUpdate();
    } catch (error: any) {
      console.error('Error completing job:', error);
      toast.error(error.message || 'Failed to complete job');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      in_progress: "secondary",
      completed: "outline",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading your jobs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Jobs</CardTitle>
        <CardDescription>Jobs you've accepted</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No accepted jobs yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.resident_name}</TableCell>
                    <TableCell>{request.resident_address}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.service_description}</TableCell>
                    <TableCell>{request.available_time}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(request.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
