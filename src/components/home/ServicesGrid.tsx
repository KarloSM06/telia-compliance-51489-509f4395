import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { servicesData } from "@/data/services";

export const ServicesGrid = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              🚀 Våra Tjänster & Teknologier
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Vi bygger intelligenta ekosystem som kopplar samman AI, automation och affärsdata – 
            för att göra ditt företag snabbare, smartare och mer lönsamt.<br />
            <span className="font-semibold text-foreground">Allt vi skapar kan ägas av dig, helt utan beroenden.</span> 
            {" "}Vi finns alltid här för support, underhåll och vidareutveckling.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link 
                  to={`/tjanster/${service.slug}`}
                  className="block h-full p-8 rounded-3xl border border-border bg-card hover:shadow-elegant transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-button">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.shortDescription}
                    </p>
                    
                    <div className="flex items-center text-primary font-semibold group-hover:text-secondary transition-colors">
                      Läs mer
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
