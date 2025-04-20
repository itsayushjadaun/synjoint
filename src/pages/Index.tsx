
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Statistics from "../components/Statistics";
import Features from "../components/Features";
import About from "../components/About";
import ProductShowcase from "../components/ProductShowcase";
import Testimonials from "../components/Testimonials";
import News from "../components/News";
import Certifications from "../components/Certifications";
import CallToAction from "../components/CallToAction";
import StakeholdersSection from "../components/StakeholdersSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Index = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId) {
          document.querySelector(targetId)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="w-full">
        {/* Hero Section with Scroll Indicator */}
        <section id="hero">
          <Hero />
        </section>
        
        {/* Scroll Indicator */}
        <motion.div
          className="fixed bottom-5 right-5 z-40 flex flex-col items-center"
          style={{ opacity }}
        >
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 dark:border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mt-2"
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div ref={sectionsRef}>
          <About />
          <Statistics />
          <ProductShowcase />
          <StakeholdersSection />
          <Features />
          <Testimonials />
          <Certifications />
          <ContactSection />
          <News />
          <CallToAction />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
