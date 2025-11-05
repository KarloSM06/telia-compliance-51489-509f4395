import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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

const projects = [
  {
    title: "AI Röstassistent för Service",
    description: "Automatiserad bokningshantering för VVS-företag",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop",
    span: "md:col-span-2 md:row-span-2",
    height: "h-[400px] md:h-auto"
  },
  {
    title: "Lead Generation B2B",
    description: "AI-driven prospektering och kvalificering",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    span: "",
    height: "h-[200px]"
  },
  {
    title: "E-handel Automation",
    description: "Komplett orderhantering med AI",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    span: "",
    height: "h-[200px]"
  },
  {
    title: "Dashboard & Analytics",
    description: "Real-time insikter för bättre beslut",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    span: "",
    height: "h-[200px]"
  },
  {
    title: "CRM Integration",
    description: "Sömlös koppling till era system",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=400&fit=crop",
    span: "md:col-span-2",
    height: "h-[200px]"
  },
];

export const BentoGrid = () => {
  return (
    <section id="work" className="w-full py-12 md:py-24 lg:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Portfolio
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Våra Lösningar
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Se hur vi har hjälpt företag att automatisera och växa
            </motion.p>
          </div>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-7xl gap-3 py-12 md:grid-cols-4 md:grid-rows-2 lg:gap-3"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemFadeIn}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`group relative overflow-hidden rounded-3xl ${project.span} ${project.height}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-sm">{project.description}</p>
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-3xl bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
                    >
                      Läs mer <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center pb-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="rounded-3xl group">
              Se Alla Case Studies
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
