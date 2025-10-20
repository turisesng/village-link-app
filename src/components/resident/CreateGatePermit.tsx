import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DoorOpen } from "lucide-react";

interface CreateGatePermitProps {
  onSuccess?: () => void;
}

export function CreateGatePermit({ onSuccess }: CreateGatePermitProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject_role: '',
    purpose: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('gate_permits')
        .insert([
          {
            requester_id: user.id,
            subject_role: formData.subject_role as any,
            purpose: formData.purpose,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      toast.success('Gate permit request submitted!');
      setFormData({
        subject_role: '',
        purpose: '',
      });
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating gate permit:', error);
      toast.error(error.message || 'Failed to create gate permit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5" />
          Request Gate Permit
        </CardTitle>
        <CardDescription>Request access for visitors or service providers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject_role">Visitor Type</Label>
            <Select
              value={formData.subject_role}
              onValueChange={(value) => setFormData({ ...formData, subject_role: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visitor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service_provider">Service Provider</SelectItem>
                <SelectItem value="store">Store Delivery</SelectItem>
                <SelectItem value="rider">Dispatch Rider</SelectItem>
                <SelectItem value="resident">Guest/Visitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Reason for visit"
              rows={3}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
