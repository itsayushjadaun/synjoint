
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:top_center] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000000_70%,transparent_100%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            <h1 className="text-5xl font-bold mb-4">
              Synjoint,
              <br />
              The Most
              <br />
              <span className="text-6xl">Preferred</span>
              <br />
              Workplace!
            </h1>
            <p className="text-2xl mb-8">2024-25</p>
            <div className="flex items-center space-x-2">
              <span className="text-xl">Recognised by</span>
              <span className="text-2xl font-bold">MARKSMEN DAILY</span>
            </div>
            
            {/* Slider dots */}
            <div className="flex space-x-2 mt-8">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === 1 ? "bg-synjoint-orange" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Awards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/lovable-uploads/274c7dca-7bb5-45ca-84ae-807b8a8c3f00.png"
              alt="Awards and Recognition"
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Enquire Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-4 right-4"
        >
          <button className="bg-synjoint-orange text-white px-6 py-2 rounded-md hover:bg-synjoint-orange/90 transition-colors duration-200 flex items-center space-x-2">
            <span className="text-sm font-medium">ENQUIRE</span>
            <span className="text-sm font-medium">NOW</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
