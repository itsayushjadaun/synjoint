
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
import ApplyFileUpload from "../components/ApplyFileUpload";
import { supabase } from "@/integrations/supabase/client";

const CreateBlog = () => {
  const { user, addBlog } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setImageUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const filePath = `blog_${Date.now()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
    
    console.log("File uploaded successfully:", urlData.publicUrl);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageFile) {
      toast.error("Please fill in all required fields and upload an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      let url = imageUrl;
      try {
        url = await uploadImageToSupabase(imageFile);
      } catch (imgError) {
        console.error("Image upload error details:", imgError);
        toast.error("Image upload failed, please try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Image upload successful, URL:", url);
      console.log("Saving blog to database with title:", title);
      
      // Use the blogAPI directly instead of going through useAuth context
      // This gives us more direct control and better error handling
      const { data: blogAPI } = await supabase
        .from('blogs')
        .insert({
          title: title,
          content: content,
          image_url: url,
          author_id: user?.id || '',
          author_name: user?.name || user?.email || 'Anonymous'
        })
        .select();
      
      console.log("Blog save response:", blogAPI);
      
      toast.success("Blog post published!");
      navigate('/blogs');
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to publish! Please check the console for details.");
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
                <Label htmlFor="blog-image" className="dark:text-white">Blog Banner/Thumbnail Image</Label>
                <ApplyFileUpload
                  accept="image/jpeg,image/png,image/webp"
                  maxSizeMB={5}
                  onChange={handleImageChange}
                  type="image"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG, or WebP. Max size: 5MB.
                </p>
              </div>
              <div className="border rounded-md p-4 dark:border-gray-700">
                <p className="text-sm font-medium mb-2 dark:text-white">Preview Image</p>
                <div className="h-48 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Blog preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image preview available
                    </div>
                  )}
                </div>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish Blog Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
