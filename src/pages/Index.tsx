
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Statistics from "../components/Statistics";
import Features from "../components/Features";
import Mission from "../components/Mission";
import ProductsPreview from "../components/ProductsPreview";
import Testimonials from "../components/Testimonials";
import News from "../components/News";
import Certifications from "../components/Certifications";
import CallToAction from "../components/CallToAction";

const Index = () => {
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Mission />
      <Statistics />
      <Features />
      <ProductsPreview />
      <Certifications />
      <News />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Index;
