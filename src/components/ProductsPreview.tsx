
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ProductsPreview = () => {
  const products = [
    {
      title: "Orthopedic Implants",
      description: "Advanced orthopedic solutions for better patient outcomes.",
      icon: "/lovable-uploads/052adda9-1a2d-4219-827c-f98040ff2479.png"
    },
    {
      title: "Surgical Equipment",
      description: "Precision instruments for modern surgical procedures.",
      icon: "/lovable-uploads/46c0db01-9871-4090-8b45-14399a236f90.png"
    }
  ];

  return (
    <div className="bg-synjoint-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <img src={product.icon} alt={product.title} className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-white/80 mb-4">{product.description}</p>
              <a
                href="/products"
                className="inline-flex items-center text-synjoint-orange hover:text-synjoint-orange/90"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPreview;
