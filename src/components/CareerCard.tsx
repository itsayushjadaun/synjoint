
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";

interface CareerCardProps {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  date: string;
}

const CareerCard = ({ id, title, description, requirements, location, date }: CareerCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-synjoint-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="text-gray-600">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          {location}
        </div>
        
        <div className="flex items-center text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-synjoint-blue hover:bg-synjoint-blue/90">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CareerCard;
