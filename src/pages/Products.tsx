
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ProductCard = ({ title, description, onClick }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <h3 className="text-xl font-semibold text-synjoint-blue dark:text-blue-400 mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const Products = () => {
  const navigate = useNavigate();
  
  const products = [
    {
      id: "orthopedic-implants",
      title: "Orthopedic Implants",
      description: "Advanced orthopedic solutions designed for optimal patient outcomes and faster recovery."
    },
    {
      id: "surgical-equipment",
      title: "Surgical Equipment",
      description: "State-of-the-art surgical tools and equipment for precise medical procedures."
    },
    {
      id: "medical-devices",
      title: "Medical Devices",
      description: "Innovative medical devices engineered to improve patient care and treatment efficiency."
    },
    {
      id: "diagnostic-equipment",
      title: "Diagnostic Equipment",
      description: "Cutting-edge diagnostic tools for accurate medical assessments and monitoring."
    }
  ];

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Products</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Discover our range of medical and surgical equipment, designed with precision and innovation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                id={product.id}
                title={product.title}
                description={product.description}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
