
import { Mail, Phone, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewMessageModalProps {
  message: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ViewMessageModal = ({
  message,
  isOpen,
  onClose,
}: ViewMessageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Message from {message.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold">{message.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(message.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={`mailto:${message.email}`}
                  className="text-synjoint-blue hover:underline"
                >
                  {message.email}
                </a>
              </div>
              
              {message.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${message.phone}`}
                    className="text-synjoint-blue hover:underline"
                  >
                    {message.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Message:</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-line">
              {message.message}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              onClick={() => window.location.href = `mailto:${message.email}?subject=Re: Your message to SYNJOINT`}
            >
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMessageModal;
