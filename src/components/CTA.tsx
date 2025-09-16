import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DemoBooking } from "@/components/DemoBooking";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Vill du veta hur många samtal som faktiskt följer riktlinjerna?
          </h2>
          <p className="mt-6 text-lg text-blue-100">
            Börja analysera era säljsamtal idag och säkerställ kvalitet i varje kundinteraktion.
            Få fullständig kontroll över regelefterlevnad med AI-teknik.
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