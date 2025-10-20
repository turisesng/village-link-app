import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface GatePermit {
  id: string;
  requester_id: string;
  subject_id?: string;
  subject_role: string;
  purpose?: string;
  status: string;
  created_at: string;
}

interface GatePermitsTableProps {
  onUpdate: () => void;
}

export function GatePermitsTable({ onUpdate }: GatePermitsTableProps) {
  const [permits, setPermits] = useState<GatePermit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gate_permits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPermits(data || []);
    } catch (error) {
      console.error('Error fetching permits:', error);
      toast.error('Failed to load gate permits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (permit: GatePermit) => {
    try {
      const { error } = await supabase
        .from('gate_permits')
        .update({ status: 'approved' })
        .eq('id', permit.id);

      if (error) throw error;

      toast.success('Gate permit approved');
      fetchPermits();
      onUpdate();
    } catch (error: any) {
      console.error('Error approving permit:', error);
      toast.error(error.message || 'Failed to approve permit');
    }
  };

  const handleReject = async (permit: GatePermit) => {
    try {
      const { error } = await supabase
        .from('gate_permits')
        .update({ status: 'rejected' })
        .eq('id', permit.id);

      if (error) throw error;

      toast.success('Gate permit rejected');
      fetchPermits();
      onUpdate();
    } catch (error: any) {
      console.error('Error rejecting permit:', error);
      toast.error(error.message || 'Failed to reject permit');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      approved: "secondary",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading gate permits...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gate Permits</CardTitle>
        <CardDescription>Manage gate access requests</CardDescription>
      </CardHeader>
      <CardContent>
        {permits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No gate permits found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Role</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell className="capitalize">
                      {permit.subject_role.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{permit.purpose || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(permit.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(permit.status)}</TableCell>
                    <TableCell>
                      {permit.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(permit)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(permit)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
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
