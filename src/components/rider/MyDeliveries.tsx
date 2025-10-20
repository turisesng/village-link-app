import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface MyDeliveriesProps {
  onUpdate: () => void;
}

export function MyDeliveries({ onUpdate }: MyDeliveriesProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RiderRequest[]>([]);
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
        .from('rider_requests')
        .select('*')
        .eq('rider_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching my deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('rider_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Delivery marked as completed!');
      fetchRequests();
      onUpdate();
    } catch (error: any) {
      console.error('Error completing delivery:', error);
      toast.error(error.message || 'Failed to complete delivery');
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
          <div className="text-center text-muted-foreground">Loading your deliveries...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Deliveries</CardTitle>
        <CardDescription>Deliveries you've accepted</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No deliveries yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.pickup_location}</TableCell>
                    <TableCell>{request.delivery_location}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
