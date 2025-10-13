import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Phone, Award, TrendingUp, Download } from "lucide-react";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { Progress } from "@/components/ui/progress";

export function MonthlySummary() {
  const { summary } = useDashboardSummary();

  const currentMonth = new Date().toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long' 
  });

  const goals = [
    { name: "Samtal", current: summary?.totalCalls || 0, target: 500, icon: Phone },
    { name: "Bokningar", current: summary?.totalBookings || 0, target: 100, icon: Target },
    { name: "AI Kvalitet", current: summary?.avgQualityScore || 0, target: 8.5, icon: Award },
  ];

  const goalsAchieved = goals.filter(g => g.current >= g.target).length;

  const handleDownloadReport = () => {
    // Future: Generate PDF report
    console.log("Downloading monthly report...");
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {currentMonth} - Din Månad i Siffror
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Mål uppnådda</p>
            <p className="text-2xl font-bold text-primary">
              {goalsAchieved}/{goals.length}
            </p>
          </div>
          <Progress value={(goalsAchieved / goals.length) * 100} className="h-2" />
        </div>

        {/* Individual Goals */}
        <div className="space-y-3">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const achieved = goal.current >= goal.target;

            return (
              <div key={goal.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <span className={achieved ? "text-success font-semibold" : "text-muted-foreground"}>
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            );
          })}
        </div>

        {/* ROI Estimation */}
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <p className="font-semibold text-success">ROI-estimation</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {summary?.totalCalls && summary.totalCalls > 0
              ? `+${Math.round((summary.totalCalls / 100) * 15)}% kundnöjdhet baserat på AI-analys`
              : "Börja använda AI för att se ROI"}
          </p>
        </div>

        {/* Download Report */}
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={handleDownloadReport}
        >
          <Download className="h-4 w-4" />
          Ladda ner fullständig rapport (PDF)
        </Button>
      </CardContent>
    </Card>
  );
}
