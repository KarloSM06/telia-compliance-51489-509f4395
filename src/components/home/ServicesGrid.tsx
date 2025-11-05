import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Workflow, 
  Zap, 
  HeadphonesIcon,
  LineChart,
  Shield,
  ArrowRight
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const services = [
  {
    icon: Bot,
    title: "AI-assistenter",
    description: "Intelligenta chatbots och röstassistenter som hanterar kundservice, bokningar och försäljning dygnet runt med naturlig konversation.",
  },
  {
    icon: Workflow,
    title: "Processautomation",
    description: "Automatisera repetitiva uppgifter och workflows. Från offertgenerering till fakturahantering – frigör tid för det som verkligen skapar värde.",
  },
  {
    icon: Zap,
    title: "Smart Integration",
    description: "Koppla samman alla era system sömlöst. CRM, bokningssystem, ekonomi och kommunikationsplattformar i perfekt samspel.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "AI-driven kundservice som aldrig sover. Snabba svar, bokningar och problemlösning även utanför kontorstid.",
  },
  {
    icon: LineChart,
    title: "Datainsikter",
    description: "Få actionable insights från all er data. AI analyserar mönster, förutser behov och ger rekommendationer för bättre beslut.",
  },
  {
    icon: Shield,
    title: "Säker & Skalbar",
    description: "Enterprise-grade säkerhet och infrastruktur som växer med er verksamhet. GDPR-kompatibelt och svenskhostat.",
  },
];

export const ServicesGrid = () => {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Funktioner
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Vad Vi Erbjuder
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Kraftfulla AI-lösningar som transformerar hur ni arbetar
            </motion.p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl items-center gap-3 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemFadeIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
              >
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                <div className="relative space-y-3">
                  <div className="mb-4">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link to="#contact" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                    Läs mer
                  </Link>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};
