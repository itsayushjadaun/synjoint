
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApplyFileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onChange: (file: File) => void;
  type?: 'document' | 'image';
  required?: boolean;
}

const ApplyFileUpload: React.FC<ApplyFileUploadProps> = ({
  accept = 'image/*',
  maxSizeMB = 5,
  onChange,
  type = 'document',
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndProcessFile(file);
  };

  const validateAndProcessFile = (file: File) => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Check file type against accepted types
    if (accept !== '*' && !accept.split(',').some(type => {
      // Handle wildcards like image/* or application/*
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    })) {
      toast.error(`Invalid file type. Accepted: ${accept.replace(/,/g, ', ')}`);
      return;
    }

    // Create preview for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Call the onChange callback with the validated file
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    validateAndProcessFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'} 
          hover:border-gray-400 dark:hover:border-gray-600`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          required={required}
        />
        
        {preview && type === 'image' ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-32 max-w-full mx-auto rounded-md"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="py-2">
            <div className="flex justify-center mb-2">
              {type === 'image' ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drag & drop file here or <span className="text-blue-500">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {required ? 'Required • ' : ''}Max size: {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyFileUpload;
