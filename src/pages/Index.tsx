
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Statistics from "../components/Statistics";
import Features from "../components/Features";
import ProductsPreview from "../components/ProductsPreview";
import Testimonials from "../components/Testimonials";

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
      <Statistics />
      <Features />
      <ProductsPreview />
      <Testimonials />
    </div>
  );
};

export default Index;
