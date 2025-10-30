import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { useReviewInsights } from '@/hooks/useReviewInsights';
import { ReviewStatsCards } from '@/components/reviews/ReviewStatsCards';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import { ReviewDetailDrawer } from '@/components/reviews/ReviewDetailDrawer';
import { ReviewInsightsSection } from '@/components/reviews/ReviewInsightsSection';

export default function ReviewDashboard() {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });

  const { reviews, allReviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);
  const { insights, triggerAnalysis, isAnalyzing } = useReviewInsights();

  const handleRefresh = () => {
    toast.success('Data uppdaterad');
    window.location.reload();
  };

  const handleExport = () => {
    exportToCSV(`reviews-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Export klar');
  };

  const handleAnalyze = async () => {
    await triggerAnalysis();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recensioner</h1>
          <p className="text-muted-foreground">
            AI-driven analys av kundrecensioner och feedback
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            <Sparkles className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Analysera Nu
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ReviewStatsCards stats={stats} insights={insights} />

      {/* Filters */}
      <ReviewFilters onFilterChange={setFilters} />

      {/* AI Insights Section */}
      <ReviewInsightsSection />

      {/* Reviews Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recensioner</h2>
          <p className="text-sm text-muted-foreground">
            Visar {reviews.length} av {allReviews.length} recensioner
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ReviewsTable reviews={reviews} onViewDetails={setSelectedReview} />
        )}
      </div>

      {/* Review Detail Drawer */}
      <ReviewDetailDrawer
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}