
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-synjoint-darkblue to-synjoint-blue">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:40px] bg-[position:top_center] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Animated dots */}
      <div className="absolute w-full h-full">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white"
          >
            <h4 className="text-lg md:text-xl mb-3 font-light text-white/80">Welcome to SYNJOINT</h4>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Advanced Orthopedic
              <br />
              <span className="text-synjoint-orange">Implant Solutions</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl">
              Leading innovator in medical devices & orthopedic solutions - specializing in hip and knee joint arthroplasty systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="/products" className="btn-accent">
                Explore Products
              </a>
              <a href="/contact" className="btn-secondary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                Contact Us
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-xl font-semibold">Certified</span>
                <span className="text-white/70">ISO 13485:2016</span>
              </div>
              <div className="h-8 w-px bg-white/30"></div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">5+ Years</span>
                <span className="text-white/70">Experience</span>
              </div>
              <div className="h-8 w-px bg-white/30"></div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">100+</span>
                <span className="text-white/70">Clients</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src="/lovable-uploads/image (8).jpg"
              alt="Orthopedic Implants"
              className="w-full rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-sm uppercase tracking-wider text-white/80">Trusted by</span>
              <h3 className="text-2xl text-white font-bold">Leading Healthcare Providers</h3>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.a
  href="#about"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.7,
    delay: 0.8,
    y: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1.5
    }
  }}
  className="absolute bottom-0.01 left-[50%] transform -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-white transition-colors"
>
  <span className="text-sm mb-2">Scroll Down</span>
  <ArrowDown className="h-5 w-5" />
</motion.a>

      </div>
    </div>
  );
};

export default Hero;
