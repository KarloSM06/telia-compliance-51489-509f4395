import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white py-10 px-5">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-10 justify-between">
        
        {/* Om företaget */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="mb-2.5 text-lg font-semibold">Hiems Handelsbolag</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Revolutionerande AI-driven automationslösning som säkerställer att ditt företag alltid arbetar smartare och mer effektivt.
          </p>
        </div>
        
        {/* Snabblänkar */}
        <div className="flex-1 min-w-[140px]">
          <h4 className="mb-2.5 text-base font-semibold">Snabblänkar</h4>
          <ul className="list-none p-0 m-0 text-muted-foreground text-sm space-y-1">
            <li><Link to="/" className="hover:text-white transition-colors">Hem</Link></li>
            <li><Link to="/hermes" className="hover:text-white transition-colors">Produkter</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/demo" className="hover:text-white transition-colors">Demo</Link></li>
            <li><Link to="/om-oss" className="hover:text-white transition-colors">Om oss</Link></li>
          </ul>
        </div>

        {/* Kontaktuppgifter */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="mb-2.5 text-base font-semibold">Kontaktuppgifter</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <a href="mailto:contact@hiems.se" className="hover:text-white transition-colors">
              contact@hiems.se
            </a>
            <br />
            070-657 15 32
          </p>
        </div>

        {/* Juridiskt */}
        <div className="flex-1 min-w-[160px]">
          <h4 className="mb-2.5 text-base font-semibold">Juridiskt</h4>
          <ul className="list-none p-0 m-0 text-muted-foreground text-sm space-y-1">
            <li><Link to="/regelverk#integritetspolicy" className="hover:text-white transition-colors">Integritetspolicy</Link></li>
            <li><Link to="/regelverk#anvandarvillkor" className="hover:text-white transition-colors">Användarvillkor</Link></li>
            <li><Link to="/regelverk#aup" className="hover:text-white transition-colors">Användarregler (AUP)</Link></li>
            <li><Link to="/regelverk#cookie-policy" className="hover:text-white transition-colors">Cookie-policy</Link></li>
            <li><Link to="/regelverk#dpa" className="hover:text-white transition-colors">Databehandlingsavtal (DPA)</Link></li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 mt-8 pt-5 text-center text-muted-foreground text-xs">
        © 2025 Hiems HB. Alla rättigheter förbehållna.
      </div>
    </footer>
  );
};
