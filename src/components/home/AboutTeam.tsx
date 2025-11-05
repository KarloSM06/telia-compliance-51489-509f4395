import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

const team = [
  { 
    name: "Karlo Bistrovic", 
    role: "AI & Automation Specialist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
  },
  { 
    name: "Anton Lindberg", 
    role: "Integration Expert",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop"
  },
  { 
    name: "Emil Andersson", 
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop"
  },
];

export const AboutTeam = () => {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl"
      >
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-3">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 p-6"
          >
            <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Om Oss</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Vår Historia</h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Hiems grundades med en vision att demokratisera AI-automation för svenska företag. Vi tröttnade på att se 
              hur företag slösade tid på manuella processer när teknologin redan fanns för att automatisera.
            </p>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Vårt team kombinerar djup teknisk expertis med affärsförståelse. Vi bygger inte bara tekniska lösningar – 
              vi skapar verktyg som verkligen driver tillväxt och sparar tid för våra kunder.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" size="lg" className="rounded-3xl">
                Vår Metod
              </Button>
              <Button variant="outline" size="lg" className="rounded-3xl">
                Kontakta Oss
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop"
                alt="Hiems Team"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        <div className="mt-16 px-6 pb-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold tracking-tighter sm:text-3xl"
          >
            Möt Vårt Team
          </motion.h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemFadeIn}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[300px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
