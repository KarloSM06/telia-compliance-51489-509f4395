import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    id: "faq-1",
    question: "How long does implementation take?",
    answer: "Vanligtvis 2-4 veckor från första möte till driftstart, beroende på komplexitet och omfattning av lösningen. Vi börjar med en behovsanalys, följt av konfiguration och integration, och avslutar med test och optimering."
  },
  {
    id: "faq-2",
    question: "Is any technical expertise required on my end?",
    answer: "Nej, du behöver ingen teknisk expertis. Vi hanterar all teknisk implementation, integration och support. Allt du behöver göra är att ge oss tillgång till era system och berätta om era behov."
  },
  {
    id: "faq-3",
    question: "How much does it cost to get started?",
    answer: "Kostnaden varierar beroende på vilken lösning och omfattning som passar er verksamhet. Vi erbjuder flexibla paket från 7 995 kr/mån för mindre lösningar upp till skräddarsydda enterprise-lösningar. Kontakta oss för en gratis konsultation och offert."
  },
  {
    id: "faq-4",
    question: "Which systems can you integrate with?",
    answer: "Vi integrerar med de flesta system via API:er - CRM (Salesforce, HubSpot, Pipedrive), bokningssystem (Calendly, SimplyBook), e-handelsplattformar (Shopify, WooCommerce), och många fler. Om du har ett specifikt system, kontakta oss så kollar vi möjligheterna."
  },
  {
    id: "faq-5",
    question: "Do we own the solution you build?",
    answer: "Ja, alla lösningar vi bygger kan ägas av dig helt utan beroenden. Du får tillgång till all kod och data, och kan när som helst välja att drifta systemet själva eller med en annan partner."
  },
  {
    id: "faq-6",
    question: "What happens if something goes wrong?",
    answer: "Vi erbjuder löpande support och övervakning av alla våra lösningar. Om något går fel får du omedelbar hjälp från vårt supportteam. Vi har också automatiska backup-system och redundans för att säkerställa maximal drifttid."
  }
];

export const FAQAccordion = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-sm text-purple-600 uppercase tracking-wider mb-2">FAQs</p>
            <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
              We've Got the Answers You're Looking For
            </h2>
            <p className="text-lg text-gray-600">
              Have a question? We're here to help.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id} 
                className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-xl px-6 shadow-lg"
              >
                <AccordionTrigger className="text-gray-900 text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};
