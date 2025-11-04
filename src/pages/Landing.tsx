import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/RoleCard";
import { Home, Store, Wrench, Bike, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const roles = [
    {
      icon: Home,
      title: "Resident",
      description: "Access stores, services, and delivery within your estate",
      role: "resident",
    },
    {
      icon: Store,
      title: "Store",
      description: "Connect with residents and manage deliveries",
      role: "store",
    },
    {
      icon: Wrench,
      title: "Service Provider",
      description: "Offer your professional services to the community",
      role: "service_provider",
    },
    {
      icon: Bike,
      title: "Dispatch Rider",
      description: "Provide pickup and delivery services",
      role: "rider",
    },
    {
      icon: Shield,
      title: "Estate Admin",
      description: "Manage estate operations and approvals",
      role: "admin",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Home className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Welcome to DoorDash
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Connecting residents, stores, services, and riders within your housing estate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate('/auth?mode=signin')}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate('/auth?mode=signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent" />
      </section>

      {/* Onboarding Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select your role to request access to the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {roles.map((role) => (
              <RoleCard
                key={role.role}
                icon={role.icon}
                title={role.title}
                description={role.description}
                onClick={() => navigate(`/onboarding?role=${role.role}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A seamless platform for estate community management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Request Access</h3>
              <p className="text-muted-foreground">
                Choose your role and submit an onboarding request for admin approval
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Get Approved</h3>
              <p className="text-muted-foreground">
                Estate admin reviews and approves qualified applicants
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-success">3</span>
              </div>
              <h3 className="text-xl font-semibold">Start Connecting</h3>
              <p className="text-muted-foreground">
                Access your dashboard and start connecting with the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 DoorDash Estate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;