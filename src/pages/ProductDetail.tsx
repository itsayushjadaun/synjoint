
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  features: string[];
  image: string;
  specifications: Record<string, string>;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use dummy data
    const dummyProducts: Product[] = [
      {
        id: "orthopedic-implants",
        title: "Orthopedic Implants",
        description: "Advanced orthopedic solutions designed for optimal patient outcomes and faster recovery.",
        fullDescription: "Our orthopedic implants represent the cutting edge of medical technology, designed after years of research and clinical testing. These implants are made from biocompatible materials that integrate seamlessly with the body's natural systems, reducing rejection rates and accelerating healing times.",
        features: [
          "Biocompatible titanium alloy construction",
          "Anatomically optimized designs",
          "Surface treatments for enhanced osseointegration",
          "MRI-compatible options available",
          "Comprehensive size range to fit diverse patient anatomy"
        ],
        image: "/lovable-uploads/image (2).jpg",
        specifications: {
          "Material": "Medical-grade titanium alloy",
          "Sterilization": "Gamma radiation",
          "Shelf Life": "5 years",
          "Regulatory": "FDA & CE approved",
          "Packaging": "Double sterile barrier"
        }
      },
      {
        id: "surgical-equipment",
        title: "Surgical Equipment",
        description: "State-of-the-art surgical tools and equipment for precise medical procedures.",
        fullDescription: "Our surgical equipment portfolio includes precision-engineered instruments designed to enhance surgical accuracy and efficiency. Each tool undergoes rigorous quality control to ensure reliability in the most critical moments of surgery, providing surgeons with the confidence they need to achieve optimal outcomes.",
        features: [
          "Ergonomic handle designs to reduce surgeon fatigue",
          "Precision-machined cutting surfaces",
          "Corrosion-resistant materials",
          "Compatible with standard sterilization protocols",
          "Designed with input from leading surgeons"
        ],
        image: "/lovable-uploads/image (4).jpg",
        specifications: {
          "Material": "Surgical-grade stainless steel",
          "Finish": "Satin non-reflective",
          "Hardness": "HRC 50-52",
          "Sterilization": "Autoclave compatible",
          "Warranty": "Lifetime against manufacturing defects"
        }
      },
      {
        id: "medical-devices",
        title: "Medical Devices",
        description: "Innovative medical devices engineered to improve patient care and treatment efficiency.",
        fullDescription: "Our medical devices incorporate the latest technological advancements to address critical healthcare challenges. Designed with both practitioners and patients in mind, these devices optimize treatment delivery while enhancing comfort and safety throughout the care process.",
        features: [
          "Intuitive user interfaces for healthcare professionals",
          "Real-time monitoring capabilities",
          "Wireless connectivity for data integration",
          "Energy-efficient operation",
          "Compact design for space-constrained environments"
        ],
        image: "/lovable-uploads/image (5).jpg",
        specifications: {
          "Power": "Rechargeable lithium-ion battery",
          "Battery Life": "12 hours continuous operation",
          "Display": "High-resolution touch screen",
          "Connectivity": "Bluetooth 5.0, Wi-Fi",
          "Certifications": "ISO 13485, IEC 60601"
        }
      },
      {
        id: "diagnostic-equipment",
        title: "Diagnostic Equipment",
        description: "Cutting-edge diagnostic tools for accurate medical assessments and monitoring.",
        fullDescription: "Our diagnostic equipment combines precision engineering with advanced analytics to deliver reliable results quickly. These systems are designed to streamline the diagnostic process, allowing healthcare providers to make informed treatment decisions with confidence based on accurate, timely data.",
        features: [
          "High-sensitivity sensors for accurate measurements",
          "Automated calibration systems",
          "Result analysis with AI-assisted interpretation",
          "Patient data management and integration",
          "Remote monitoring capabilities"
        ],
        image: "/lovable-uploads/image (7).jpg",
        specifications: {
          "Accuracy": "±0.1% across operating range",
          "Processing Speed": "Results in under 60 seconds",
          "Sample Size": "Micro-sampling capability",
          "Data Storage": "Cloud-based with local backup",
          "Interface": "7\" color touchscreen"
        }
      }
    ];

    setTimeout(() => {
      const foundProduct = dummyProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 500); // Simulate loading
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse">Loading product details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <Button 
            variant="outline" 
            className="mb-8"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={product.image}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{product.fullDescription}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-synjoint-blue text-white mr-3 text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={index} className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="font-medium text-gray-900 dark:text-white">{key}</div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
