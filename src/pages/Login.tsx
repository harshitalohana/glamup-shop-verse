
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect to appropriate dashboard based on user role
        // This will happen automatically in the AuthContext
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  // Sample users for demo purposes
  const demoUsers = [
    { email: "admin@glamup.com", password: "Admin user (use in form)" },
    { email: "user@example.com", password: "Regular user (use in form)" },
  ];

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
        <div className="w-full max-w-md p-4">
          <Card className="border-glamup-purple/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login to GlamUp</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glamup-input"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-glamup-purple hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glamup-input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full glamup-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              {/* Demo users info - this would be removed in production */}
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium mb-2">Demo Accounts:</p>
                <ul className="text-xs space-y-1">
                  {demoUsers.map((user, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-gray-500">{user.password}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-glamup-purple hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
