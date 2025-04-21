
import React, { useRef } from "react";
import { Upload } from "lucide-react";
// For images: accept="image/jpeg,image/png,image/webp"
// For resume: accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

interface ApplyResumeUploadProps {
  accept: string;
  maxSizeMB: number;
  onChange: (file: File) => void;
  required?: boolean;
}

const ApplyResumeUpload: React.FC<ApplyResumeUploadProps> = ({ accept, maxSizeMB, onChange, required }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string>("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate type
      if (accept && !accept.split(',').some(type => file.type.includes(type.split('/')[1]))) {
        alert("Invalid file type.");
        return;
      }
      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      setFileName(file.name);
      onChange(file);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="flex items-center px-3 py-2 bg-gray-200 rounded text-gray-900 hover:bg-gray-300 transition mb-2"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload file"
      >
        <Upload className="h-4 w-4 mr-2" />
        {fileName || "Select file"}
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
