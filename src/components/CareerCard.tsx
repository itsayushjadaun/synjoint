
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import ApplyResumeUpload from "./ApplyResumeUpload";
import ApplyFileUpload from "./ApplyFileUpload";
import { supabase } from "@/utils/supabase";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File) => {
    console.log("Resume file received:", file.name);
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Missing information", {
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (!resumeFile) {
      toast.error("Resume required", {
        description: "Please upload your resume."
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Save application data to the database (excluding resume)
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          position: title,
          message: formData.message,
          status: 'new',
          created_at: new Date().toISOString()
        })
        .select();
      
      if (applicationError) throw applicationError;
      
      // Send email with application details and attachments
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('position', title);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('recipientEmail', 'ayushjadaun03@gmail.com');
      
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      const { data, error } = await supabase.functions.invoke('send-application-email', {
        body: formDataToSend
      });

      if (error) {
        console.error("Error sending email:", error);
      }

      toast.success("Your application has been submitted! We'll review it soon.");

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
      toast.error("Failed to submit application. Please try again later.");
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
    </Card>
  );
};

export default CareerCard;
