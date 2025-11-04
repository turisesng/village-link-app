import { Toaster } from "./components/ui/toaster"; // Switched to relative path
import { Toaster as Sonner } from "./components/ui/sonner"; // Switched to relative path
import { TooltipProvider } from "./components/ui/tooltip"; // Switched to relative path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth"; // Switched to relative path
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Onboarding from "./pages/Onboarding";
import AwaitingApproval from "./pages/AwaitingApproval";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentDashboard from "./pages/ResidentDashboard";
import StoreDashboard from "./pages/StoreDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Destination after successful onboarding submission, pending admin review */}
            <Route path="/awaiting-approval" element={<AwaitingApproval />} />

            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} /> 
            <Route path="/admin/approvals" element={<AdminDashboard />} />
            
            {/* Role-Specific Dashboard Routes */}
            <Route path="/resident" element={<ResidentDashboard />} />
            <Route path="/store" element={<StoreDashboard />} />
            <Route path="/service-provider" element={<ServiceProviderDashboard />} />
            <Route path="/rider" element={<RiderDashboard />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
