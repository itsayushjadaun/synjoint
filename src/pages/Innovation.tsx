
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Innovation = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Innovation & Research</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Research & Development</h2>
              <p className="text-gray-600 mb-6">
                At Synjoint Techno, we are committed to advancing medical technology through innovative
                research and development. Our team of experts works tirelessly to develop cutting-edge
                solutions that improve patient outcomes.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Advanced Medical Equipment Development</li>
                <li>Orthopedic Technology Innovation</li>
                <li>Surgical Equipment Enhancement</li>
                <li>Quality Assurance Research</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Technology Focus</h2>
              <p className="text-gray-600 mb-6">
                Our innovative approach combines cutting-edge technology with medical expertise to create
                solutions that address real healthcare challenges.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-synjoint-orange mb-2">Medical Equipment Design</h3>
                  <p className="text-gray-600">State-of-the-art design principles for medical devices</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-synjoint-orange mb-2">Quality Manufacturing</h3>
                  <p className="text-gray-600">Advanced manufacturing processes ensuring highest quality</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Innovation;
