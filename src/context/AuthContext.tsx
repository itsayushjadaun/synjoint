
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  picture?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
}

interface CareerPost {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  date: string;
}

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
  addBlog: (blog: Omit<BlogPost, 'id' | 'author' | 'date'>) => void;
  addCareer: (career: Omit<CareerPost, 'id' | 'date'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for blogs and careers
const initialBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Medical Technology',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod metus at risus tristique, sit amet luctus justo finibus.',
    imageUrl: '/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png',
    author: 'Admin User',
    date: '2023-05-15'
  },
  {
    id: '2',
    title: 'Advancements in Joint Replacement',
    content: 'Nullam euismod metus at risus tristique, sit amet luctus justo finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: '/lovable-uploads/67a5affa-62f9-4f9b-96c4-2f2b01963a4e.png',
    author: 'Admin User',
    date: '2023-06-22'
  }
];

const initialCareers: CareerPost[] = [
  {
    id: '1',
    title: 'R&D Engineer',
    description: 'Join our research and development team to design and develop innovative medical devices.',
    requirements: ['Bachelor\'s degree in Engineering', '3+ years of experience', 'Knowledge of medical device regulations'],
    location: 'Mumbai, India',
    date: '2023-07-10'
  },
  {
    id: '2',
    title: 'Quality Assurance Specialist',
    description: 'Ensure our products meet the highest quality standards and regulatory requirements.',
    requirements: ['Bachelor\'s degree in related field', '2+ years in quality assurance', 'Experience with ISO standards'],
    location: 'Bangalore, India',
    date: '2023-07-15'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const navigate = useNavigate();

  // Check if user is already logged in and load data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load blogs and careers from localStorage or use initial data
    const storedBlogs = localStorage.getItem('blogs');
    const storedCareers = localStorage.getItem('careers');
    
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      setBlogs(initialBlogs);
      localStorage.setItem('blogs', JSON.stringify(initialBlogs));
    }
    
    if (storedCareers) {
      setCareers(JSON.parse(storedCareers));
    } else {
      setCareers(initialCareers);
      localStorage.setItem('careers', JSON.stringify(initialCareers));
    }
    
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
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

  // Google login function
  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would validate the credential on your server
      // Here we'll decode the JWT to get the user info
      const payload = JSON.parse(atob(credential.split('.')[1]));
      console.log("Google credential payload:", payload);
      
      // Check if the email belongs to admin domain
      const isAdmin = payload.email === 'admin@synjoint.com' || payload.email?.endsWith('@synjoint.com');
      
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: isAdmin ? 'admin' : 'user'
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success("Google login successful!");
      navigate('/');
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login error:", error);
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
      
      // Check if email is for admin domain
      const isAdmin = email.endsWith('@synjoint.com');
      
      const user = {
        id: Date.now().toString(),
        email,
        name,
        role: isAdmin ? 'admin' as const : 'user' as const
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

  // Function to add a new blog post
  const addBlog = (blog: Omit<BlogPost, 'id' | 'author' | 'date'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add blog posts");
      return;
    }
    
    const newBlog: BlogPost = {
      ...blog,
      id: Date.now().toString(),
      author: user.name,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    toast.success("Blog post created successfully!");
    navigate('/blogs');
  };

  // Function to add a new career post
  const addCareer = (career: Omit<CareerPost, 'id' | 'date'>) => {
    if (!user || user.role !== 'admin') {
      toast.error("Only admins can add career postings");
      return;
    }
    
    const newCareer: CareerPost = {
      ...career,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedCareers = [...careers, newCareer];
    setCareers(updatedCareers);
    localStorage.setItem('careers', JSON.stringify(updatedCareers));
    toast.success("Career posting created successfully!");
    navigate('/careers');
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
      addCareer
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
