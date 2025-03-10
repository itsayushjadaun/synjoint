
import { useEffect, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);

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
      
      <div ref={sectionsRef} className="w-full overflow-hidden">
        <Carousel className="w-full" opts={{ loop: true, align: "start" }} onSelect={(api) => setActiveIndex(api?.selectedScrollSnap() || 0)}>
          <CarouselContent>
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="hero" className="w-full">
                <Hero />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="mission" className="w-full">
                <Mission />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="statistics" className="w-full">
                <Statistics />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="features" className="w-full">
                <Features />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="products" className="w-full">
                <ProductsPreview />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="awards" className="w-full">
                <Awards />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="events" className="w-full">
                <Events />
              </section>
            </CarouselItem>
            
            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="partnerships" className="w-full">
                <Partnerships />
              </section>
            </CarouselItem>

            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="testimonials" className="w-full">
                <Testimonials />
              </section>
            </CarouselItem>

            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="certifications" className="w-full">
                <Certifications />
              </section>
            </CarouselItem>

            <CarouselItem className="min-h-[90vh] flex items-center justify-center">
              <section id="news" className="w-full">
                <News />
              </section>
            </CarouselItem>
          </CarouselContent>
          
          {/* Carousel navigation */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
            <div className="flex space-x-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-full px-4 py-2">
              {[...Array(11)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
                    i === activeIndex ? "bg-synjoint-orange w-4" : "bg-gray-400 dark:bg-gray-600"
                  }`}
                  onClick={() => {
                    const api = (sectionsRef.current as any)?.emblaApi;
                    if (api) api.scrollTo(i);
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-10 md:block">
            <CarouselPrevious className="md:left-4 md:absolute md:top-1/2 md:-translate-y-1/2 h-8 w-8 md:h-10 md:w-10 opacity-70 hover:opacity-100" />
            <CarouselNext className="md:right-4 md:absolute md:top-1/2 md:-translate-y-1/2 h-8 w-8 md:h-10 md:w-10 opacity-70 hover:opacity-100" />
          </div>
        </Carousel>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-900 transition-colors duration-300">
        <CallToAction />
      </div>
    </div>
  );
};

export default Index;
