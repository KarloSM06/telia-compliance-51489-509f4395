import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, Phone, Mail, Star } from 'lucide-react';

interface Review {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  rating: number;
  comment: string;
  sentiment?: number;
  topics?: string[];
  source: 'calendar' | 'sms' | 'email' | 'telephony' | 'manual';
  submitted_at: string;
}

interface ReviewCardListProps {
  reviews: Review[];
  onViewDetails: (review: Review) => void;
}

export function ReviewCardList({ reviews, onViewDetails }: ReviewCardListProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-primary' : 'text-muted-foreground/30'}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getSourceBadge = (source: string) => {
    const badges = {
      calendar: { icon: Calendar, label: 'Kalender', variant: 'default' as const },
      sms: { icon: MessageSquare, label: 'SMS', variant: 'secondary' as const },
      email: { icon: Mail, label: 'Email', variant: 'secondary' as const },
      telephony: { icon: Phone, label: 'Samtal', variant: 'default' as const },
      manual: { icon: Star, label: 'Manuell', variant: 'outline' as const },
    };

    const badge = badges[source as keyof typeof badges] || badges.manual;
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {badge.label}
      </Badge>
    );
  };

  const getSentimentBadge = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return null;

    const percentage = Math.round((sentiment + 1) * 50);
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let label = 'Neutral';

    if (sentiment >= 0.3) {
      variant = 'default';
      label = 'Positiv';
    } else if (sentiment <= -0.3) {
      variant = 'destructive';
      label = 'Negativ';
    }

    return (
      <Badge variant={variant} className="text-xs">
        {label} ({percentage}%)
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Inga recensioner att visa</h3>
        <p className="text-sm text-muted-foreground">
          Prova att ändra filtren eller vänta på nya recensioner
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <Card
          key={review.id}
          onClick={() => onViewDetails(review)}
          className="cursor-pointer hover:bg-accent/5 transition-colors"
        >
          <CardContent className="p-4">
            {/* Header: Source, Rating, Customer, Date */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {getSourceBadge(review.source)}
                {renderStars(review.rating)}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {formatDate(review.submitted_at)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{review.customer_name}</span>
              {review.customer_email && (
                <span className="text-xs text-muted-foreground">• {review.customer_email}</span>
              )}
              {review.customer_phone && (
                <span className="text-xs text-muted-foreground">• {review.customer_phone}</span>
              )}
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {review.comment}
              </p>
            )}

            {/* Footer: Sentiment + Topics */}
            <div className="flex items-center gap-2 flex-wrap">
              {getSentimentBadge(review.sentiment)}
              {review.topics && review.topics.length > 0 && (
                <>
                  {review.topics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {review.topics.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{review.topics.length - 3} till
                    </span>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
