import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download, MessageCircle, TrendingUp, Sparkles } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { DateRangePicker } from "@/components/dashboard/filters/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReviewInsightsSection } from "@/components/reviews/ReviewInsightsSection";
import { Separator } from "@/components/ui/separator";

const ReviewDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { reviews, stats, isLoading, exportToCSV } = useReviews(dateRange);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const chartData = Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} stjärnor`,
    count,
  }));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Star className="h-8 w-8 text-primary fill-primary" />
          <div>
            <h1 className="text-3xl font-bold">Recensioner</h1>
            <p className="text-muted-foreground">
              Analysera kundrecensioner och feedback
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={(range) => range && setDateRange(range)}
          />
          <Button
            variant="outline"
            onClick={() => exportToCSV('recensioner.csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportera
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totalt antal recensioner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Insamlade recensioner
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Genomsnittligt betyg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Av 5.0 möjliga
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nöjda kunder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-green-600">
                {((((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews) * 100).toFixed(0)}%
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              4-5 stjärnor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <ReviewInsightsSection dateRange={dateRange} />

      <Separator className="my-8" />

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Betygsfördelning</CardTitle>
          <CardDescription>
            Antal recensioner per betyg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste recensioner</CardTitle>
          <CardDescription>
            {reviews.length} recensioner totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Inga recensioner ännu för vald period
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold">{review.customer_name}</p>
                        {review.rating && renderStars(review.rating)}
                      </div>
                      {review.comment && (
                        <div className="flex items-start gap-2 mt-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      )}
                      {review.customer_email && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {review.customer_email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {review.submitted_at
                          ? format(parseISO(review.submitted_at), "d MMM yyyy", { locale: sv })
                          : format(parseISO(review.created_at), "d MMM yyyy", { locale: sv })}
                      </Badge>
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
};

export default ReviewDashboard;
