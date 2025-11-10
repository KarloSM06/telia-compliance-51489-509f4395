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
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-sm text-purple-600 uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
              Why Businesses Love Our AI Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Real companies, real results, real testimonials
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 100}>
              <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-8 shadow-lg">
                {/* 5 stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-purple-600 fill-purple-600" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                  )}
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
