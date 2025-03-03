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

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await initializeDB();
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const dbUser = await userDB.get(parsedUser.id);
          if (dbUser) {
            setUser(dbUser);
          } else {
            localStorage.removeItem('user');
          }
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
    
    initializeData();
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = await userDB.getByEmail(email);
      
      if (user && user.password === password) {
        if (typeof user.count === 'number') {
          await userDB.update({
            ...user,
            count: user.count + 1
          });
        }
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error("Invalid credentials. Please check your email and password.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      console.log("Google credential payload:", payload);
      
      let existingUser = await userDB.getByEmail(payload.email);
      
      if (existingUser) {
        const updates: Partial<User> & { id: string } = {
          ...existingUser,
          count: (existingUser.count || 0) + 1
        };
        
        if (existingUser.picture !== payload.picture) {
          updates.picture = payload.picture;
        }
        
        await userDB.update(updates);
        existingUser = await userDB.get(existingUser.id);
        
        setUser(existingUser!);
        localStorage.setItem('user', JSON.stringify(existingUser));
      } else {
        const isAdmin = payload.email === 'admin@synjoint.com' || payload.email?.endsWith('@synjoint.com');
        
        const newUser: User = {
          id: payload.sub || Date.now().toString(),
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          role: isAdmin ? 'admin' : 'user',
          count: 1,
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

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const existingUser = await userDB.getByEmail(email);
      if (existingUser) {
        toast.error("A user with this email already exists");
        return;
      }
      
      const isAdmin = email.endsWith('@synjoint.com');
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        password,
        role: isAdmin ? 'admin' : 'user',
        count: 1,
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    navigate('/');
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
