
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Contact = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-synjoint-blue mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Corporate Office</h3>
                  <address className="text-gray-600 not-italic">
                    E-56, BALDEO NAGAR,<br />
                    MAKARWALI ROAD,<br />
                    AJMER, Rajasthan,<br />
                    India - 305001
                  </address>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:drsusheel.chaudhary@yahoo.co.in" className="hover:text-synjoint-orange">
                      drsusheel.chaudhary@yahoo.co.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-synjoint-orange focus:ring-synjoint-orange"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-synjoint-orange focus:ring-synjoint-orange"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-synjoint-orange focus:ring-synjoint-orange"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-synjoint-orange text-white px-6 py-3 rounded-md hover:bg-synjoint-orange/90 transition-colors duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
