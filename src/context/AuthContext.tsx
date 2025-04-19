import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase, authAPI, blogAPI, careerAPI } from '../utils/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  picture?: string;
  count: number;
  profile?: any;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
}

interface CareerPost {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  created_at: string;
  updated_at?: string;
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
  addBlog: (blog: Omit<BlogPost, 'id' | 'author_name' | 'author_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addCareer: (career: Omit<CareerPost, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  refreshBlogs: () => Promise<void>;
  refreshCareers: () => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' ? true : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

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
            
            await refreshBlogs();
            await refreshCareers();
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'USER_UPDATED') {
          if (session?.user) {
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
              
              if (currentUser.email_confirmed_at) {
                toast.success("Email confirmed successfully!");
              }
            }
          }
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
      const { data, error } = await blogAPI.getAll();
      if (error) throw error;
      
      if (data) {
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blog posts');
    }
  };

  const refreshCareers = async () => {
    try {
      const { data, error } = await careerAPI.getAll();
      if (error) throw error;
      
      if (data) {
        setCareers(data);
      }
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
        
        if (error.message && error.message.toLowerCase().includes("email") && error.message.toLowerCase().includes("confirm")) {
          toast.error("Please confirm your email before logging in. Check your inbox (and spam folder).");
          setIsLoading(false);
          return;
        }
        
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

  const addBlog = async (blog: Omit<BlogPost, 'id' | 'author_name' | 'author_id' | 'created_at' | 'updated_at'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add blog posts");
      return;
    }
    
    try {
      const { data, error } = await blogAPI.add({
        title: blog.title,
        content: blog.content,
        image_url: blog.image_url || '/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png'
      });
      
      if (error) throw error;
      
      await refreshBlogs();
      toast.success("Blog post created successfully!");
      navigate('/blogs');
    } catch (error: any) {
      console.error("Error adding blog:", error);
      toast.error(error.message || "Failed to create blog post");
    }
  };

  const addCareer = async (career: Omit<CareerPost, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add career postings");
      return;
    }
    
    try {
      const { data, error } = await careerAPI.add({
        title: career.title,
        description: career.description,
        requirements: career.requirements,
        location: career.location
      });
      
      if (error) throw error;
      
      await refreshCareers();
      toast.success("Career posting created successfully!");
      navigate('/careers');
    } catch (error: any) {
      console.error("Error adding career:", error);
      toast.error(error.message || "Failed to create career posting");
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
      refreshCareers,
      darkMode,
      toggleDarkMode
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
