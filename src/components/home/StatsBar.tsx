import { motion } from "framer-motion";
import { Phone, TrendingUp, Shield, Users } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function StatsBar() {
  const stats = [
    {
      icon: Phone,
      value: "500+",
      label: "Samtal/månad",
      color: "text-cyan-500"
    },
    {
      icon: Users,
      value: "98%",
      label: "Nöjda kunder",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      value: "3x",
      label: "Ökad effektivitet",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      value: "30",
      label: "Dagars garanti",
      color: "text-green-500"
    }
  ];

  return (
    <section className="relative py-12 lg:py-16">
      <div className="container mx-auto px-6">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:scale-105"
                >
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 ${stat.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
