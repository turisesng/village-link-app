import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Component displayed to users after they successfully submit their onboarding form,
 * informing them their account is pending admin approval.
 */
const AwaitingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            {/* Display a pending/loader icon */}
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl">
            Application Submitted!
          </CardTitle>
          <CardDescription className="text-md text-gray-700">
            Thank you for registering. Your application is currently **under review** by the administration team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-500">
            You will receive an email notification as soon as your account status is updated to **approved**.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
            <p className="text-sm text-blue-700 font-medium">
              Access to the system is restricted until your profile is approved.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/auth?mode=signin')} 
            className="w-full"
            variant="outline"
          >
            Go to Sign In Page <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwaitingApproval;