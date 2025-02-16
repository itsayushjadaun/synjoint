
import { motion } from "framer-motion";

const Mission = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At Synjoint Techno, we are dedicated to alleviating human suffering and improving quality of life through advanced medical solutions. Our commitment to innovation drives us to develop state-of-the-art medical technologies.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="text-synjoint-orange text-xl">•</span>
                <span className="text-gray-600">Advancing medical technology through continuous innovation</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-synjoint-orange text-xl">•</span>
                <span className="text-gray-600">Ensuring highest quality standards in medical devices</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-synjoint-orange text-xl">•</span>
                <span className="text-gray-600">Supporting healthcare professionals with cutting-edge solutions</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/lovable-uploads/67a5affa-62f9-4f9b-96c4-2f2b01963a4e.png"
              alt="Medical Innovation"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-synjoint-blue/10 rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
