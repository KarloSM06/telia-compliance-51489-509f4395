import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export const FAQSection = () => {
  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Vanliga Frågor
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border-b border-white/10 last:border-0"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 text-base md:text-lg font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
