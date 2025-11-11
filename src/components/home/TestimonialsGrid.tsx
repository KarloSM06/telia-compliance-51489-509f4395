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
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Kundcase
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900">
              Vad Våra Kunder Säger
            </h2>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 100}>
              <div className="border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  {testimonial.image && (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-display font-normal text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>;
};