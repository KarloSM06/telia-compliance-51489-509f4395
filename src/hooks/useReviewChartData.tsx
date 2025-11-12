import { useMemo } from 'react';

interface Review {
  id: string;
  submitted_at: string;
  rating: number | null;
  sentiment_score?: number;
  topics?: any;
  customer_name?: string;
  comment?: string;
}

interface DailyData {
  date: string;
  [key: string]: any;
}

export const useReviewChartData = (reviews: Review[]) => {
  return useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        dailyActivity: [],
        ratingDistribution: [],
        sentimentTrend: [],
        topicsDistribution: [],
        ratingVsSentiment: [],
        responseTimeTrend: [],
      };
    }

    // Group by date
    const groupedByDate = reviews.reduce((acc, review) => {
      const date = new Date(review.submitted_at).toLocaleDateString('sv-SE');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(review);
      return acc;
    }, {} as Record<string, Review[]>);

    // Daily Activity
    const dailyActivity = Object.entries(groupedByDate)
      .map(([date, dayReviews]) => ({
        date,
        totalReviews: dayReviews.length,
        avgRating: dayReviews.filter(r => r.rating).length > 0
          ? dayReviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / dayReviews.filter(r => r.rating).length
          : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Rating Distribution over time
    const ratingDistribution = Object.entries(groupedByDate)
      .map(([date, dayReviews]) => ({
        date,
        rating_1: dayReviews.filter(r => r.rating === 1).length,
        rating_2: dayReviews.filter(r => r.rating === 2).length,
        rating_3: dayReviews.filter(r => r.rating === 3).length,
        rating_4: dayReviews.filter(r => r.rating === 4).length,
        rating_5: dayReviews.filter(r => r.rating === 5).length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sentiment Trend
    const sentimentTrend = Object.entries(groupedByDate)
      .map(([date, dayReviews], index, array) => {
        const reviewsWithSentiment = dayReviews.filter(r => r.sentiment_score !== undefined);
        const avgSentiment = reviewsWithSentiment.length > 0
          ? reviewsWithSentiment.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / reviewsWithSentiment.length
          : 0;
        
        // Calculate 7-day moving average
        const startIdx = Math.max(0, index - 6);
        const last7Days = array.slice(startIdx, index + 1);
        const allReviewsLast7Days = last7Days.flatMap(([_, reviews]) => reviews);
        const reviewsWithSentimentLast7 = allReviewsLast7Days.filter(r => r.sentiment_score !== undefined);
        const movingAvg = reviewsWithSentimentLast7.length > 0
          ? reviewsWithSentimentLast7.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / reviewsWithSentimentLast7.length
          : 0;

        return {
          date,
          sentiment: avgSentiment * 100, // Convert to percentage
          movingAvg: movingAvg * 100,
          count: reviewsWithSentiment.length,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Topics Distribution
    const allTopics: Record<string, number> = {};
    reviews.forEach(review => {
      if (review.topics && Array.isArray(review.topics)) {
        review.topics.forEach(topic => {
          const topicStr = typeof topic === 'string' ? topic : topic.topic || 'other';
          allTopics[topicStr] = (allTopics[topicStr] || 0) + 1;
        });
      }
    });

    const topicsDistribution = Object.entries(allTopics)
      .map(([topic, count]) => ({
        topic,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 topics

    // Rating vs Sentiment Scatter Data
    const ratingVsSentiment = reviews
      .filter(r => r.rating && r.sentiment_score !== undefined)
      .map(r => ({
        rating: r.rating,
        sentiment: r.sentiment_score || 0,
        customerName: r.customer_name || 'Anonymous',
      }));

    // Response Time Trend (mock - would need actual response data)
    const responseTimeTrend = Object.entries(groupedByDate)
      .map(([date]) => ({
        date,
        avgResponseTime: 0, // Would need actual response timestamps
        responded: 0,
        total: 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      dailyActivity,
      ratingDistribution,
      sentimentTrend,
      topicsDistribution,
      ratingVsSentiment,
      responseTimeTrend,
    };
  }, [reviews]);
};
