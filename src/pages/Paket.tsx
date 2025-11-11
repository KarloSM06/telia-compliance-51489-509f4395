import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { Footer } from "@/components/Footer";
import { StickyPackageCards } from "@/components/home/StickyPackageCards";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { aiPackages } from "@/data/packages";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { useNavigate } from "react-router-dom";

const Paket = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleViewDetails = (pkg: any) => {
    // Navigate to package details or open modal
    console.log("View package details:", pkg);
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavbar />
      <AuroraBackground className="h-auto">
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-normal text-gray-900 mb-6">
              Våra AI-Paket
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Välj det paket som passar er verksamhet bäst
            </p>
          </div>
          <StickyPackageCards 
            packages={aiPackages} 
            onBookDemo={() => setIsConsultationModalOpen(true)} 
            onViewDetails={handleViewDetails}
          />
        </div>
      </AuroraBackground>
      <Footer />
      <ConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen} 
      />
    </div>
  );
};

export default Paket;
