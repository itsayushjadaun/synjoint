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
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const { login, signup, isLoading: authIsLoading, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    if (user) {
      console.log("User is already logged in, redirecting to home page", user);
      const redirectUrl = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectUrl); // Redirect based on role
    }
  }, [user, navigate]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setLoginError(null);
    
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(loginEmail)) {
      setLoginError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoginIsLoading(true);
    
    try {
      console.log(`Attempting to login with email: ${loginEmail}`);
      await login(loginEmail, loginPassword);
      // If login is successful, user state will be updated and the useEffect will redirect
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = error.message || "Invalid credentials. Please try again.";
      
      // Check for email not confirmed error
      if (errorMessage.includes("Email not confirmed") || 
          errorMessage.includes("not confirmed") || 
          errorMessage.includes("verification")) {
        errorMessage = "Please check your email and confirm your account before logging in.";
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoginIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setSignupError(null);
    
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(signupEmail)) {
      setSignupError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords don't match!");
      toast.error("Passwords don't match!");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setSignupIsLoading(true);
    try {
      console.log(`Attempting signup with email: ${signupEmail}, name: ${signupName}`);
      const response = await signup(signupName, signupEmail, signupPassword);
      if (response && response.data && !response.error) {
        setSignupComplete(true);
        toast.success("Please check your email to confirm your account.");
      } else if (response && response.error) {
        const errorMessage = response.error.message || "Signup failed. Please try again.";
        setSignupError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.message || "Signup failed. Please try again.";
      setSignupError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSignupIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // Navigation will be handled in the callback
    } catch (error: any) {
      const errorMessage = error.message || "Google login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (signupComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
          <Card className="dark:bg-gray-800 dark:text-white">
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription className="dark:text-gray-300">
                We've sent a confirmation link to your email. Please check your inbox and click the link to complete your registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Once confirmed, you can return to the login page to sign in with your credentials.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full dark:text-white dark:border-gray-600" 
                onClick={() => {
                  setSignupComplete(false);
                }}
              >
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Synjoint</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access your account</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-gray-700">
            <TabsTrigger value="login" className="dark:data-[state=active]:bg-gray-600 dark:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="dark:data-[state=active]:bg-gray-600 dark:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription className="dark:text-gray-300">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={loginIsLoading}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="dark:text-white">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-synjoint-blue hover:underline dark:text-blue-400">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={loginIsLoading}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700 relative z-50"
                    disabled={loginIsLoading || authIsLoading}
                  >
                    {loginIsLoading || authIsLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : "Sign In"}
                  </Button>

                  <div className="relative mt-6 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full dark:bg-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card dark:bg-gray-800 px-2 text-muted-foreground dark:text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full dark:text-white dark:border-gray-600 relative z-50" 
                      onClick={handleGoogleLogin} 
                      disabled={authIsLoading || loginIsLoading}
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription className="dark:text-gray-300">Fill in your details to create a new account</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive">
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-white">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      value={signupName} 
                      onChange={(e) => setSignupName(e.target.value)} 
                      required 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="dark:text-white">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      value={signupEmail} 
                      onChange={(e) => setSignupEmail(e.target.value)} 
                      required 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="dark:text-white">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={signupPassword} 
                      onChange={(e) => setSignupPassword(e.target.value)} 
                      required 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="dark:text-white">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={signupConfirmPassword} 
                      onChange={(e) => setSignupConfirmPassword(e.target.value)} 
                      required 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700 relative z-50" 
                    disabled={signupIsLoading}
                  >
                    {signupIsLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Important: After signing up, you must confirm your email before you can log in.
            Check your inbox (and spam folder) for the confirmation email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
