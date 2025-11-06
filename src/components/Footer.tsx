import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { Linkedin, Sun, Moon, ArrowUp, Mail, Phone, Instagram, Facebook } from "lucide-react";

const navigation = {
  navigering: [
    { name: "Hem", href: "/" },
    { name: "Lösningar", href: "/#paket" },
    { name: "Bransch", href: "/#branscher" },
    { name: "Case", href: "/#case" },
  ],
  foretag: [
    { name: "Om oss", href: "/om-oss" },
    { name: "Kontakt", href: "/#kontakt" },
  ],
  legal: [
    { name: "Integritetspolicy", href: "/regelverk#integritetspolicy" },
    { name: "Användarvillkor", href: "/regelverk#anvandarvillkor" },
    { name: "Allmänna Villkor", href: "/regelverk#allmanna-villkor" },
    { name: "Acceptable Use Policy", href: "/regelverk#acceptable-use-policy" },
    { name: "Cookie-policy", href: "/regelverk#cookie-policy" },
    { name: "Databehandlingsavtal", href: "/regelverk#databehandlingsavtal" },
    { name: "Service Level Agreement", href: "/regelverk#service-level-agreement" },
    { name: "Tilläggsavtal AI-system", href: "/regelverk#tillaggsavtal-ai-system" },
  ],
};

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-dotted border-border">
        <button
          onClick={() => setTheme("light")}
          className="mr-3 rounded-full bg-foreground p-2 text-background dark:bg-background dark:text-foreground transition-colors"
          aria-label="Light mode"
        >
          <Sun className="h-5 w-5" strokeWidth={1} />
        </button>

        <button 
          type="button" 
          onClick={handleScrollTop}
          className="hover:text-primary transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-3 w-3" />
        </button>

        <button
          onClick={() => setTheme("dark")}
          className="ml-3 rounded-full bg-background p-2 text-foreground dark:bg-foreground dark:text-background transition-colors"
          aria-label="Dark mode"
        >
          <Moon className="h-5 w-5" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export const Footer = () => {
  const underlineClass = "hover:-translate-y-1 border border-dotted border-border rounded-xl p-2.5 transition-transform";

  return (
    <footer className="mx-auto w-full border-b border-t border-border px-2">
      {/* Hero Section with Logo and Description */}
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center justify-center rounded-full">
            <img src={hiems_logo} alt="Hiems" className="h-16 w-16" />
          </div>
        </Link>
        <p className="bg-transparent text-center text-xs leading-4 text-muted-foreground md:text-left">
          Välkommen till Hiems, där AI-innovation möter företagsstrategi. Vi är specialiserade på att skapa skräddarsydda AI-ekosystem som transformerar företag och driver verklig förändring. Vårt uppdrag är att göra AI tillgängligt och kraftfullt för alla organisationer, från startup till storföretag. Vi tror på att teknologi ska vara ett verktyg för mänsklig framgång, inte ersätta den. Med Hiems får du en partner som förstår både tekniken och ditt företag.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-border"></div>
        <div className="py-10">
          <div className="grid grid-cols-2 flex-row justify-between gap-6 leading-6 md:grid-cols-4 md:flex">
            {/* Navigering */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Navigering</h4>
              <ul className="flex flex-col space-y-2">
                {navigation.navigering.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Företag */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Företag</h4>
              <ul className="flex flex-col space-y-2">
                {navigation.foretag.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontakt */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Kontakt</h4>
              <ul className="flex flex-col space-y-2">
                <li>
                  <a
                    href="tel:+46706571532"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    070-657 15 32
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@hiems.se"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    contact@hiems.se
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legalt</h4>
              <ul className="flex flex-col space-y-2">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-b border-dotted border-border"></div>
      </div>

      {/* Social Media Links and Theme Toggle */}
      <div className="flex flex-wrap justify-center gap-y-6 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <a
            href="mailto:contact@hiems.se"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
            aria-label="Email"
          >
            <Mail strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/company/hiems"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
            aria-label="LinkedIn"
          >
            <Linkedin strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/hiems_ai/"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
            aria-label="Instagram"
          >
            <Instagram strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61582105616722"
            rel="noreferrer"
            target="_blank"
            className={underlineClass}
            aria-label="Facebook"
          >
            <Facebook strokeWidth={1.5} className="h-5 w-5" />
          </a>
        </div>
        <ThemeToggle />
      </div>

      {/* Copyright */}
      <div className="mx-auto mb-10 mt-6 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-muted-foreground">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>Hiems HB. Alla rättigheter förbehållna.</span>
        </div>
      </div>
    </footer>
  );
};