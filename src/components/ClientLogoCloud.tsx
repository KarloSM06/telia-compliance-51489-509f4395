import { cn } from "@/lib/utils";
import stockholmAirCondition from "@/assets/stockholm-air-condition.png";
import bremilersVvs from "@/assets/bremilers-vvs.png";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
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
  return <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <AnimatedSection>
          <h2 className="mb-12 text-center font-medium text-2xl text-muted-foreground tracking-tight md:text-3xl">Senaste projekt vi är stolta över {" "}
            <span className="font-semibold text-primary">samarbetar</span> med.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className={cn("relative grid grid-cols-2 border-x md:grid-cols-2", className)} {...props}>
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
  return <div className={cn("group relative flex items-center justify-center bg-background px-8 py-16 md:p-16 overflow-hidden", className)} {...props}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
      </div>
      <img alt={logo.alt} className="pointer-events-none select-none object-contain dark:brightness-0 dark:invert w-full transition-all duration-300 group-hover:scale-110 group-hover:brightness-110" style={{
      height: logo.height ? `${logo.height}px` : 'auto',
      maxHeight: logo.height ? `${logo.height}px` : '350px'
    }} height={logo.height || "auto"} src={logo.src} width={logo.width || "auto"} />
      {children}
    </div>;
}