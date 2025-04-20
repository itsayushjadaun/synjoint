
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface CareerCardProps {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  created_at: string;
}

const CareerCard = ({ id, title, description, requirements, location, created_at }: CareerCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('career-apply', {
        body: JSON.stringify({
          ...formData,
          position: title
        })
      });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Thank you for your interest. We'll review your application and contact you soon.",
        duration: 5000
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        resume_url: ""
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Failed to submit application",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-synjoint-blue dark:text-blue-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4 dark:text-gray-300">
          {description}
        </p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2 dark:text-gray-200">Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center text-gray-500 mb-2 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          {location}
        </div>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90">
              Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Apply for {title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to apply for this position. We'll get back to you soon.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Cover Letter/Message <span className="text-red-500">*</span></Label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[100px] dark:bg-gray-800 dark:border-gray-600"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume_url">Resume Link (Google Drive, Dropbox, etc.)</Label>
                <Input
                  id="resume_url"
                  name="resume_url"
                  placeholder="https://drive.google.com/..."
                  value={formData.resume_url}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : "Submit Application"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default CareerCard;
