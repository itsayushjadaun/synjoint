
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">About SYNJOINT</h2>
          <div className="w-24 h-1 bg-synjoint-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leading innovator in the implants and medical devices industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Our Story</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              SYNJOINT Tech Pvt Ltd is a startup orthopedics company that is a leading innovator in the implants and medical devices industry. We are dedicated to providing advanced implant solutions through cutting-edge technology, using high-quality materials and a strong focus on R&D to ensure optimal implant performance and patient satisfaction.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              We have dedicated Quality Control and R&D facilities, modern equipment, and a highly professional team. Our mission is to deliver top-quality products at affordable prices.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover-lift">
                <div className="text-2xl font-bold text-synjoint-blue dark:text-synjoint-lightblue mb-2">5+</div>
                <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover-lift">
                <div className="text-2xl font-bold text-synjoint-blue dark:text-synjoint-lightblue mb-2">100+</div>
                <div className="text-gray-600 dark:text-gray-400">Satisfied Clients</div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover-lift">
                <div className="text-2xl font-bold text-synjoint-blue dark:text-synjoint-lightblue mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400">Surgeries Supported</div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover-lift">
                <div className="text-2xl font-bold text-synjoint-blue dark:text-synjoint-lightblue mb-2">10+</div>
                <div className="text-gray-600 dark:text-gray-400">Innovation Patents</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-synjoint-blue/30 to-synjoint-orange/30 mix-blend-overlay z-10 rounded-2xl"></div>
            <img 
              src="/lovable-uploads/79996f38-038d-410e-90eb-de4ca9e224a9.png" 
              alt="Medical Devices"
              className="w-full h-auto rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-20">
              <h3 className="text-xl font-bold text-white">Our Specialization</h3>
              <p className="text-white/90">Orthopaedics manufacturing — Hip and Knee Joint Arthroplasty</p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Overview</h3>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              SYNJOINT TECH PVT LTD specializes in orthopaedics manufacturing — particularly Hip and Knee Joint Arthroplasty. We produce both cemented and uncemented implants including primary femoral hip stems, bipolar hip systems, and complete total hip replacement systems.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
