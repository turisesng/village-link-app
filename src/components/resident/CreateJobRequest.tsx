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
import { Plus } from "lucide-react";

const serviceCategories = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'welder', label: 'Welder' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'gardener', label: 'Gardener' },
  { value: 'other', label: 'Other' },
];

interface CreateJobRequestProps {
  onSuccess?: () => void;
}

export function CreateJobRequest({ onSuccess }: CreateJobRequestProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_category: '',
    service_description: '',
    available_time: '',
    resident_address: profile?.phone_number || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('job_requests')
        .insert([
          {
            resident_id: user.id,
            resident_name: profile.full_name,
            resident_address: formData.resident_address,
            service_category: formData.service_category as any,
            service_description: formData.service_description,
            available_time: formData.available_time,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      toast.success('Job request created successfully!');
      setFormData({
        service_category: '',
        service_description: '',
        available_time: '',
        resident_address: profile?.phone_number || '',
      });
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating job request:', error);
      toast.error(error.message || 'Failed to create job request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Request Service
        </CardTitle>
        <CardDescription>Request a service provider for your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service_category">Service Category</Label>
            <Select
              value={formData.service_category}
              onValueChange={(value) => setFormData({ ...formData, service_category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_description">Description</Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
              placeholder="Describe what you need done"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_time">Available Time</Label>
            <Input
              id="available_time"
              value={formData.available_time}
              onChange={(e) => setFormData({ ...formData, available_time: e.target.value })}
              placeholder="e.g., Weekdays 9AM-5PM"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resident_address">Address</Label>
            <Input
              id="resident_address"
              value={formData.resident_address}
              onChange={(e) => setFormData({ ...formData, resident_address: e.target.value })}
              placeholder="Your address"
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
