import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, User, Phone, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ExampleReport = () => {
  const reportData = {
    date: "2024-01-15",
    agent: "Anna Andersson",
    callDuration: "12:34",
    totalCalls: 23,
    passedCalls: 19,
    warningCalls: 3,
    failedCalls: 1
  };

  const violations = [
    {
      id: 1,
      severity: "warning",
      rule: "Vilseledande prisuppgifter",
      description: "Prisuppgift utan moms nämndes",
      quote: "\"Det kostar bara 299 kronor per månad\"",
      timestamp: "03:42",
      recommendation: "Ange alltid priser inklusive moms enligt lag"
    },
    {
      id: 2,
      severity: "error",
      rule: "Bindningstid",
      description: "Felaktig information om bindningstid",
      quote: "\"Du kan säga upp när som helst utan kostnad\"",
      timestamp: "07:18",
      recommendation: "Informera korrekt om 24 månaders bindningstid"
    },
    {
      id: 3,
      severity: "warning",
      rule: "Ångerrätt",
      description: "Ångerrätt ej tydligt kommunicerad",
      quote: "\"Vi skickar kontrakt via e-post\"",
      timestamp: "09:55",
      recommendation: "Påminn alltid om 14 dagars ångerrätt"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "destructive";
      case "warning": return "secondary";
      default: return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return <XCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Totalt antal samtal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{reportData.totalCalls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Godkända samtal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{reportData.passedCalls}</div>
              <Progress value={(reportData.passedCalls / reportData.totalCalls) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Med anmärkning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{reportData.warningCalls}</div>
              <Progress value={(reportData.warningCalls / reportData.totalCalls) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Allvarliga brister
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{reportData.failedCalls}</div>
              <Progress value={(reportData.failedCalls / reportData.totalCalls) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

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
            {violations.map((violation) => (
              <div
                key={violation.id}
                className="border rounded-lg p-4 space-y-3"
              >
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
              </div>
            ))}
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
    </div>
  );
};

export default ExampleReport;