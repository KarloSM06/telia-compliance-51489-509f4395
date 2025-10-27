import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import eniroLogo from "@/assets/eniro-logo.png";
import linkedinLogo from "@/assets/linkedin-logo.png";
import claudeLogo from "@/assets/claude-logo.png";
import { Building2, Bot } from "lucide-react";

export function LeadProviderSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
            Välj din AI Lead-källa
          </h1>
          <p className="text-xl text-muted-foreground">
            Välj hur du vill prospektera - traditionellt eller AI-drivet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eniro Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-[#FFD700] group overflow-hidden"
            onClick={() => navigate('/dashboard/lead/eniro')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-[#FFA500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-12 pb-10 text-center relative">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] mb-6 shadow-lg group-hover:shadow-[#FFD700]/50 transition-shadow duration-300">
                <img src={eniroLogo} alt="Eniro" className="h-16 w-16 object-contain" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-[#2C3E50]">Leta med Eniro</h2>
              
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/50">
                  <Building2 className="h-5 w-5 text-[#FFA500]" />
                  <span className="text-sm font-semibold text-[#2C3E50]">Traditionell företagsdata</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Hitta företag och BRF:er baserat på traditionella kriterier som bransch, 
                antal anställda, omsättning och geografisk plats.
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFD700]" />
                  <span>Omfattande företagsdatabas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFA500]" />
                  <span>Avancerade filter</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FFD700]" />
                  <span>Strukturerad data</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claude + LinkedIn Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-[#0077B5] group overflow-hidden relative"
            onClick={() => navigate('/dashboard/lead/claude-linkedin')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0077B5]/10 via-transparent to-[#D97757]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-12 pb-10 text-center relative">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0077B5] to-[#D97757] mb-6 shadow-lg group-hover:shadow-[#0077B5]/50 transition-shadow duration-300 relative">
                <div className="flex gap-2">
                  <img src={linkedinLogo} alt="LinkedIn" className="h-10 w-10 object-contain" />
                  <img src={claudeLogo} alt="Claude" className="h-10 w-10 object-contain" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#0077B5] to-[#D97757] bg-clip-text text-transparent">
                  Leta med AI & LinkedIn
                </span>
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0077B5]/20 to-[#D97757]/20 border border-[#0077B5]/50">
                  <Bot className="h-5 w-5 text-[#D97757]" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-[#0077B5] to-[#D97757] bg-clip-text text-transparent">
                    Modern AI-driven prospektering
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Använd AI för intelligent lead-generering via LinkedIn och Claude. 
                Chatta för att hitta exakt de prospekt du söker.
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0077B5]" />
                  <span>AI-driven sökning</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#D97757]" />
                  <span>LinkedIn-integration</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#0077B5]" />
                  <span>Intelligent matchning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
