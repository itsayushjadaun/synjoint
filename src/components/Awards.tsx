
import { motion } from "framer-motion";

const Awards = () => {
  const awards = [
    {
      title: "Excellence in Medical Innovation",
      year: "2024",
      organization: "Global Healthcare Awards",
      description: "Recognized for breakthrough advancements in orthopedic implant technology.",
      image: "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png"
    },
    {
      title: "Best Workplace in Healthcare",
      year: "2023",
      organization: "Marksmen Daily",
      description: "Awarded for exceptional workplace culture and employee satisfaction.",
      image: "/lovable-uploads/274c7dca-7bb5-45ca-84ae-807b8a8c3f00.png"
    },
    {
      title: "Sustainability Leadership Award",
      year: "2023",
      organization: "Medical Manufacturing Council",
      description: "Recognized for implementing eco-friendly production processes.",
      image: "/lovable-uploads/625c5313-cd17-4b6b-869e-3361c4f96290.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-synjoint-blue to-blue-800 text-white flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Recognitions & Awards</h2>
          <p className="text-xl max-w-3xl mx-auto">Our commitment to excellence has been recognized through numerous prestigious awards and industry accolades.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="h-16 w-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <img src={award.image} alt={award.title} className="h-10 w-10 object-contain" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
              <div className="text-sm mb-4">
                <span className="bg-synjoint-orange px-2 py-1 rounded-md mr-2">{award.year}</span>
                <span className="text-white/80">{award.organization}</span>
              </div>
              <p className="text-white/90">{award.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Awards;
