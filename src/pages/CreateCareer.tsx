
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const CreateCareer = () => {
  const { user, addCareer } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };
  
  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };
  
  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Filter out empty requirements
    const filteredRequirements = requirements.filter(req => req.trim() !== "");
    
    if (filteredRequirements.length === 0) {
      toast.error("Please add at least one requirement");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addCareer({ 
        title, 
        description,
        requirements: filteredRequirements,
        location
      });
    } catch (error) {
      console.error("Error creating career post:", error);
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Create New Career Listing</h1>
        
        <Card className="dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="dark:text-white">Job Details</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter the details for your new career opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="dark:text-white">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="dark:text-white">Job Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write the job description here..."
                  className="min-h-[150px] dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="dark:text-white">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter job location"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="dark:text-white">Requirements</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addRequirement}
                    className="h-8 dark:border-gray-600 dark:text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Requirement
                  </Button>
                </div>
                
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Enter requirement"
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    {requirements.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="px-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
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
                {isSubmitting ? "Publishing..." : "Publish Job Listing"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCareer;
