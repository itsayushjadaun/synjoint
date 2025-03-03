
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { User, BlogPost, CareerPost, userDB, blogDB, careerDB, initializeDB } from '../utils/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (credential: string) => Promise<void>;
  blogs: BlogPost[];
  careers: CareerPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'author' | 'authorId' | 'date'>) => Promise<void>;
  addCareer: (career: Omit<CareerPost, 'id' | 'date'>) => Promise<void>;
  refreshBlogs: () => Promise<void>;
  refreshCareers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const navigate = useNavigate();

  // Initialize database and load data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await initializeDB();
        
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify the user exists in the database
          const dbUser = await userDB.get(parsedUser.id);
          if (dbUser) {
            setUser(dbUser);
          } else {
            // User doesn't exist in db, remove from localStorage
            localStorage.removeItem('user');
          }
        }
        
        // Load blogs and careers
        await refreshBlogs();
        await refreshCareers();
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('There was an error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // Load blogs from the database
  const refreshBlogs = async () => {
    try {
      const dbBlogs = await blogDB.getAll();
      setBlogs(dbBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blog posts');
    }
  };

  // Load careers from the database
  const refreshCareers = async () => {
    try {
      const dbCareers = await careerDB.getAll();
      setCareers(dbCareers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading careers:', error);
      toast.error('Failed to load career posts');
    }
  };

  // User login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would hash passwords and compare hashes
      // Here we're doing a simple check for demo purposes
      if (email === 'admin@synjoint.com' && password === 'password') {
        const user = await userDB.getByEmail('admin@synjoint.com');
        if (user) {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success("Login successful!");
          navigate('/');
        }
      } else if (email === 'user@example.com' && password === 'password') {
        const user = await userDB.getByEmail('user@example.com');
        if (user) {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success("Login successful!");
          navigate('/');
        }
      } else {
        // Check if user exists in database
        const user = await userDB.getByEmail(email);
        if (user) {
          // In a real app, you would verify the password correctly
          // This is just for demo purposes
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success("Login successful!");
          navigate('/');
        } else {
          toast.error("Invalid credentials. Try using admin@synjoint.com / password");
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would validate the credential on your server
      // Here we'll decode the JWT to get the user info
      const payload = JSON.parse(atob(credential.split('.')[1]));
      console.log("Google credential payload:", payload);
      
      // Check if the user already exists
      let existingUser = await userDB.getByEmail(payload.email);
      
      if (existingUser) {
        // Update user picture if it changed
        if (existingUser.picture !== payload.picture) {
          await userDB.update({
            ...existingUser,
            picture: payload.picture
          });
          existingUser = await userDB.get(existingUser.id);
        }
        
        setUser(existingUser!);
        localStorage.setItem('user', JSON.stringify(existingUser));
      } else {
        // Create a new user
        // Check if the email belongs to admin domain
        const isAdmin = payload.email === 'admin@synjoint.com' || payload.email?.endsWith('@synjoint.com');
        
        const newUser: User = {
          id: payload.sub || Date.now().toString(),
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          role: isAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        
        await userDB.add(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      toast.success("Google login successful!");
      navigate('/');
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // User signup
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = await userDB.getByEmail(email);
      if (existingUser) {
        toast.error("A user with this email already exists");
        return;
      }
      
      // In a real app, you would hash the password
      // Check if email is for admin domain
      const isAdmin = email.endsWith('@synjoint.com');
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      
      await userDB.add(newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // User logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/');
  };

  // Add a new blog post
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

  // Add a new career post
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
