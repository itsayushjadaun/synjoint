
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

const Events = () => {
  const events = [
    {
      title: "Synjoint Medical Conference 2024",
      date: "June 15-17, 2024",
      location: "New York, USA",
      time: "9:00 AM - 5:00 PM",
      description: "Join us for three days of presentations, workshops, and networking focused on the latest advancements in orthopedic technology.",
      image: "/lovable-uploads/052adda9-1a2d-4219-827c-f98040ff2479.png"
    },
    {
      title: "European Healthcare Innovation Summit",
      date: "September 22-23, 2024",
      location: "Berlin, Germany",
      time: "10:00 AM - 6:00 PM",
      description: "Synjoint will be presenting our latest surgical equipment innovations at this premier European healthcare event.",
      image: "/lovable-uploads/46c0db01-9871-4090-8b45-14399a236f90.png"
    },
    {
      title: "Asian Medical Devices Expo",
      date: "November 5-7, 2024",
      location: "Singapore",
      time: "9:30 AM - 4:30 PM",
      description: "Visit our booth to experience hands-on demonstrations of our newest product line for the Asian market.",
      image: "/lovable-uploads/79996f38-038d-410e-90eb-de4ca9e224a9.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with us at these upcoming industry events where we'll be showcasing our latest innovations.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{event.title}</h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{event.date}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                
                <button className="mt-6 bg-synjoint-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600">
                  Register Interest
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
