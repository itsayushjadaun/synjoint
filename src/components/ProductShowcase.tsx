
import { motion } from "framer-motion";

const ProductShowcase = () => {
  const products = [
    {
      title: "Hip Joint / Arthroplasty",
      description: "Comprehensive range of cemented and uncemented hip replacement solutions designed for optimal patient outcomes.",
      image: "/lovable-uploads/052adda9-1a2d-4219-827c-f98040ff2479.png",
      features: [
        "Primary Femoral Hip Stems",
        "Bipolar Hip Systems",
        "Total Hip Replacement Systems",
        "Advanced Surface Technologies"
      ]
    },
    {
      title: "Knee Joint / Arthroplasty",
      description: "Innovative knee replacement systems with precision engineering for better mobility and longevity.",
      image: "/lovable-uploads/46c0db01-9871-4090-8b45-14399a236f90.png",
      features: [
        "Total Knee Replacement Systems",
        "Revision Knee Systems",
        "Patient-Specific Instruments",
        "Minimally Invasive Options"
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Products</h2>
          <div className="w-24 h-1 bg-synjoint-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced orthopedic implants designed with precision for optimal patient outcomes
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover-lift"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-synjoint-blue dark:text-synjoint-lightblue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <a 
                  href="/products" 
                  className="inline-flex items-center text-synjoint-blue dark:text-synjoint-lightblue hover:text-synjoint-darkblue dark:hover:text-blue-300 transition-colors"
                >
                  Learn More
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a 
            href="/products" 
            className="inline-block px-8 py-4 bg-synjoint-blue text-white rounded-md hover:bg-synjoint-darkblue transition-colors shadow-md hover:shadow-lg"
          >
            View All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
