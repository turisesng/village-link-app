import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface RiderRequest {
  id: string;
  pickup_location: string;
  delivery_location: string;
  status: string;
  created_at: string;
}

interface AvailableRiderRequestsProps {
  onUpdate: () => void;
}

export function AvailableRiderRequests({ onUpdate }: AvailableRiderRequestsProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RiderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rider_requests')
        .select('*')
        .is('rider_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: false});

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching rider requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('rider_requests')
        .update({ rider_id: user?.id, status: 'in_progress' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Delivery accepted successfully!');
      fetchRequests();
      onUpdate();
    } catch (error: any) {
      console.error('Error accepting delivery:', error);
      toast.error(error.message || 'Failed to accept delivery');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading available requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Delivery Requests</CardTitle>
        <CardDescription>Accept delivery requests</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No available requests at the moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pickup Location</TableHead>
                  <TableHead>Delivery Location</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.pickup_location}</TableCell>
                    <TableCell>{request.delivery_location}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
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
