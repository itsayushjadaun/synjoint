
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Careers = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers at Synjoint</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Join Our Team</h2>
              <p className="text-gray-600 mb-6">
                At Synjoint Techno, we're always looking for talented individuals who are passionate about
                medical technology and innovation. Join us in our mission to develop cutting-edge medical
                solutions that improve lives.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-synjoint-orange mb-4">Current Openings</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="font-semibold text-gray-800">R&D Engineer</h4>
                      <p className="text-gray-600 mt-2">
                        Join our research and development team to design and develop innovative medical devices.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-semibold text-gray-800">Quality Assurance Specialist</h4>
                      <p className="text-gray-600 mt-2">
                        Ensure our products meet the highest quality standards and regulatory requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Why Join Us?</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Innovative Work Environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Professional Growth Opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Competitive Benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">→</span>
                    <span>Work-Life Balance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;
