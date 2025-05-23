
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ApplyResumeUpload from "./ApplyResumeUpload";
import ApplyFileUpload from "./ApplyFileUpload";
import { supabase } from "@/utils/supabase";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useAuth } from "../context/AuthContext";

interface CareerCardProps {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  created_at: string;
  onDelete?: (id: string) => void;
}

const CareerCard = ({ id, title, description, requirements, location, created_at, onDelete }: CareerCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File) => {
    console.log("Resume file received:", file.name);
    setResumeFile(file);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Career post deleted",
        description: "The career post has been successfully deleted."
      });
      
      if (onDelete) {
        onDelete(id);
      }
      
    } catch (error) {
      console.error('Error deleting career post:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the career post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('position', title);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('admin_email', 'jadaunayush3@gmail.com'); // Add admin email for notification
      formDataToSend.append('send_applicant_copy', 'true'); // Flag to send copy to applicant
      
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Send application email
      const { error: emailError } = await supabase.functions.invoke('send-application-email', {
        body: formDataToSend
      });

      if (emailError) {
        console.error("Error sending application email:", emailError);
        // Try fallback method if primary fails
        console.log("Trying fallback email method...");
        
        const { error: fallbackError } = await supabase.functions.invoke('career-apply', {
          body: formDataToSend
        });
        
        if (fallbackError) {
          console.error("Error with fallback method:", fallbackError);
          throw new Error("Failed to send application");
        }
      }

      // Save application data to the database
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          position: title,
          message: formData.message,
          status: 'new',
          created_at: new Date().toISOString()
        });
      
      if (applicationError) throw applicationError;
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted! We'll review it soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setResumeFile(null);
      setImageFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit application. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-xl text-synjoint-blue dark:text-blue-400">{title}</CardTitle>
        {isAdmin && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        )}
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
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to apply for this position.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-3">
              <div>
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message">Cover Letter/Message <span className="text-red-500">*</span></Label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[80px] mt-1 dark:bg-gray-800 dark:border-gray-600"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div>
                <Label htmlFor="resume_file">Resume (PDF or DOC) <span className="text-red-500">*</span></Label>
                <div className="mt-1">
                  <ApplyResumeUpload
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    maxSizeMB={5}
                    onChange={handleFileChange}
                    required
                  />
                  {resumeFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {resumeFile.name} selected
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Optional Profile Image</Label>
                <ApplyFileUpload
                  accept="image/jpeg,image/png,image/gif"
                  maxSizeMB={5}
                  type="image"
                  onChange={(file) => setImageFile(file)}
                />
                {imageFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {imageFile.name} selected
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Career Post"
        description="Are you sure you want to delete this career post? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default CareerCard;
