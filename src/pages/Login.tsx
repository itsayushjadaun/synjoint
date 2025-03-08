import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Login = () => {
  const { login, signup, isLoading, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home page if logged in
    }
  }, [user, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginIsLoading, setLoginIsLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupIsLoading, setSignupIsLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(loginEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoginIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      // Note: navigation will be handled by the useEffect when user changes
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoginIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(signupEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setSignupIsLoading(true);
    try {
      const response = await signup(signupName, signupEmail, signupPassword);
      if (response && response.data && !response.error) {
        toast.success("Please check your email to confirm your account.");
      }
      // Note: navigation will be handled by the useEffect when user changes
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setSignupIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // Navigation will be handled in the callback
    } catch (error: any) {
      toast.error(error.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Synjoint</h1>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-synjoint-blue hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90" disabled={loginIsLoading}>
                    {loginIsLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative mt-6 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full">
                    <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                      Sign in with Google
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Fill in your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90" disabled={signupIsLoading}>
                    {signupIsLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
