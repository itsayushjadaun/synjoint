
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const About = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Synjoint Techno</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-4">Company Overview</h2>
                <p className="text-gray-600">
                  SYNJOINT TECHNO PRIVATE LIMITED (CIN: U33115RJ2020PTC068479) is a Private company
                  incorporated on 06 Dec 2020. We specialize in the manufacture of medical and surgical
                  equipment and orthopedic appliances.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-4">Leadership</h2>
                <p className="text-gray-600">
                  Our company is led by our esteemed directors:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Dr. SUSHEEL CHAUDHARY</li>
                  <li>SANGEETA LAMBA</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-4">Company Details</h2>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Registration Number:</strong> 68479</li>
                  <li><strong>Company Category:</strong> Company limited by shares</li>
                  <li><strong>Company Status:</strong> Active</li>
                  <li><strong>Date of Incorporation:</strong> 2020-03-06</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-synjoint-blue mb-4">Contact Information</h2>
                <address className="text-gray-600 not-italic">
                  <p>E-56, BALDEO NAGAR, MAKARWALI ROAD</p>
                  <p>AJMER, Rajasthan, India - 305001</p>
                  <p className="mt-2">Email: drsusheel.chaudhary@yahoo.co.in</p>
                </address>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
