
import React, { useRef, useState } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface ApplyFileUploadProps {
  accept: string;
  maxSizeMB: number;
  onChange: (file: File) => void;
  type?: 'resume' | 'image';
  required?: boolean;
}

const ApplyFileUpload: React.FC<ApplyFileUploadProps> = ({ 
  accept, 
  maxSizeMB, 
  onChange, 
  type = 'resume',
  required 
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`File exceeds ${maxSizeMB}MB limit.`);
          setIsUploading(false);
          return;
        }
        
        // Check file type
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        const isAcceptedType = acceptedTypes.some(type => {
          if (type.endsWith('*')) {
            const prefix = type.split('*')[0];
            return fileType.startsWith(prefix);
          }
          return type === fileType;
        });
        
        if (!isAcceptedType) {
          toast.error(`Invalid file type. Please upload ${acceptedTypes.join(', ')}`);
          setIsUploading(false);
          return;
        }
        
        // Create preview for images
        if (type === 'image') {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        
        setFileName(file.name);
        onChange(file);
        console.log(`${type} file selected successfully:`, file.name);
      }
    } catch (error) {
      console.error(`Error handling ${type} file:`, error);
      toast.error("Error processing your file");
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetFile = () => {
    setFileName("");
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  return (
    <div>
      {previewUrl && type === 'image' && (
        <div className="mb-2 relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-[200px] max-h-[200px] object-cover rounded-md"
          />
          <button 
            type="button" 
            onClick={resetFile} 
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
          >
            X
          </button>
        </div>
      )}
      
      <button
        type="button"
        className="flex items-center px-3 py-2 bg-gray-200 rounded text-gray-900 hover:bg-gray-300 transition mb-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        onClick={() => inputRef.current?.click()}
        aria-label={`Upload ${type}`}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className="animate-spin h-4 w-4 border-b-2 rounded-full border-gray-800 dark:border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            {type === 'image' ? <ImagePlus className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {fileName || `Select ${type}`}
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

export default ApplyFileUpload;
