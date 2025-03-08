import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase, authAPI } from '../utils/supabase';
import { User, Session } from '@supabase/supabase-js';
import { BlogPost, CareerPost, blogDB, careerDB } from '../utils/db';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  picture?: string;
  count: number;
  profile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{data: any, error: any}>;
  logout: () => void;
  googleLogin: () => Promise<void>;
  blogs: BlogPost[];
  careers: CareerPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'author' | 'authorId' | 'date'>) => Promise<void>;
  addCareer: (career: Omit<CareerPost, 'id' | 'date'>) => Promise<void>;
  refreshBlogs: () => Promise<void>;
  refreshCareers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        const { user, error } = await authAPI.getCurrentUser();
        
        if (error) {
          console.error('Error getting current user:', error);
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || user.profile?.name || user.email?.split('@')[0] || 'User',
            role: user.profile?.role || (user.email?.endsWith('@synjoint.com') ? 'admin' : 'user'),
            picture: user.user_metadata.avatar_url || user.profile?.picture,
            count: user.profile?.count || 1
          });
        }
        
        await refreshBlogs();
        await refreshCareers();
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('There was an error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === 'SIGNED_IN' && session?.user) {
          const { user: currentUser } = await authAPI.getCurrentUser();
          if (currentUser) {
            setUser({
              id: currentUser.id,
              email: currentUser.email || '',
              name: currentUser.user_metadata.name || currentUser.profile?.name || currentUser.email?.split('@')[0] || 'User',
              role: currentUser.profile?.role || (currentUser.email?.endsWith('@synjoint.com') ? 'admin' : 'user'),
              picture: currentUser.user_metadata.avatar_url || currentUser.profile?.picture,
              count: currentUser.profile?.count || 1
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    initializeData();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshBlogs = async () => {
    try {
      const dbBlogs = await blogDB.getAll();
      setBlogs(dbBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blog posts');
    }
  };

  const refreshCareers = async () => {
    try {
      const dbCareers = await careerDB.getAll();
      setCareers(dbCareers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading careers:', error);
      toast.error('Failed to load career posts');
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await authAPI.signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Invalid credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }
      
      if (data?.user) {
        console.log("Login successful, user:", data.user);
        toast.success("Login successful!");
        // Note: User will be set by the auth state change listener
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup for:", email);
      const { data, error } = await authAPI.signUp(email, password, name);
      
      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Signup failed. Please try again.");
        setIsLoading(false);
        return { data: null, error };
      }
      
      if (data?.user) {
        console.log("Signup successful, user:", data.user);
        toast.success("Account created successfully! Please check your email to confirm your account.");
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      console.log("Attempting Google login");
      const { data, error } = await authAPI.signInWithGoogle();
      
      if (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Google login failed. Please try again.");
        return;
      }
      
      // The redirect to the provider's login page happens automatically
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      const { error } = await authAPI.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message || "Logout failed. Please try again.");
        return;
      }
      
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  const addBlog = async (blog: Omit<BlogPost, 'id' | 'author' | 'authorId' | 'date'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add blog posts");
      return;
    }
    
    try {
      const newBlog: BlogPost = {
        ...blog,
        id: Date.now().toString(),
        author: user.name,
        authorId: user.id,
        date: new Date().toISOString().split('T')[0]
      };
      
      await blogDB.add(newBlog);
      await refreshBlogs();
      toast.success("Blog post created successfully!");
      navigate('/blogs');
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to create blog post");
    }
  };

  const addCareer = async (career: Omit<CareerPost, 'id' | 'date'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add career postings");
      return;
    }
    
    try {
      const newCareer: CareerPost = {
        ...career,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      
      await careerDB.add(newCareer);
      await refreshCareers();
      toast.success("Career posting created successfully!");
      navigate('/careers');
    } catch (error) {
      console.error("Error adding career:", error);
      toast.error("Failed to create career posting");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout,
      googleLogin,
      blogs,
      careers,
      addBlog,
      addCareer,
      refreshBlogs,
      refreshCareers
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
