import { motion } from "framer-motion";
import { Calendar, Settings, Rocket } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
export function ProcessSteps() {
  const steps = [{
    icon: Calendar,
    title: "1. Boka demo",
    description: "Vi diskuterar era behov och visar hur AI kan transformera er verksamhet."
  }, {
    icon: Settings,
    title: "2. Anpassad lösning",
    description: "Vi designar och konfigurerar ett skräddarsytt AI-ekosystem för just er."
  }, {
    icon: Rocket,
    title: "3. Lansering",
    description: "Vi implementerar, testar och lanserar er lösning med full support."
  }];
  return <section className="relative py-16 lg:py-24">
      
    </section>;
}