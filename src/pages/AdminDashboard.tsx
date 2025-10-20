import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingRequestsTable } from "@/components/admin/OnboardingRequestsTable";
import { GatePermitsTable } from "@/components/admin/GatePermitsTable";
import { BroadcastForm } from "@/components/admin/BroadcastForm";

const AdminDashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingOnboarding: 0,
    pendingGatePermits: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?mode=signin');
      return;
    }

    if (!loading && profile && profile.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      const [onboarding, gatePermits, users] = await Promise.all([
        supabase.from('onboarding_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('gate_permits').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        pendingOnboarding: onboarding.count || 0,
        pendingGatePermits: gatePermits.count || 0,
        totalUsers: users.count || 0,
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

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
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
            Manage estate operations and user requests
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOnboarding}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Gate Permits</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingGatePermits}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="onboarding" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onboarding">
              Onboarding Requests
              {stats.pendingOnboarding > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {stats.pendingOnboarding}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="gate-permits">
              Gate Permits
              {stats.pendingGatePermits > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {stats.pendingGatePermits}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="broadcast">
              <MessageSquare className="mr-2 h-4 w-4" />
              Broadcast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding" className="space-y-4">
            <OnboardingRequestsTable onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="gate-permits" className="space-y-4">
            <GatePermitsTable onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="broadcast" className="space-y-4">
            <BroadcastForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
