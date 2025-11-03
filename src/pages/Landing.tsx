import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/RoleCard";
import { Home, Store, Wrench, Bike } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
        {/* ... other hero content */}
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            {/* ... hero text and icon */}
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Welcome to DoorDash
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Connecting Residents, Stores, Service Providers, and Dispatch Riders within the Estate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/auth?mode=signin")}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() =>
                  document
                    .getElementById("onboarding-section") // <--- CHANGED HERE
                    ?.scrollIntoView({ behavior: "smooth" }) // <--- CHANGED HERE
                }
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent" />
      </section>

      {/* Choose Your Role Section */}
      <section id="onboarding-section" className="py-16 px-4"> {/* <--- CHANGED HERE */}
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select your role to request access to the platform
            </p>
          </div>

          {/* 2x2 Grid Layout */}
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
            <div className="w-full max-w-xs">
              <RoleCard
                icon={Home}
                title="Resident"
                description="Access stores, services, and delivery within your estate"
                onClick={() => navigate("/onboarding?role=resident")}
              />
            </div>
            <div className="w-full max-w-xs">
              <RoleCard
                icon={Store}
                title="Store"
                description="Connect with residents and manage deliveries"
                onClick={() => navigate("/onboarding?role=store")}
              />
            </div>
            <div className="w-full max-w-xs">
              <RoleCard
                icon={Wrench}
                title="Service Provider"
                description="Offer your professional services to the community"
                onClick={() => navigate("/onboarding?role=service_provider")}
              />
            </div>
            <div className="w-full max-w-xs">
              <RoleCard
                icon={Bike}
                title="Dispatch Rider"
                description="Provide pickup and delivery services"
                onClick={() => navigate("/onboarding?role=rider")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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

     {/* Visualization Section */}
<section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-emerald-50 overflow-hidden">
  <div className="container mx-auto text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
      Estate Ecosystem Visualization
    </h2>
    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
      A visual representation of how Residents, Stores, Riders, and Service Providers interact in harmony.
    </p>
  </div>

  <div className="relative w-full max-w-[950px] h-[650px] mx-auto flex items-center justify-center">
    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 900 650">
      <defs>
        <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
        </marker>

        <linearGradient id="gradResidentStore" x1="450" y1="120" x2="200" y2="300">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="gradStoreRider" x1="200" y1="300" x2="200" y2="520">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="gradResidentProvider" x1="450" y1="120" x2="700" y2="300">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="gradProviderRider" x1="700" y1="300" x2="200" y2="520">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="gradResidentRider" x1="450" y1="120" x2="200" y2="520">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      <style>
        {`
          path {
            stroke-width: 3;
            fill: none;
            stroke-dasharray: 14 10;
            animation: dashFlow 6s linear infinite;
          }

          @keyframes dashFlow {
            to { stroke-dashoffset: -50; }
          }

          .label {
            font-size: 14px;
            font-weight: 600;
            text-anchor: middle;
            dominant-baseline: middle;
            opacity: 0;
            transform-origin: center;
            animation: fadeLabel 10s ease-in-out infinite;
          }

          @keyframes fadeLabel {
            0%, 15% { opacity: 0; transform: scale(0.95); }
            20%, 35% { opacity: 1; transform: scale(1); }
            40%, 100% { opacity: 0; transform: scale(0.95); }
          }

          .label-1 { animation-delay: 0s; }
          .label-2 { animation-delay: 2s; }
          .label-3 { animation-delay: 4s; }
          .label-4 { animation-delay: 6s; }
          .label-5 { animation-delay: 8s; }
        `}
      </style>

      {/* Connection Paths */}
      <path d="M450,120 Q260,200 200,300" stroke="url(#gradResidentStore)" markerEnd="url(#arrow)" />
      <path d="M200,300 Q200,410 200,520" stroke="url(#gradStoreRider)" markerEnd="url(#arrow)" />
      <path d="M450,120 Q640,200 700,300" stroke="url(#gradResidentProvider)" markerEnd="url(#arrow)" />
      <path d="M700,300 Q450,400 200,520" stroke="url(#gradProviderRider)" markerEnd="url(#arrow)" />
      <path d="M450,120 Q325,320 200,520" stroke="url(#gradResidentRider)" markerEnd="url(#arrow)" />

      {/* Relationship Labels (Sequential Fade-in) */}
      <text x="320" y="190" className="label label-1" fill="#2563eb" transform="rotate(-25 320,190)">
        orders
      </text>
      <text x="210" y="420" className="label label-2" fill="#f59e0b" transform="rotate(90 210,420)">
        dispatches
      </text>
      <text x="640" y="200" className="label label-3" fill="#10b981" transform="rotate(25 640,200)">
        requests
      </text>
      <text x="430" y="420" className="label label-4" fill="#ef4444" transform="rotate(-25 430,420)">
        delivers
      </text>
      <text x="310" y="300" className="label label-5" fill="#2563eb" transform="rotate(-40 310,300)">
        receives
      </text>
    </svg>

    {/* Role Nodes */}
    <div className="absolute left-1/2 top-[5%] -translate-x-1/2 bg-blue-600 text-white w-40 h-40 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:scale-110 transition">
      <div className="text-4xl mb-2">👤</div>
      <div className="font-bold text-lg">Resident</div>
    </div>

    <div className="absolute left-[5%] top-[35%] bg-amber-500 text-white w-40 h-40 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:scale-110 transition">
      <div className="text-4xl mb-2">🏪</div>
      <div className="font-bold text-lg">Store</div>
    </div>

    <div className="absolute right-[5%] top-[35%] bg-emerald-500 text-white w-40 h-40 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:scale-110 transition">
      <div className="text-4xl mb-2">🧰</div>
      <div className="font-bold text-lg">Service Provider</div>
    </div>

    <div className="absolute left-[5%] bottom-[5%] bg-red-500 text-white w-40 h-40 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:scale-110 transition">
      <div className="text-4xl mb-2">🚴</div>
      <div className="font-bold text-lg">Rider</div>
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
