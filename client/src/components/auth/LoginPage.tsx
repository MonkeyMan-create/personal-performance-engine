import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Dumbbell } from "lucide-react";

export function LoginPage() {
  const { signIn, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Personal Performance Engine</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your intelligent training partner for fitness success
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Advanced workout logging with RIR tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                AI-powered fitness coaching
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Nutrition tracking with macro counting
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Body metrics and progress charts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Offline-first design for gym use
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={signIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12"
            data-testid="button-google-signin"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Secure authentication powered by Firebase
          </p>
        </CardContent>
      </Card>
    </div>
  );
}