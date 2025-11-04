import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { authHelpers, UserRole } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

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

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = searchParams.get('role') as UserRole || 'resident';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: roleParam,
    is_outside_estate: false,
    service_category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authHelpers.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: formData.role,
          is_outside_estate: formData.is_outside_estate,
          service_category: formData.service_category || undefined,
        }
      );
      
      toast.success('Request submitted! Awaiting admin approval.');
      navigate('/auth?mode=signin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = (role: string) => {
    const titles: Record<string, string> = {
      resident: 'Resident',
      store: 'Store',
      service_provider: 'Service Provider',
      rider: 'Dispatch Rider',
      admin: 'Estate Admin',
    };
    return titles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 py-12">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-primary-foreground hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">
              {getRoleTitle(formData.role)} Registration
            </CardTitle>
            <CardDescription>
              Submit your request to join the DoorDash Estate platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                    <SelectItem value="rider">Dispatch Rider</SelectItem>
                    <SelectItem value="admin">Estate Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              {formData.role === 'service_provider' && (
                <div className="space-y-2">
                  <Label htmlFor="service_category">Service Category</Label>
                  <Select
                    value={formData.service_category}
                    onValueChange={(value) => setFormData({ ...formData, service_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outside_estate"
                  checked={formData.is_outside_estate}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_outside_estate: checked as boolean })
                  }
                />
                <Label htmlFor="outside_estate" className="text-sm font-normal">
                  I am located outside the estate
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading} variant="hero">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth?mode=signin')}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;