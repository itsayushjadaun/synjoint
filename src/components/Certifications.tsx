
import { motion } from "framer-motion";

const Certifications = () => {
  const certifications = [
    {
      title: "ISO 13485:2016",
      description: "Medical devices quality management systems"
    },
    {
      title: "CE Marking",
      description: "European conformity for medical devices"
    },
    {
      title: "ISO 9001:2015",
      description: "Quality management system certification"
    },
    {
      title: "GMP Certified",
      description: "Good Manufacturing Practice compliance"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quality Certifications</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Our commitment to quality is validated by international certifications
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-synjoint-blue/10 dark:bg-synjoint-blue/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-synjoint-blue dark:text-blue-400">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cert.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
