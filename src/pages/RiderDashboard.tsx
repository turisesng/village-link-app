import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Megaphone, Bike, Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementsView } from "@/components/shared/AnnouncementsView";
import { AvailableRiderRequests } from "@/components/rider/AvailableRiderRequests";
import { MyDeliveries } from "@/components/rider/MyDeliveries";

const RiderDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    availableRequests: 0,
    activeDeliveries: 0,
    completedToday: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?mode=signin');
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [available, active, completed] = await Promise.all([
        supabase.from('rider_requests').select('*', { count: 'exact', head: true }).is('rider_id', null).eq('status', 'pending'),
        supabase.from('rider_requests').select('*', { count: 'exact', head: true }).eq('rider_id', user?.id).eq('status', 'in_progress' as any),
        supabase.from('rider_requests').select('*', { count: 'exact', head: true }).eq('rider_id', user?.id).eq('status', 'completed').gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      ]);

      setStats({
        availableRequests: available.count || 0,
        activeDeliveries: active.count || 0,
        completedToday: completed.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Rider Dashboard</h1>
          <Button onClick={handleSignOut} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {profile.full_name}
          </h2>
          <p className="text-muted-foreground">
            Manage your deliveries
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableRequests}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Available Requests
            </TabsTrigger>
            <TabsTrigger value="my-deliveries">
              My Deliveries
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="mr-2 h-4 w-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <AvailableRiderRequests onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="my-deliveries">
            <MyDeliveries onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RiderDashboard;
