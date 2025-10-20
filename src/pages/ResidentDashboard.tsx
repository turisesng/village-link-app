import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Megaphone, Briefcase, DoorOpen, Bike } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementsView } from "@/components/shared/AnnouncementsView";
import { CreateJobRequest } from "@/components/resident/CreateJobRequest";
import { CreateGatePermit } from "@/components/resident/CreateGatePermit";
import { CreateRiderRequest } from "@/components/resident/CreateRiderRequest";
import { MyJobRequests } from "@/components/resident/MyJobRequests";

const ResidentDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    pendingPermits: 0,
    unreadAnnouncements: 0,
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
      const [jobs, permits, announcements] = await Promise.all([
        supabase.from('job_requests').select('*', { count: 'exact', head: true }).eq('resident_id', user?.id).in('status', ['pending', 'in_progress'] as any),
        supabase.from('gate_permits').select('*', { count: 'exact', head: true }).eq('requester_id', user?.id).eq('status', 'pending'),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        activeJobs: jobs.count || 0,
        pendingPermits: permits.count || 0,
        unreadAnnouncements: announcements.count || 0,
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
          <h1 className="text-2xl font-bold text-primary">Resident Dashboard</h1>
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
            Manage your estate services and requests
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Permits</CardTitle>
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPermits}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadAnnouncements}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="announcements">
              <Megaphone className="mr-2 h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="services">
              <Briefcase className="mr-2 h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="gate-permits">
              <DoorOpen className="mr-2 h-4 w-4" />
              Gate Permits
            </TabsTrigger>
            <TabsTrigger value="delivery">
              <Bike className="mr-2 h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <AnnouncementsView />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <CreateJobRequest onSuccess={fetchStats} />
            <MyJobRequests />
          </TabsContent>

          <TabsContent value="gate-permits">
            <CreateGatePermit onSuccess={fetchStats} />
          </TabsContent>

          <TabsContent value="delivery">
            <CreateRiderRequest />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ResidentDashboard;
