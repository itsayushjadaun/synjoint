
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
}

const BlogCard = ({ id, title, content, imageUrl, author, date }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-synjoint-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">
          {content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 pt-0">
        <div className="text-sm text-gray-500">
          Posted by {author}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
