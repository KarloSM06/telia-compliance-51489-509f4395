import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";
import stockholmAirCondition from "@/assets/stockholm-air-condition.png";
import bremilersVvs from "@/assets/bremilers-vvs.png";
type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};
type LogoCloudProps = React.ComponentProps<"div">;
export function ClientLogoCloud({
  className,
  ...props
}: LogoCloudProps) {
  return <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Företag vi samarbetar med
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 font-light">
            Vi är stolta över att arbeta med ledande företag som litar på våra AI-lösningar
          </p>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className={cn("relative grid grid-cols-2 border-x md:grid-cols-2 rounded-lg overflow-hidden backdrop-blur-sm bg-background/50", className)} {...props}>
            <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

            <LogoCard className="relative border-r border-b" logo={{
            src: stockholmAirCondition,
            alt: "Stockholm Air Condition",
            height: 350
          }}>
              
            </LogoCard>

            <LogoCard className="border-b" logo={{
            src: bremilersVvs,
            alt: "Bremilers VVS AB",
            height: 350
          }} />

            

            

            

            

            

            

            <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
          </div>
        </AnimatedSection>
      </div>
    </section>;
}
type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};
function LogoCard({
  logo,
  className,
  children,
  ...props
}: LogoCardProps) {
  return <div className={cn("group relative flex items-center justify-center bg-background/80 backdrop-blur-sm px-8 py-16 md:p-16 overflow-hidden transition-all duration-500 hover:bg-primary/5", className)} {...props}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
      </div>
      <img alt={logo.alt} className="pointer-events-none select-none object-contain dark:brightness-0 dark:invert w-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 relative z-10" style={{
      height: logo.height ? `${logo.height}px` : 'auto',
      maxHeight: logo.height ? `${logo.height}px` : '350px'
    }} height={logo.height || "auto"} src={logo.src} width={logo.width || "auto"} />
      {children}
    </div>;
}