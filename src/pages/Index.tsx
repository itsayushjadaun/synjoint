
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem><Hero /></CarouselItem>
          <CarouselItem><Mission /></CarouselItem>
          <CarouselItem><Statistics /></CarouselItem>
          <CarouselItem><Features /></CarouselItem>
          <CarouselItem><ProductsPreview /></CarouselItem>
          <CarouselItem><Awards /></CarouselItem>
          <CarouselItem><Events /></CarouselItem>
          <CarouselItem><Partnerships /></CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>

      <Certifications />
      <News />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Index;
