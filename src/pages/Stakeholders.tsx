
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Stakeholders = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Stakeholders</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Healthcare Professionals</h2>
              <p className="text-gray-600 mb-4">
                We work closely with healthcare professionals to develop and improve our medical solutions.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Clinical Program Support</li>
                <li>Professional Training</li>
                <li>Product Education</li>
                <li>Technical Support</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Investors</h2>
              <p className="text-gray-600 mb-4">
                Key company information for our investors:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Authorized Capital:</strong> ₹100,000.00</li>
                <li><strong>Paid-up Capital:</strong> ₹100,000.00</li>
                <li><strong>Company Status:</strong> Active</li>
                <li><strong>Last AGM:</strong> December 30, 2023</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Corporate Governance</h2>
            <p className="text-gray-600 mb-4">
              We maintain high standards of corporate governance and transparency in all our operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-synjoint-orange mb-2">Directors</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>SANGEETA LAMBA</li>
                  <li>SUSHEEL CHAUDHARY</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-synjoint-orange mb-2">Compliance</h3>
                <p className="text-gray-600">
                  Latest Balance Sheet Filed: March 31, 2023
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stakeholders;
