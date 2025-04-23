
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BlogDetail from "./BlogDetail";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  created_at: string;
}

const BlogCard = ({ id, title, content, image_url, author_name, created_at }: BlogCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden h-full flex flex-col dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="h-48 overflow-hidden">
          <img 
            src={image_url} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Use fallback image if the image URL fails to load
              e.currentTarget.src = "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png";
            }}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl text-synjoint-blue dark:text-blue-400">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 line-clamp-3 dark:text-gray-300">
            {content}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 pt-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Posted by {author_name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </CardFooter>
      </Card>
      
      <BlogDetail
        id={id}
        title={title}
        content={content}
        image_url={image_url}
        author_name={author_name}
        created_at={created_at}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default BlogCard;
