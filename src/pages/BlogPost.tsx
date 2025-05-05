
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "@/utils/supabase";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error("Error fetching blog post:", error);
          toast.error("Blog post not found");
          navigate('/blogs');
          return;
        }
        
        setBlog(data);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="flex justify-center py-12">
            <div className="animate-pulse h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blogs')} className="bg-synjoint-blue hover:bg-synjoint-darkblue">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button 
            onClick={() => navigate('/blogs')} 
            variant="ghost" 
            className="mb-6 text-synjoint-blue dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{blog.title}</h1>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-8 space-x-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{blog.author_name || 'Staff Writer'}</span>
            </div>
          </div>
          
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={blog.image_url || '/placeholder.svg'} 
              alt={blog.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          
          <div className="prose dark:prose-invert prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, i) => (
              paragraph ? <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
