
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Innovation from "./pages/Innovation";
import Stakeholders from "./pages/Stakeholders";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Academy from "./pages/Academy";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBlog from "./pages/CreateBlog";
import CreateCareer from "./pages/CreateCareer";

const queryClient = new QueryClient();

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/innovation" element={<Innovation />} />
              <Route path="/stakeholders" element={<Stakeholders />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-blog" element={<CreateBlog />} />
              <Route path="/admin/create-career" element={<CreateCareer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);

export default App;
