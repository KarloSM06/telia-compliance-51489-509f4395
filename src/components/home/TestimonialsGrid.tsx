import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";
const testimonials = caseStudies.map((study, idx) => ({
  id: study.id,
  quote: study.testimonial.text,
  author: study.testimonial.author,
  role: study.testimonial.role,
  company: study.company,
  image: [karloImage, antonImage, emilImage][idx] || null
}));
export const TestimonialsGrid = () => {
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map((testimonial, index) => <AnimatedSection key={testimonial.id} delay={index * 100}>
              
            </AnimatedSection>)}
        </div>
      </div>
    </section>;
};