import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayCircle, CheckCircle, XCircle, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Demo data showing different violation scenarios
const demoScenarios = [
  {
    id: 1,
    title: "Scenario 1: Gratis-erbjudande",
    description: "Säljare erbjuder något gratis vilket strider mot policy",
    audioTranscript: "Hej! Vi har ett fantastiskt erbjudande idag. Du kan få vår premiumtjänst helt gratis i tre månader. Det är verkligen ett bra tillfälle att testa utan kostnad.",
    violations: [
      {
        timestamp: "00:23",
        rule: "Förbjudna ord och uttryck",
        description: "Användning av ordet 'gratis' är förbjudet enligt företagspolicy",
        severity: "high" as const
      },
      {
        timestamp: "00:31", 
        rule: "Förbjudna ord och uttryck",
        description: "Uttrycket 'utan kostnad' kan tolkas som gratiserbjudande",
        severity: "medium" as const
      }
    ],
    complianceStatus: "violations_found" as const,
    saleOutcome: true,
    duration: "2:15"
  },
  {
    id: 2,
    title: "Scenario 2: Påtryckningsförsäljning",
    description: "Säljare använder för aggressiva försäljningstekniker",
    audioTranscript: "Du måste bestämma dig nu! Detta erbjudande gäller bara idag och kommer aldrig att komma tillbaka. Alla andra köper det här och du kommer att ångra dig om du missar det.",
    violations: [
      {
        timestamp: "00:05",
        rule: "Påtryckningsförsäljning",
        description: "Användning av uttryck som skapar onödig tidpress ('måste bestämma dig nu')",
        severity: "high" as const
      },
      {
        timestamp: "00:18",
        rule: "Påtryckningsförsäljning", 
        description: "Felaktiga påståenden om att 'alla andra köper'",
        severity: "medium" as const
      }
    ],
    complianceStatus: "violations_found" as const,
    saleOutcome: false,
    duration: "1:45"
  },
  {
    id: 3,
    title: "Scenario 3: Korrekt försäljning",
    description: "Exempel på ett regelefterlevt säljsamtal",
    audioTranscript: "Hej! Jag skulle vilja berätta om vår tjänst och hur den kan hjälpa er. Ni är välkomna att ställa frågor och fundera på det. Vår prissättning är transparent och vi har ingen brådska - ta den tid ni behöver.",
    violations: [],
    complianceStatus: "compliant" as const,
    saleOutcome: true,
    duration: "3:20"
  }
];

const Demo = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (scenarioId: number) => {
    setIsAnalyzing(true);
    setSelectedScenario(null);
    
    // Simulate analysis delay
    setTimeout(() => {
      setSelectedScenario(scenarioId);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Tillbaka
            </Link>
            <h1 className="text-xl font-bold">Demo - AI Samtalsanalys</h1>
          </div>
          <Badge variant="secondary">Demo-miljö</Badge>
        </div>
      </header>

      <div className="container mx-auto py-8 space-y-8">
        {/* Intro */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Testa AI Samtalsanalys</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upptäck hur vår AI automatiskt identifierar regelbrott i säljsamtal. 
            Välj ett scenario nedan för att se hur systemet fungerar.
          </p>
        </div>

        {/* Demo Scenarios */}
        <div className="grid md:grid-cols-3 gap-6">
          {demoScenarios.map((scenario) => (
            <Card key={scenario.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{scenario.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <strong>Transkript (utdrag):</strong>
                  <p className="mt-1 text-muted-foreground italic">
                    "{scenario.audioTranscript.substring(0, 100)}..."
                  </p>
                </div>
                
                <Button 
                  onClick={() => handleAnalyze(scenario.id)}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {isAnalyzing && selectedScenario === scenario.id ? "Analyserar..." : "Starta analys"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <Alert>
            <Clock className="h-4 w-4 animate-spin" />
            <AlertDescription>
              AI:n analyserar samtalet mot försäljningsriktlinjer... Detta tar vanligtvis 15-30 sekunder.
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {selectedScenario && !isAnalyzing && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Analysresultat</h3>
            
            {(() => {
              const scenario = demoScenarios.find(s => s.id === selectedScenario)!;
              
              return (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {scenario.complianceStatus === 'compliant' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        Överblick
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <Badge variant={scenario.complianceStatus === 'compliant' ? 'default' : 'destructive'}>
                            {scenario.complianceStatus === 'compliant' ? 'Regelefterlevd' : 'Överträdelser funna'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Försäljning</p>
                          <Badge variant={scenario.saleOutcome ? 'default' : 'secondary'}>
                            {scenario.saleOutcome ? 'Ja' : 'Nej'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Samtalsid</p>
                          <p className="text-sm text-muted-foreground">{scenario.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Överträdelser</p>
                          <p className="text-sm text-muted-foreground">{scenario.violations.length} st</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Violations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Identifierade överträdelser</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scenario.violations.length === 0 ? (
                        <div className="text-center py-6">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Inga regelöverträdelser upptäcktes i detta samtal.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {scenario.violations.map((violation, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                {getSeverityIcon(violation.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={getSeverityColor(violation.severity)}>
                                      {violation.severity === 'high' ? 'Hög' : violation.severity === 'medium' ? 'Medel' : 'Låg'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{violation.timestamp}</span>
                                  </div>
                                  <p className="font-medium text-sm">{violation.rule}</p>
                                  <p className="text-sm text-muted-foreground">{violation.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()}

            {/* CTA */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h4 className="text-lg font-semibold">Imponerad av resultaten?</h4>
                  <p className="text-muted-foreground">
                    Detta är bara ett smakprov. Vår AI kan analysera alla era säljsamtal automatiskt 
                    och ge detaljerade insikter för att förbättra regelefterlevnad och försäljningsresultat.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg">
                      Boka demo med ert material
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/">Läs mer</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Demo;