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

interface AvailableJobRequestsProps {
  onUpdate: () => void;
  serviceCategory: string;
}

export function AvailableJobRequests({ onUpdate, serviceCategory }: AvailableJobRequestsProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [serviceCategory]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_requests')
        .select('*')
        .is('provider_id', null)
        .eq('status', 'pending')
        .eq('service_category', serviceCategory as any)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching job requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ provider_id: user?.id, status: 'in_progress' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Job accepted successfully!');
      fetchRequests();
      onUpdate();
    } catch (error: any) {
      console.error('Error accepting job:', error);
      toast.error(error.message || 'Failed to accept job');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading available jobs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Jobs</CardTitle>
        <CardDescription>Jobs matching your service category</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No available jobs at the moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Available Time</TableHead>
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
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
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
