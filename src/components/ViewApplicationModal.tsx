
import { useState } from "react";
import { Mail, Phone, Calendar, Download, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewApplicationModalProps {
  application: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    message: string;
    resume_url?: string;
    status: string;
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const ViewApplicationModal = ({
  application,
  isOpen,
  onClose,
  onStatusChange,
}: ViewApplicationModalProps) => {
  const [status, setStatus] = useState(application.status);
  const [isSaving, setIsSaving] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'contacted':
        return <Badge className="bg-orange-500">Contacted</Badge>;
      case 'interviewing':
        return <Badge className="bg-purple-500">Interviewing</Badge>;
      case 'hired':
        return <Badge className="bg-green-500">Hired</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const handleStatusChange = async () => {
    setIsSaving(true);
    try {
      await onStatusChange(application.id, status);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>Application: {application.position}</span>
            {getStatusBadge(status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-lg font-semibold">{application.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(application.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={`mailto:${application.email}`}
                  className="text-synjoint-blue hover:underline"
                >
                  {application.email}
                </a>
              </div>
              
              {application.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${application.phone}`}
                    className="text-synjoint-blue hover:underline"
                  >
                    {application.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Cover Message:</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-line">
              {application.message}
            </div>
          </div>
          
          {application.resume_url && (
            <div>
              <h4 className="font-medium mb-2">Resume:</h4>
              <div className="flex space-x-3">
                <a 
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-synjoint-blue hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> View Resume
                </a>
                <a 
                  href={application.resume_url}
                  download
                  className="inline-flex items-center text-synjoint-blue hover:underline"
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </a>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Update Status:</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                className="px-3 py-1 border rounded text-sm flex-grow"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interviewing">Interviewing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <Button 
                onClick={handleStatusChange}
                disabled={isSaving || status === application.status}
                className="whitespace-nowrap"
              >
                {isSaving ? "Saving..." : "Update Status"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = `mailto:${application.email}?subject=Re: Your application for ${application.position}`}
              >
                Reply via Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;
