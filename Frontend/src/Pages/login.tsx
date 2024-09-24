import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog"; // Import AlertDialog components
import branchFlowImg from "../assets/branchflow.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
const api_base_url = import.meta.env.VITE_API_BASE_URL;

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple front-end validation
    if (username.length < 3 || password.length < 6) {
      setError("Username must be at least 3 characters and password at least 6.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://${api_base_url}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Store the username and UserID in localStorage
        localStorage.setItem('username', data.username);
        localStorage.setItem('userID', data.userID);

        // Clear password for security
        setPassword("");

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* Login Form inside a Card */}
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="bg-white shadow-lg rounded-lg p-8 mx-auto w-[350px]" // Card styles here
          initial={{ y: 300, opacity: 0 }} // Start below the screen
          animate={{ y: 0, opacity: 1 }} // Animate to the center
          transition={{
            type: "spring", // Spring-like animation
            stiffness: 100, // Controls the bounce (higher = stiffer)
            damping: 10, // Controls how fast the spring comes to rest
            duration: 0.8,
          }}
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>

          {/* Error Display with animation */}
          {error && (
            <motion.div
              className="text-red-500 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4" noValidate>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-left">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby="username-error"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-left">Password</Label>
                
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby="password-error"
              />
            </div>
            
            {/* Loading button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
          </form>
          <a
                  href="/forgot-password"
                  className="ml-auto inline-block mt-4 text-md underline"
                >
                  Forgot your password?
                </a>
          {/* Sign Up Link - Trigger for AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <a href="#" className="ml-auto inline-block text-md underline mt-2">
                Don't have an account? Sign up
              </a>
              
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Up Information</AlertDialogTitle>
                <AlertDialogDescription>
                  To sign up for an account, please contact the Operations team.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                <Button>Close</Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>

      {/* Completely Fixed Image Section */}
      <div className="hidden lg:flex items-center justify-center">
        <img
          src={branchFlowImg}
          alt="BranchFlow"
          className="h-[50%] w-[50%] object-contain dark:brightness-[0.2]" // Fixed image, no motion, no transitions
        />
      </div>
    </div>
  );
}
