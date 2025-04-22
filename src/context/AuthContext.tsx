
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

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

  // Simplified initialization for more reliability
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, session);
            
            if (session?.user) {
              // Use setTimeout to prevent possible deadlocks
              setTimeout(async () => {
                try {
                  const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();
                    
                  if (userError) {
                    console.error('Error fetching user data:', userError);
                    return;
                  }
                  
                  setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || 
                          userData?.name || 
                          session.user.email?.split('@')[0] || 
                          'User',
                    role: userData?.role || 
                          (session.user.email?.endsWith('@synjoint.com') ? 'admin' : 'user'),
                    picture: session.user.user_metadata?.avatar_url || userData?.picture,
                    count: userData?.count || 1,
                    profile: userData
                  });
                  
                  if (event === 'SIGNED_IN') {
                    toast.success('Signed in successfully!');
                  } else if (event === 'USER_UPDATED' && session.user.email_confirmed_at) {
                    toast.success('Email confirmed successfully!');
                  }
                  
                  await refreshBlogs();
                  await refreshCareers();
                } catch (error) {
                  console.error('Error handling auth state change:', error);
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
          }
        );
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (userError) {
            console.error('Error fetching user data:', userError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 
                  userData?.name || 
                  session.user.email?.split('@')[0] || 
                  'User',
            role: userData?.role || 
                  (session.user.email?.endsWith('@synjoint.com') ? 'admin' : 'user'),
            picture: session.user.user_metadata?.avatar_url || userData?.picture,
            count: userData?.count || 1,
            profile: userData
          });
        }
        
        await refreshBlogs();
        await refreshCareers();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      // Cleanup will be handled by the subscription.unsubscribe() in the onAuthStateChange return
    };
  }, []);

  const refreshBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
        
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
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });
        
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
    try {
      console.log("Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        if (error.message && error.message.toLowerCase().includes("email") && 
            error.message.toLowerCase().includes("confirm")) {
          toast.error("Please confirm your email before logging in. Check your inbox (and spam folder).");
          throw error;
        }
        
        throw error;
      }
      
      // Auth state change listener will handle setting the user
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log("Attempting signup for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        return { data: null, error };
      }
      
      if (data?.user) {
        console.log("Signup successful, user:", data.user);
        toast.success("Account created successfully! Please check your email to confirm your account.");
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { data: null, error };
    }
  };

  const googleLogin = async () => {
    try {
      console.log("Attempting Google login");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?provider=google`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Google login failed. Please try again.");
        throw error;
      }
      
      // The redirect happens automatically
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed. Please try again.");
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting logout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error(error.message || "Logout failed. Please try again.");
        throw error;
      }
      
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addBlog = async (blog: Omit<BlogPost, 'id' | 'author_name' | 'author_id' | 'created_at' | 'updated_at'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add blog posts");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert({
          title: blog.title,
          content: blog.content,
          image_url: blog.image_url || '/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png'
        })
        .select();
      
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
      const { data, error } = await supabase
        .from('careers')
        .insert({
          title: career.title,
          description: career.description,
          requirements: career.requirements,
          location: career.location
        })
        .select();
      
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
