
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <div className="bg-synjoint-blue py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Healthcare?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in our mission to advance medical technology and improve patient care worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-synjoint-blue transition-colors duration-200"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-synjoint-orange bg-synjoint-orange text-base font-medium rounded-md text-white hover:bg-synjoint-orange/90 hover:border-synjoint-orange/90 transition-colors duration-200"
            >
              Explore Products
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;
