import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuoteModal } from "@/components/QuoteModal";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Footer = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section before footer */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-t border-primary/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Redo att komma igång?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Kontakta oss idag för en kostnadsfri offert och upptäck hur Hiems kan transformera era säljsamtal.
          </p>
          <Button 
            size="lg"
            onClick={() => setShowQuoteModal(true)}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            Få offert
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hiems</h3>
            <p className="text-gray-400">
              AI-driven kvalitetskontroll för säljsamtal
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Snabblänkar</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/om-oss" className="text-gray-400 hover:text-white transition-colors">
                  Om oss
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-400 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/exempelrapport" className="text-gray-400 hover:text-white transition-colors">
                  Exempelrapport
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>info@hiems.se</li>
              <li>+46 XX XXX XX XX</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Juridiskt</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/regelverk" className="text-gray-400 hover:text-white transition-colors">
                  Regelverk
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Hiems. Alla rättigheter förbehållna.</p>
        </div>
      </div>
      
      <QuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </footer>
  );
};
