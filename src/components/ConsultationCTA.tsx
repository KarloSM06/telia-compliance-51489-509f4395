import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ConsultationModal } from "@/components/ConsultationModal";

export const ConsultationCTA = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <section id="kontakt" className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-5xl md:text-6xl font-display font-normal text-gray-900 mb-6">
            Låt AI göra jobbet så du kan skala snabbare
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Boka ett 20-minuters samtal idag och se hur snabbt AI kan transformera din verksamhet
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-full text-lg transition-colors"
            >
              Boka ett möte
            </button>
          </div>
        </AnimatedSection>
      </div>

      <ConsultationModal
        open={isConsultationModalOpen}
        onOpenChange={setIsConsultationModalOpen}
      />
    </section>
  );
};
