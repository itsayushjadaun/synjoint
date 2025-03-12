
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const ProductCard = ({ title, description }: { title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
  >
    <h3 className="text-xl font-semibold text-synjoint-blue mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Products = () => {
  const products = [
    {
      title: "Orthopedic Implants",
      description: "Advanced orthopedic solutions designed for optimal patient outcomes and faster recovery."
    },
    {
      title: "Surgical Equipment",
      description: "State-of-the-art surgical tools and equipment for precise medical procedures."
    },
    {
      title: "Medical Devices",
      description: "Innovative medical devices engineered to improve patient care and treatment efficiency."
    },
    {
      title: "Diagnostic Equipment",
      description: "Cutting-edge diagnostic tools for accurate medical assessments and monitoring."
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Products</h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover our range of medical and surgical equipment, designed with precision and innovation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                description={product.description}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
