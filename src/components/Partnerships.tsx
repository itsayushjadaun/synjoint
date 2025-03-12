
import { motion } from "framer-motion";

const Partnerships = () => {
  const partners = [
    {
      name: "Global Health Initiative",
      type: "Non-Profit Organization",
      description: "Working together to improve healthcare access in developing regions through innovative medical technology.",
      logo: "/lovable-uploads/6033b195-d7ac-4581-b018-f92ee857b92b.png"
    },
    {
      name: "TechMed Research",
      type: "Research Institution",
      description: "Collaborative research and development of next-generation orthopedic implants and techniques.",
      logo: "/lovable-uploads/fa6d2119-286c-498d-b934-ec9619932a0c.png"
    },
    {
      name: "MediVersity",
      type: "Medical University",
      description: "Educating the next generation of medical professionals on advanced surgical technologies.",
      logo: "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Strategic Partnerships</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We believe in the power of collaboration. Our partnerships help us drive innovation and expand our impact globally.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gray-100 dark:bg-gray-800 h-32 w-32 rounded-full mx-auto mb-6 flex items-center justify-center p-6">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
              <p className="text-synjoint-blue dark:text-blue-400 mb-4">{partner.type}</p>
              <p className="text-gray-600 dark:text-gray-300">{partner.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Interested in partnering with us?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for new opportunities to collaborate with like-minded organizations that share our commitment to advancing healthcare.
          </p>
          <button className="bg-synjoint-orange text-white px-6 py-3 rounded-md hover:bg-synjoint-orange/90 transition-colors">
            Explore Partnership Opportunities
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Partnerships;
