import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, TrendingUp, AlertCircle, RefreshCw, Download, Settings, ThumbsUp } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
import { toast } from "sonner";

export function EkoSection() {
  // Mock data för demonstration
  const stats = {
    totalReviews: 247,
    averageRating: 4.6,
    positivePercentage: 87,
    needsResponse: 12,
    newThisWeek: 15
  };

  const recentReviews = [
    {
      id: 1,
      platform: "Google",
      rating: 5,
      author: "Anna Andersson",
      text: "Fantastisk service! Rekommenderas varmt.",
      sentiment: "positive",
      responded: true,
      date: "2025-10-15"
    },
    {
      id: 2,
      platform: "Facebook",
      rating: 4,
      author: "Johan Berg",
      text: "Bra produkt, snabb leverans.",
      sentiment: "positive",
      responded: true,
      date: "2025-10-14"
    },
    {
      id: 3,
      platform: "TripAdvisor",
      rating: 2,
      author: "Maria Svensson",
      text: "Kunde varit bättre, förväntade mig mer.",
      sentiment: "negative",
      responded: false,
      date: "2025-10-13"
    }
  ];

  const handleRefresh = () => {
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Omdömeshantering AI (Eko)
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera och analysera omdömen med AI
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline">{stats.totalReviews} omdömen</Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Settings className="h-4 w-4 mr-2" />
                  Inställningar
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard 
                title="Totalt Omdömen" 
                value={stats.totalReviews}
                icon={MessageSquare}
                color="text-blue-600"
                subtitle={`+${stats.newThisWeek} denna vecka`}
              />
              <PremiumTelephonyStatCard 
                title="Genomsnitt" 
                value={stats.averageRating}
                icon={Star}
                color="text-yellow-600"
                subtitle="av 5 stjärnor"
              />
              <PremiumTelephonyStatCard 
                title="Positiva" 
                value={`${stats.positivePercentage}%`}
                icon={TrendingUp}
                color="text-green-600"
                subtitle="4-5 stjärnor"
              />
              <PremiumTelephonyStatCard 
                title="Kräver Svar" 
                value={stats.needsResponse}
                icon={AlertCircle}
                color="text-orange-600"
                subtitle="obesvarade"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
              <CardHeader>
                <CardTitle>Senaste Omdömen</CardTitle>
                <CardDescription>
                  De senaste recensionerna från alla plattformar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{review.platform}</Badge>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                        <p className="text-sm">{review.text}</p>
                        <div className="flex items-center gap-2">
                          {review.responded ? (
                            <Badge variant="secondary" className="text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Besvarad
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Obesvarad
                            </Badge>
                          )}
                          <Badge
                            variant={review.sentiment === "positive" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {review.sentiment === "positive" ? "Positiv" : "Negativ"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
