
import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ApplyResumeUploadProps {
  accept: string;
  maxSizeMB: number;
  onChange: (file: File) => void;
  required?: boolean;
}

const ApplyResumeUpload: React.FC<ApplyResumeUploadProps> = ({ accept, maxSizeMB, onChange, required }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`File exceeds ${maxSizeMB}MB limit.`);
          return;
        }
        
        // Check file type
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        if (!acceptedTypes.some(type => {
          // Handle wildcards like application/*, image/*
          if (type.endsWith('*')) {
            const prefix = type.split('*')[0];
            return fileType.startsWith(prefix);
          }
          return type === fileType;
        })) {
          toast.error(`Invalid file type. Please upload ${acceptedTypes.join(', ')}`);
          return;
        }
        
        setFileName(file.name);
        onChange(file);
        console.log("File selected successfully:", file.name);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      toast.error("Error processing your file");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <button
        type="button"
        className="flex items-center px-3 py-2 bg-gray-200 rounded text-gray-900 hover:bg-gray-300 transition mb-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload file"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className="animate-spin h-4 w-4 border-b-2 rounded-full border-gray-800 dark:border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {fileName || "Select file"}
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        required={required}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

export default ApplyResumeUpload;
