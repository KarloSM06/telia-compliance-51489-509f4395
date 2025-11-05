"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { Industry } from "@/data/industries";

export interface IndustryGalleryProps {
  industries: Industry[];
  onIndustryClick: (industryId: string) => void;
}

export const IndustryGallery = ({
  industries,
  onIndustryClick,
}: IndustryGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <div className="relative">
      {/* Desktop Navigation Arrows */}
      <div className="hidden md:flex absolute -top-20 right-0 gap-2 z-10">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            carouselApi?.scrollPrev();
          }}
          disabled={!canScrollPrev}
          className="disabled:pointer-events-auto hover:bg-primary/10"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            carouselApi?.scrollNext();
          }}
          disabled={!canScrollNext}
          className="disabled:pointer-events-auto hover:bg-primary/10"
        >
          <ArrowRight className="size-5" />
        </Button>
      </div>

      {/* Carousel */}
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: true,
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <CarouselItem
                  key={industry.id}
                  className="max-w-[320px] pl-[20px] lg:max-w-[400px]"
                >
                  <button
                    onClick={() => onIndustryClick(industry.id)}
                    className="group rounded-xl w-full text-left transform-gpu will-change-transform"
                  >
                    <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]" style={{ contain: 'layout' }}>
                      <img
                        src={industry.image}
                        alt={industry.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 transform-gpu"
                      />
                      <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-6 left-6 p-3 rounded-xl bg-background/90 backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                        <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                          {industry.name}
                        </div>
                        <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                          {industry.description}
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          Boka konsultation{" "}
                          <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {industries.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
