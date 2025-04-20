
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Footer from "../components/Footer";
import StakeholdersSection from "../components/StakeholdersSection";

const AboutPage = () => {
  useEffect(() => {
    // Update document title and meta description for SEO
    document.title = "About SYNJOINT | Leading Orthopedic Implant Solutions";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content", 
        "SYNJOINT Tech Pvt Ltd is a leading innovator in orthopedic implants and medical devices, specializing in hip and knee joint arthroplasty systems."
      );
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <section className="pt-32 pb-16 bg-gradient-to-r from-synjoint-darkblue to-synjoint-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About SYNJOINT</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Leading innovator in orthopedic implants and medical devices, committed to improving patient outcomes
            </p>
          </motion.div>
        </div>
      </section>
      
      <About />
      <StakeholdersSection />
      
      <Footer />
    </div>
  );
};

export default AboutPage;
