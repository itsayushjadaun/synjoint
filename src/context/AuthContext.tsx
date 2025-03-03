
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function (replace with real API call later)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in a real app, this would be validated by the server
      if (email === 'admin@synjoint.com' && password === 'password') {
        const user = {
          id: '1',
          email: 'admin@synjoint.com',
          name: 'Admin User',
          role: 'admin' as const
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success("Login successful!");
        navigate('/');
      } else if (email === 'user@example.com' && password === 'password') {
        const user = {
          id: '2',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user' as const
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error("Invalid credentials. Try using admin@synjoint.com / password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user' as const
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
