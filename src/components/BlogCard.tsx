
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { Trash } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  author_name?: string;
  onDelete?: () => void;
}

const BlogCard = ({ 
  id, 
  title, 
  content, 
  image_url, 
  created_at, 
  author_name,
  onDelete 
}: BlogCardProps) => {
  const { user, refreshBlogs } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  // Create a shorter excerpt of the content
  const excerpt = content
    .replace(/<[^>]+>/g, '')  // Remove HTML tags
    .slice(0, 120) + (content.length > 120 ? '...' : '');
    
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Use the RPC function but with a type assertion to avoid TypeScript errors
      const { error } = await supabase.rpc('delete_blog' as any, { blog_id: id });
      
      if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      if (onDelete) {
        onDelete();
      } else {
        refreshBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Link to={`/blog/${id}`} className="block h-full">
        <Card className="h-full overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
          <div className="relative h-48 w-full">
            <img
              src={image_url || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            
            {isAdmin && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
              {author_name && (
                <span className="text-xs text-gray-500 dark:text-gray-400">By: {author_name}</span>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{excerpt}</p>
            
            <div className="mt-4 flex justify-end">
              <span className="text-synjoint-blue dark:text-blue-400 font-medium hover:underline">
                Read More
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
};

export default BlogCard;
