import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, MessageSquare, AlertCircle, ThumbsUp } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totalt Omdömen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newThisWeek} denna vecka
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Genomsnitt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">av 5 möjliga</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Positiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.positivePercentage}%</div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">4-5 stjärnor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kräver Svar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.needsResponse}</div>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">obesvarade</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
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
    </div>
  );
}
