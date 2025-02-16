
import { motion } from "framer-motion";

const Statistics = () => {
  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "100+", label: "Satisfied Clients" },
    { number: "500+", label: "Surgeries Supported" },
    { number: "10+", label: "Innovation Patents" }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Delivering World Class Healthcare Solutions</h2>
          <p className="mt-4 text-lg text-gray-600">
            Leading manufacturer and innovator in medical devices and orthopedic solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-synjoint-blue mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
