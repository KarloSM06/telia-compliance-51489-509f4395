import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DemoBooking } from "@/components/DemoBooking";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Redo att säkerställa 100% compliance?
          </h2>
          <p className="mt-6 text-lg text-blue-100">
            Boka en kostnadsfri demo och se hur Hiems kan analysera era säljsamtal på 15 minuter. 
            Ingen bindningstid – starta eller pausa när ni vill.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <DemoBooking>
              <Button variant="hero" size="lg">
                Kontakta oss för demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DemoBooking>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Läs mer om lösningen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};