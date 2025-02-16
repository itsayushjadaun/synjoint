
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Global Presence",
      description: "Expanding our reach across international markets with innovative medical solutions.",
      image: "/lovable-uploads/625c5313-cd17-4b6b-869e-3361c4f96290.png"
    },
    {
      title: "Clinically Relevant",
      description: "Developing solutions based on extensive research and clinical expertise.",
      image: "/lovable-uploads/67a5affa-62f9-4f9b-96c4-2f2b01963a4e.png"
    },
    {
      title: "State Of The Art Medical Devices",
      description: "Advanced technology meeting the highest standards of medical care.",
      image: "/lovable-uploads/79996f38-038d-410e-90eb-de4ca9e224a9.png"
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
