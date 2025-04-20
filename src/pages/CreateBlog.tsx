
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CreateBlog = () => {
  const { user, addBlog } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP, or GIF)");
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image file size must be less than 5MB");
      return;
    }
    
    setImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };
  
  const resetImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `blog_images/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);
        
      if (uploadError) {
        toast.error("Error uploading image: " + uploadError.message);
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let imageUrl = "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png"; // Default image
      
      // If there's an image file, upload it
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      await addBlog({ 
        title, 
        content, 
        image_url: imageUrl 
      });
      
      toast.success("Blog post published successfully!");
      navigate('/blogs');
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to publish blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Create New Blog Post</h1>
        
        <Card className="dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="dark:text-white">Blog Details</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter the details for your new blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="dark:text-white">Blog Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="dark:text-white">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  className="min-h-[200px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="dark:text-white">Blog Image</Label>
                <div className="border-2 border-dashed rounded-md p-4 dark:border-gray-700">
                  {!imagePreview ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Drag and drop an image, or click to browse
                      </p>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image-upload">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="dark:bg-gray-700 dark:border-gray-600"
                        >
                          Select Image
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Supported formats: JPG, PNG, WebP, GIF (max 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Blog preview" 
                        className="max-h-64 mx-auto rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={resetImage}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload an image for your blog post. If left empty, a default image will be used.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="dark:border-gray-600 dark:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-synjoint-blue hover:bg-synjoint-blue/90"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? "Publishing..." : "Publish Blog Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
