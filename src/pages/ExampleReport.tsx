import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, User, Phone, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
const ExampleReport = () => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const reportData = {
    date: "2024-01-15",
    agent: "Anna Andersson",
    callDuration: "12:34",
    totalCalls: 23,
    passedCalls: 19,
    warningCalls: 3,
    failedCalls: 1
  };
  const violations = [{
    id: 1,
    severity: "error",
    rule: "Felaktig prisinformation",
    description: "I verkligheten finns det startavgifter och tilläggskostnader som inte nämns. Bryter mot Marknadsföringslagen (MFL) eftersom konsumenten vilseleds med felaktig prisinformation.",
    quote: "\"Det här abonnemanget kostar bara 299 kr i månaden, inga avgifter tillkommer.\"",
    timestamp: "03:42",
    recommendation: "Informera alltid om tillägskostnader"
  }, {
    id: 2,
    severity: "error",
    rule: "Felaktig information om bindningstid",
    description: "Säljaren säger att det går att säga upp när som helst men egentligen är det 24 månaders bindningstid. Bryter mot Marknadsföringslagen.",
    quote: "\"Du kan säga upp när som helst utan kostnad\"",
    timestamp: "05:15",
    recommendation: "Informera korrekt om 24 månaders bindningstid från början."
  }, {
    id: 3,
    severity: "error",
    rule: "Felaktig information om ångerrätt",
    description: "Konsumenten har enligt Distansavtalslagen rätt till 14 dagars ångerrätt. Bryter mot lag, konsumenten får felaktig information om sina rättigheter.",
    quote: "\"Beställningen är nu lagd och du kan inte ångra dig\"",
    timestamp: "07:18",
    recommendation: "Informera kunden korrekt om 14 dagars ångerrätt"
  }];
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tillbaka till startsidan
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Exempelrapport</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            Genererad: {reportData.date}
          </div>
          <h2 className="text-3xl font-bold text-foreground">Kvalitetsrapport</h2>
          <p className="text-muted-foreground mt-2">
            Detaljerad analys av samtalsavlyssning enligt företagsriktlinjer
          </p>
        </div>

        {/* Overview Cards */}
        

        {/* Call Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Samtalsdetaljer
            </CardTitle>
            <CardDescription>
              Detaljerad information om det granskade samtalet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Agent</div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  {reportData.agent}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Samtalslängd</div>
                <div className="mt-1">{reportData.callDuration}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Datum</div>
                <div className="mt-1">{reportData.date}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Identifierade regelavvikelser</CardTitle>
            <CardDescription>
              Alla brott mot företagsriktlinjer som upptäckts i samtalet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {violations.map(violation => <div key={violation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(violation.severity)} className="flex items-center gap-1">
                      {getSeverityIcon(violation.severity)}
                      {violation.severity === "error" ? "Allvarligt" : "Anmärkning"}
                    </Badge>
                    <span className="font-medium">{violation.rule}</span>
                    <span className="text-sm text-muted-foreground">({violation.timestamp})</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Problem:</div>
                  <div className="text-sm">{violation.description}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Citat från samtalet:</div>
                  <div className="text-sm italic bg-muted/50 p-2 rounded border-l-4 border-primary">
                    {violation.quote}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Rekommendation:</div>
                  <div className="text-sm text-emerald-700">{violation.recommendation}</div>
                </div>
              </div>)}
          </CardContent>
        </Card>

        {/* Sales Analysis */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Säljteknisk analys</CardTitle>
            <CardDescription>
              Konstruktiv återkoppling och förbättringsförslag för säljaren
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3 bg-blue-50/50">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Förbättringsområde
                </Badge>
                <span className="font-medium">Informationshantering</span>
              </div>
              <div className="space-y-3">
                <div className="text-sm space-y-3">
                  <div>
                    <strong>Säljtekniska styrkor:</strong>
                    <ul className="ml-4 mt-1 list-disc space-y-1">
                      <li>Tydlig kommunikation och bra tonläge</li>
                      <li>Engagerande öppning som höll kunden intresserad</li>
                      <li>Strukturerat samtalsflöde</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong>Compliance-brister:</strong>
                    <ul className="ml-4 mt-1 list-disc space-y-1">
                      <li>Bindningstid kommunicerades felaktigt</li>
                      <li>Priset gavs på ett vilseledande sätt</li>
                      <li>Informationen om ångerrätt var felaktig</li>
                    </ul>
                  </div>
                  
                  <div>
                    <strong>Förbättringsrekommendationer:</strong>
                    <ul className="ml-4 mt-1 list-disc space-y-1">
                      <li>Strukturerad genomgång av villkor innan avslut</li>
                      <li>Träning i korrekt informationsgivning genom AI-feedback och rollspel</li>
                      <li>Balansera säljtekniken med compliance-kontrollpunkter</li>
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-muted-foreground/20">
                    <strong>Sammanfattning:</strong> Samtalet var tekniskt starkt, men korrekt informationsgivning måste prioriteras för att säkerställa laglydighet och kundens förtroende.
                  </div>
                </div>
                
                <div className="pt-3 border-t border-blue-200">
                  <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-blue-100/50 border-blue-300 text-blue-800 hover:bg-blue-200">
                        Se utförlig säljteknisk analys
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Djupgående säljteknisk analys</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Samtalsstruktur */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">Samtalsstruktur och flöde</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 border rounded-lg bg-green-50">
                              <h4 className="font-medium text-green-800">Öppning (9/10)</h4>
                              <p className="text-sm text-green-700 mt-1">Excellent rapport-building och engagemang. Säljaren skapade omedelbart förtroende genom att anpassa sig till kundens tonläge.</p>
                            </div>
                            <div className="p-3 border rounded-lg bg-amber-50">
                              <h4 className="font-medium text-amber-800">Behovsanalys (6/10)</h4>
                              <p className="text-sm text-amber-700 mt-1">Bra frågeteknik men missade att djupare utforska kundens verkliga behov och nuvarande situation.</p>
                            </div>
                            <div className="p-3 border rounded-lg bg-red-50">
                              <h4 className="font-medium text-red-800">Presentation (4/10)</h4>
                              <p className="text-sm text-red-700 mt-1">Informationen var ofullständig och vilseledande, särskilt gällande priser och villkor.</p>
                            </div>
                          </div>
                        </div>

                        {/* Kommunikationstekniker */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">Kommunikationstekniker</h3>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Aktiv lyssning och empati
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">Säljaren visade excellent förmåga att lyssna aktivt och spegla kundens känslor. Användning av bekräftande fraser som "Jag förstår" och "Det låter som att..."</p>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Tonläge och tempo
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">Perfekt anpassning till kundens energinivå. Lugn och trygg kommunikation som skapade förtroende.</p>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Hantering av invändningar
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">Bra grundteknik men förbättringspotential. Säljaren bemötte invändningar men missade att vända dem till fördelar.</p>
                            </div>
                          </div>
                        </div>

                        {/* Försäljningspsykologi */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">Försäljningspsykologi</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-green-700">Vad fungerade bra:</h4>
                              <ul className="text-sm space-y-1">
                                <li>• Skapade känslomässig koppling</li>
                                <li>• Använde social proof effektivt</li>
                                <li>• Byggde trovärdighet genom expertis</li>
                                <li>• Skapade tidskänsla utan att pressa</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-amber-700">Missade möjligheter:</h4>
                              <ul className="text-sm space-y-1">
                                <li>• Reciprocitet - kunde gett mer värde först</li>
                                <li>• Commitment & consistency - få kunden att bekräfta behov</li>
                                <li>• Authority - stärka sin expertposition</li>
                                <li>• Scarcity - skapa mer genuint värde</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Specifika förbättringsområden */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">Konkreta förbättringsförslag</h3>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 bg-blue-50">
                              <h4 className="font-medium text-blue-800">1. Compliance-säker presentation</h4>
                              <p className="text-sm text-blue-700 mt-1">Utveckla en standardiserad "compliance-checkpoint" mitt i presentationen där alla villkor systematiskt gås igenom.</p>
                            </div>
                            <div className="border rounded-lg p-4 bg-purple-50">
                              <h4 className="font-medium text-purple-800">2. Fördjupad behovsanalys</h4>
                              <p className="text-sm text-purple-700 mt-1">Använd SPIN-selling tekniken: Situation → Problem → Implication → Need-payoff för att bygga starkare case.</p>
                            </div>
                            <div className="border rounded-lg p-4 bg-green-50">
                              <h4 className="font-medium text-green-800">3. Värdebaserat avslut</h4>
                              <p className="text-sm text-green-700 mt-1">Sammanfatta värdet utifrån kundens specifika behov innan du presenterar priset och villkoren.</p>
                            </div>
                          </div>
                        </div>

                        {/* Coaching-rekommendationer */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">Personliga utvecklingsrekommendationer</h3>
                          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <p className="font-medium">Fokusområde för kommande månad:</p>
                              <p className="text-sm">Säljaren har stark grund i relationsskapande och kommunikation. Fokus bör ligga på att integrera compliance-kontroller utan att förlora det naturliga flödet. Rekommenderad träning: rollspel med compliance-scenarion och videogenomgång av egna samtal.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button>
            Ladda ner fullständig rapport
          </Button>
          <Button variant="outline">
            Skicka till teamledare
          </Button>
          <Link to="/">
            <Button variant="ghost">
              Tillbaka till dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>;
};
export default ExampleReport;