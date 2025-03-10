
import { useEffect, useRef } from "react";
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
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Awards from "../components/Awards";
import Events from "../components/Events";
import Partnerships from "../components/Partnerships";

const Index = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);

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
      
      <div ref={sectionsRef} className="w-full">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <section id="hero" className="w-full">
                <Hero />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="mission" className="w-full">
                <Mission />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="statistics" className="w-full">
                <Statistics />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="features" className="w-full">
                <Features />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="products" className="w-full">
                <ProductsPreview />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="awards" className="w-full">
                <Awards />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="events" className="w-full">
                <Events />
              </section>
            </CarouselItem>
            
            <CarouselItem>
              <section id="partnerships" className="w-full">
                <Partnerships />
              </section>
            </CarouselItem>
          </CarouselContent>
          <div className="md:block">
            <CarouselPrevious className="absolute left-4 z-10" />
            <CarouselNext className="absolute right-4 z-10" />
          </div>
        </Carousel>
      </div>

      <div className="mt-10">
        <Certifications />
        <News />
        <Testimonials />
        <CallToAction />
      </div>
    </div>
  );
};

export default Index;
