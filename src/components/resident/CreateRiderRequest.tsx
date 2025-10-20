import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bike } from "lucide-react";

interface CreateRiderRequestProps {
  onSuccess?: () => void;
}

export function CreateRiderRequest({ onSuccess }: CreateRiderRequestProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_location: '',
    delivery_location: '',
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
        .from('rider_requests')
        .insert([
          {
            requester_id: user.id,
            pickup_location: formData.pickup_location,
            delivery_location: formData.delivery_location,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      toast.success('Delivery request submitted!');
      setFormData({
        pickup_location: '',
        delivery_location: '',
      });
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating rider request:', error);
      toast.error(error.message || 'Failed to create delivery request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bike className="h-5 w-5" />
          Request Delivery
        </CardTitle>
        <CardDescription>Request a dispatch rider for delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickup_location">Pickup Location</Label>
            <Input
              id="pickup_location"
              value={formData.pickup_location}
              onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
              placeholder="Where should the rider pick up?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_location">Delivery Location</Label>
            <Input
              id="delivery_location"
              value={formData.delivery_location}
              onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
              placeholder="Where should it be delivered?"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Bike className="mr-2 h-4 w-4" />
            {loading ? 'Submitting...' : 'Request Rider'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
