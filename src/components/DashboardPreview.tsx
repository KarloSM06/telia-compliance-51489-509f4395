import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

export const DashboardPreview = () => {
  const agents = [
    { name: "Anna Eriksson", calls: 12, status: "success", score: 98 },
    { name: "Magnus Lindahl", calls: 8, status: "warning", score: 85 },
    { name: "Sofia Johansson", calls: 15, status: "success", score: 96 },
    { name: "Erik Pettersson", calls: 6, status: "violation", score: 72 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "violation":
        return <XCircle className="h-4 w-4 text-violation" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success/10 text-success border-success/20">Godkänd</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Anmärkning</Badge>;
      case "violation":
        return <Badge className="bg-violation/10 text-violation border-violation/20">Varning</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dashboard-översikt
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Få fullständig kontroll över era säljsamtal med vår AI-drivna dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Godkända samtal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <div>
                  <div className="text-2xl font-bold text-success">94%</div>
                  <Progress value={94} className="w-24 h-2 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Med anmärkning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold text-warning">5%</div>
                  <Progress value={5} className="w-24 h-2 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Med varning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-violation" />
                <div>
                  <div className="text-2xl font-bold text-violation">1%</div>
                  <Progress value={1} className="w-24 h-2 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Agentöversikt - Senaste veckan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border hover:shadow-card transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(agent.status)}
                    <div>
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.calls} samtal</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{agent.score}%</p>
                      <p className="text-xs text-muted-foreground">Kvalitetspoäng</p>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};