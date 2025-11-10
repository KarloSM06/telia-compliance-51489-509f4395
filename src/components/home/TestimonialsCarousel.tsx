import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";

export const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Hiems har halverat vårt manuella arbete. Nu lägger vi tiden på kunder istället för processer.",
      author: "Karlo Mangione",
      role: "VD",
      company: "Stockholm Air Condition",
      image: karloImage
    },
    {
      quote: "AI-lösningarna från Hiems gav oss bättre beslut, snabbare. ROI:n var uppenbar redan första månaden.",
      author: "Anton Sällnäs",
      role: "Ägare",
      company: "Bremilers VVS",
      image: antonImage
    },
    {
      quote: "Implementeringen var smidig och supporten är exceptionell. Våra kunder märker verkligen skillnaden.",
      author: "Emil Westerberg",
      role: "VD",
      company: "Sätra Gräv & Schakt",
      image: emilImage
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Kundberättelser
          </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-primary w-8" 
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
