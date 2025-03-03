
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Blogs = () => {
  const { blogs, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900"
          >
            Latest Blogs
          </motion.h1>
          
          {isAdmin && (
            <Link to="/admin/create-blog">
              <Button className="bg-synjoint-blue hover:bg-synjoint-blue/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Blog
              </Button>
            </Link>
          )}
        </div>
        
        {blogs.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <BlogCard {...blog} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
