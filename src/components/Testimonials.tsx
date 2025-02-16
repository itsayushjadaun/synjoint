
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Synjoint's innovative medical devices have revolutionized our surgical procedures.",
      author: "Dr. Rajesh Kumar",
      title: "Senior Orthopedic Surgeon",
      image: "/lovable-uploads/6033b195-d7ac-4581-b018-f92ee857b92b.png"
    },
    {
      quote: "Their commitment to quality and innovation sets new standards in medical technology.",
      author: "Dr. Sarah Smith",
      title: "Chief of Surgery",
      image: "/lovable-uploads/cef8ce24-f36c-4060-8c3e-41ce14874770.png"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Testimonials</h2>
        
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center px-8"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <blockquote className="text-xl text-gray-600 mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.title}</div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
