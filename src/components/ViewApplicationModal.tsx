
import { Mail, Phone, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewApplicationModalProps {
  application: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    message: string;
    resume_url: string;
    photo_url?: string;
    status: 'pending' | 'reviewed' | 'contacted' | 'rejected' | 'hired';
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => void;
}

const ViewApplicationModal = ({
  application,
  isOpen,
  onClose,
  onStatusChange,
}: ViewApplicationModalProps) => {
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    hired: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  };
  
  const handleStatusChange = (status: string) => {
    if (onStatusChange) {
      onStatusChange(application.id, status);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Application: {application.position}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={`mailto:${application.email}`}
                  className="text-synjoint-blue hover:underline dark:text-blue-400"
                >
                  {application.email}
                </a>
              </div>
              
              {application.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${application.phone}`}
                    className="text-synjoint-blue hover:underline dark:text-blue-400"
                  >
                    {application.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 sm:col-span-2 mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(application.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Cover Message:</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-line text-gray-700 dark:text-gray-300">
              {application.message}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Resume:</h4>
              <a 
                href={application.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-center h-32 text-synjoint-blue dark:text-blue-400 hover:underline">
                  View Resume
                </div>
              </a>
            </div>
            
            {application.photo_url && (
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Photo:</h4>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <img 
                    src={application.photo_url} 
                    alt={`${application.name}'s photo`}
                    className="w-full h-32 object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
          
          {onStatusChange && (
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Update Status:</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={application.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  className={application.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                >
                  Pending
                </Button>
                <Button 
                  variant={application.status === 'reviewed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('reviewed')}
                  className={application.status === 'reviewed' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  Reviewed
                </Button>
                <Button 
                  variant={application.status === 'contacted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('contacted')}
                  className={application.status === 'contacted' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                >
                  Contacted
                </Button>
                <Button 
                  variant={application.status === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('rejected')}
                  className={application.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  Rejected
                </Button>
                <Button 
                  variant={application.status === 'hired' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('hired')}
                  className={application.status === 'hired' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  Hired
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              onClick={() => window.location.href = `mailto:${application.email}?subject=Regarding your application for ${application.position} at SYNJOINT`}
            >
              Reply via Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;
