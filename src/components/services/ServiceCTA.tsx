import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCTAProps {
  onBookDemo?: () => void;
}

export const ServiceCTA = ({ onBookDemo }: ServiceCTAProps) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/#kontakt");
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Redo att komma igång?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Låt oss visa hur vi kan transformera ditt företag med AI och automation. 
            Boka ett kostnadsfritt demo idag.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onBookDemo}
              className="bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg px-8 py-6 group"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Boka demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-accent/10"
              onClick={handleContactClick}
            >
              Kontakta oss
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
