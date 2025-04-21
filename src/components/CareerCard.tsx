
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ApplyResumeUpload from "./ApplyResumeUpload";
import { supabase } from "@/utils/supabase";
import { sendWhatsAppMessage } from "@/utils/whatsapp";

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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File) => {
    console.log("Resume file received:", file.name);
    setResumeFile(file);
  };

  const uploadResumeToSupabase = async (file: File) => {
    try {
      console.log("Starting resume upload to Supabase");
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      // Check if bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Error checking buckets:", bucketError);
        throw bucketError;
      }
      
      const bucketName = "career-resumes";
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log("Career resumes bucket doesn't exist, creating it...");
        const { error: createError } = await supabase.storage.createBucket(bucketName, { 
          public: true 
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw createError;
        }
      }
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      console.log("Resume uploaded successfully:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const saveApplicationToDatabase = async (applicationData: any) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          position: applicationData.position,
          name: applicationData.name,
          email: applicationData.email,
          phone: applicationData.phone || null,
          message: applicationData.message,
          resume_url: applicationData.resume_url,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error saving application to database:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message || !resumeFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields, including resume.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      let resumeUrl = "";
      try {
        resumeUrl = await uploadResumeToSupabase(resumeFile);
      } catch (fileErr) {
        // Error already handled in uploadResumeToSupabase
        setIsSubmitting(false);
        return;
      }
      
      // Save application to the database
      const applicationData = {
        ...formData,
        position: title,
        resume_url: resumeUrl
      };
      
      await saveApplicationToDatabase(applicationData);
      
      // Send WhatsApp message
      const message = `New job application received!\n\nPosition: ${title}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nApplicant message: ${formData.message.substring(0, 100)}${formData.message.length > 100 ? '...' : ''}`;
      
      const whatsappResult = sendWhatsAppMessage(message);
      
      // Also call the Supabase Edge Function if needed
      try {
        await supabase.functions.invoke('career-apply', {
          body: JSON.stringify(applicationData)
        });
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        // Don't fail the submission if edge function fails
      }

      toast({
        title: "Application submitted",
        description: "Thank you. We'll contact you soon.",
        duration: 5000
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        resume_url: ""
      });
      setResumeFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Failed to submit application",
        description: error instanceof Error ? error.message : "Please try again later",
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
