
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
    
    // Handle special link functionality for Explore and Contact
    const exploreButton = document.getElementById('explore-button');
    const contactButton = document.getElementById('contact-button');
    
    if (exploreButton) {
      exploreButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('products')?.scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
    
    if (contactButton) {
      contactButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('contact')?.scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="w-full">
        {/* Hero Section with Animation Background */}
        <section id="hero" className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-synjoint-blue/20 to-synjoint-blue/5 dark:from-synjoint-darkblue/40 dark:to-synjoint-darkblue/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
            
            {/* Animated medical elements */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute w-40 h-40 rounded-full bg-synjoint-blue/10 dark:bg-synjoint-blue/5"
                style={{ top: '10%', left: '5%' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-64 h-64 rounded-full bg-synjoint-orange/10 dark:bg-synjoint-orange/5"
                style={{ top: '30%', right: '10%' }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute w-32 h-32 rounded-full bg-blue-400/10 dark:bg-blue-400/5"
                style={{ bottom: '15%', left: '15%' }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              
              {/* DNA helix animation */}
              <div className="absolute right-[5%] top-[20%] h-64 w-16 opacity-20 dark:opacity-15">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={`dna-${i}`}
                    className="absolute h-2 w-2 bg-synjoint-blue rounded-full"
                    style={{ top: `${i * 10}%` }}
                    animate={{
                      x: [0, 20, 0, -20, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
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
          <section id="about">
            <About />
          </section>
          <section id="statistics">
            <Statistics />
          </section>
          <section id="products">
            <ProductShowcase />
          </section>
          <section id="stakeholders">
            <StakeholdersSection />
          </section>
          <section id="features">
            <Features />
          </section>
          <section id="testimonials">
            <Testimonials />
          </section>
          <section id="certifications">
            <Certifications />
          </section>
          <section id="contact">
            <ContactSection />
          </section>
          <section id="news">
            <News />
          </section>
          <section id="cta">
            <CallToAction />
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
