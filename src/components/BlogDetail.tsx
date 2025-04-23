
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BlogDetailProps {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  created_at: string;
  isOpen: boolean;
  onClose: () => void;
}

const BlogDetail = ({ 
  title, 
  content, 
  image_url, 
  author_name, 
  created_at, 
  isOpen, 
  onClose 
}: BlogDetailProps) => {
  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-synjoint-blue">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="aspect-video overflow-hidden rounded-lg mb-6">
            <img 
              src={image_url} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Use fallback image if the image URL fails to load
                e.currentTarget.src = "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png";
              }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>By {author_name}</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            {content.split('\n').map((paragraph, i) => (
              paragraph ? <p key={i} className="mb-4">{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetail;
