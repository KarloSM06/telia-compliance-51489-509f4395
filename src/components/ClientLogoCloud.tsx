import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  return <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-12 text-center font-medium text-2xl text-muted-foreground tracking-tight md:text-3xl">
          Företag vi{" "}
          <span className="font-semibold text-primary">samarbetar</span> med.
        </h2>

        <div className={cn("relative grid grid-cols-2 border-x md:grid-cols-2", className)} {...props}>
          <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

          <LogoCard className="relative border-r border-b" logo={{
          src: stockholmAirCondition,
          alt: "Stockholm Air Condition",
          height: 200
        }}>
            <PlusIcon className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6" strokeWidth={1} />
          </LogoCard>

          <LogoCard className="border-b" logo={{
          src: bremilersVvs,
          alt: "Bremilers VVS AB",
          height: 200
        }} />

          

          

          

          

          

          

          <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
        </div>
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
  return <div className={cn("flex items-center justify-center bg-background px-8 py-16 md:p-16", className)} {...props}>
      <img 
        alt={logo.alt} 
        className="pointer-events-none select-none object-contain dark:brightness-0 dark:invert w-full" 
        style={{ height: logo.height ? `${logo.height}px` : 'auto', maxHeight: logo.height ? `${logo.height}px` : '200px' }}
        height={logo.height || "auto"} 
        src={logo.src} 
        width={logo.width || "auto"} 
      />
      {children}
    </div>;
}