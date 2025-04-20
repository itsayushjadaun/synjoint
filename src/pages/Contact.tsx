
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Footer from "../components/Footer";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify(formData)
      });
      
      if (error) throw error;
      
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-synjoint-blue dark:text-blue-400 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-synjoint-blue/10 rounded-full">
                    <MapPin className="h-6 w-6 text-synjoint-blue dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Corporate Office</h3>
                    <address className="text-gray-600 dark:text-gray-400 not-italic">
                      G-60 Ajmer Industrial Area,<br />
                      Palra, Ajmer,<br />
                      Rajasthan, India - 305001
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-synjoint-blue/10 rounded-full">
                    <Mail className="h-6 w-6 text-synjoint-blue dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      <a href="mailto:synjoint.tech@gmail.com" className="hover:text-synjoint-blue dark:hover:text-blue-400">
                        synjoint.tech@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-synjoint-blue/10 rounded-full">
                    <Phone className="h-6 w-6 text-synjoint-blue dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Phone/WhatsApp</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      <a href="tel:+919928822313" className="hover:text-synjoint-blue dark:hover:text-blue-400">
                        +91 9928822313
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.6275392801054!2d74.66135791503705!3d26.10445898347091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396bea9f6aeb99e3%3A0x3c8a3c81f1c73ad9!2sRIICO%20Industrial%20Area%2C%20Palra%2C%20Ajmer%2C%20Rajasthan%20305001!5e0!3m2!1sen!2sin!4v1650450644762!5m2!1sen!2sin" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SYNJOINT Office Location"
                  className="shadow-md"
                ></iframe>
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-synjoint-blue dark:text-blue-400 mb-6">Send Us a Message</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full dark:bg-gray-700 dark:border-gray-600"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full dark:bg-gray-700 dark:border-gray-600"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full dark:bg-gray-700 dark:border-gray-600"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90 text-white px-6 py-3 rounded-md transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></div>
                        <span>Sending...</span>
                      </div>
                    ) : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
