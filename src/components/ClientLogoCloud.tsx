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

export function ClientLogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-8 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-2xl">
          Företag vi{" "}
          <span className="font-semibold text-primary">samarbetar</span> med.
        </h2>

        <div
          className={cn(
            "relative grid grid-cols-2 border-x md:grid-cols-4",
            className
          )}
          {...props}
        >
          <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

          <LogoCard
            className="relative border-r border-b bg-secondary dark:bg-secondary/30"
            logo={{
              src: stockholmAirCondition,
              alt: "Stockholm Air Condition",
            }}
          >
            <PlusIcon
              className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
              strokeWidth={1}
            />
          </LogoCard>

          <LogoCard
            className="border-b md:border-r"
            logo={{
              src: bremilersVvs,
              alt: "Bremilers VVS AB",
            }}
          />

          <LogoCard
            className="relative border-r border-b md:bg-secondary dark:md:bg-secondary/30"
            logo={{
              src: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=50&fit=crop&crop=center",
              alt: "Partner Company",
            }}
          >
            <PlusIcon
              className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
              strokeWidth={1}
            />
            <PlusIcon
              className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block"
              strokeWidth={1}
            />
          </LogoCard>

          <LogoCard
            className="relative border-b bg-secondary md:bg-background dark:bg-secondary/30 md:dark:bg-background"
            logo={{
              src: "https://images.unsplash.com/photo-1549421263-6064833b071b?w=200&h=50&fit=crop&crop=center",
              alt: "Technology Partner",
            }}
          />

          <LogoCard
            className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background dark:bg-secondary/30 md:dark:bg-background"
            logo={{
              src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=50&fit=crop&crop=center",
              alt: "Enterprise Client",
            }}
          >
            <PlusIcon
              className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden"
              strokeWidth={1}
            />
          </LogoCard>

          <LogoCard
            className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary dark:md:bg-secondary/30"
            logo={{
              src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=50&fit=crop&crop=center",
              alt: "Business Partner",
            }}
          />

          <LogoCard
            className="border-r"
            logo={{
              src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=50&fit=crop&crop=center",
              alt: "Strategic Partner",
            }}
          />

          <LogoCard
            className="bg-secondary dark:bg-secondary/30"
            logo={{
              src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=50&fit=crop&crop=center",
              alt: "Innovation Partner",
            }}
          />

          <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
        </div>
      </div>
    </section>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background px-4 py-8 md:p-8",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className="pointer-events-none h-8 select-none object-contain md:h-10 dark:brightness-0 dark:invert"
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
      />
      {children}
    </div>
  );
}
