
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const News = () => {
  const news = [
    {
      title: "New Product Launch",
      date: "March 2024",
      description: "Introducing our latest orthopedic implant technology",
      image: "/lovable-uploads/625c5313-cd17-4b6b-869e-3361c4f96290.png"
    },
    {
      title: "Research Milestone",
      date: "February 2024",
      description: "Breakthrough in surgical equipment development",
      image: "/lovable-uploads/79996f38-038d-410e-90eb-de4ca9e224a9.png"
    },
    {
      title: "Industry Recognition",
      date: "January 2024",
      description: "Synjoint receives excellence in innovation award",
      image: "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
          <p className="mt-4 text-lg text-gray-600">Stay updated with our latest developments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-synjoint-orange mb-2">{item.date}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-synjoint-blue hover:text-synjoint-blue/90"
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
