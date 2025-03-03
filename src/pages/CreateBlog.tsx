
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateBlog = () => {
  const { user, addBlog } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      addBlog({ title, content, imageUrl });
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
              <CardDescription>
                Enter the details for your new blog post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                <p className="text-xs text-gray-500">
                  Use a Synjoint image or upload your own. Default image will be used if left empty.
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm font-medium mb-2">Preview Image</p>
                <div className="h-48 overflow-hidden rounded-md bg-gray-100">
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
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
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
