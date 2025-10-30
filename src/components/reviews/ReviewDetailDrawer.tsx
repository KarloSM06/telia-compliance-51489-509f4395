import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, User, Mail, Phone, Calendar, MessageSquare, Sparkles, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number | null;
  comment: string | null;
  sentiment_score?: number | null;
  topics?: string[] | null;
  ai_analysis?: any;
  source?: string;
  submitted_at: string | null;
  created_at: string;
  calendar_event_id?: string | null;
}

interface ReviewDetailDrawerProps {
  review: Review | null;
  open: boolean;
  onClose: () => void;
}

export const ReviewDetailDrawer = ({ review, open, onClose }: ReviewDetailDrawerProps) => {
  if (!review) return null;

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getSentimentBadge = (score: number | null) => {
    if (score === null || score === undefined) {
      return <Badge variant="outline">N/A</Badge>;
    }
    
    if (score > 0.3) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Positiv ({(score * 100).toFixed(0)}%)</Badge>;
    } else if (score < -0.3) {
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Negativ ({(score * 100).toFixed(0)}%)</Badge>;
    }
    return <Badge variant="outline">Neutral ({(score * 100).toFixed(0)}%)</Badge>;
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recensionsdetaljer
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-6">
            {/* Rating & Sentiment */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Betyg</p>
                {renderStars(review.rating)}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">AI Sentiment</p>
                {getSentimentBadge(review.sentiment_score)}
              </div>
            </div>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kundinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{review.customer_name}</span>
                </div>
                {review.customer_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{review.customer_email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(review.submitted_at || review.created_at), 'PPP', { locale: sv })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Comment */}
            {review.comment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Kommentar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
                </CardContent>
              </Card>
            )}

            {/* AI Analysis */}
            {review.ai_analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI-Analys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.ai_analysis.summary && (
                    <div>
                      <p className="text-sm font-medium mb-1">Sammanfattning</p>
                      <p className="text-sm text-muted-foreground">{review.ai_analysis.summary}</p>
                    </div>
                  )}
                  {review.ai_analysis.key_insights && (
                    <div>
                      <p className="text-sm font-medium mb-1">Nyckelinsikter</p>
                      <ul className="list-disc list-inside space-y-1">
                        {review.ai_analysis.key_insights.map((insight: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Topics */}
            {review.topics && review.topics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Ämnen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {review.topics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Källa:</span>
                  <Badge variant="outline">{review.source || 'Manuell'}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Skapad:</span>
                  <span className="font-mono text-xs">
                    {format(new Date(review.created_at), 'PPP HH:mm', { locale: sv })}
                  </span>
                </div>
                {review.calendar_event_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kopplad till händelse:</span>
                    <span className="font-mono text-xs">Ja</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};