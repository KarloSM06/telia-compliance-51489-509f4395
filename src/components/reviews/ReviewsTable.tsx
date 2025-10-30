import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number | null;
  comment: string | null;
  sentiment_score?: number | null;
  topics?: string[] | null;
  source?: string;
  submitted_at: string | null;
  created_at: string;
}

interface ReviewsTableProps {
  reviews: Review[];
  onViewDetails: (review: Review) => void;
}

type SortKey = 'created_at' | 'rating' | 'sentiment_score';
type SortDirection = 'asc' | 'desc';

export const ReviewsTable = ({ reviews, onViewDetails }: ReviewsTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'created_at',
    direction: 'desc',
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aVal, bVal;

    switch (key) {
      case 'created_at':
        aVal = new Date(a.submitted_at || a.created_at).getTime();
        bVal = new Date(b.submitted_at || b.created_at).getTime();
        break;
      case 'rating':
        aVal = a.rating || 0;
        bVal = b.rating || 0;
        break;
      case 'sentiment_score':
        aVal = a.sentiment_score || 0;
        bVal = b.sentiment_score || 0;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getSentimentBadge = (score: number | null) => {
    if (score === null || score === undefined) {
      return <Badge variant="outline">N/A</Badge>;
    }
    
    if (score > 0.3) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Positiv</Badge>;
    } else if (score < -0.3) {
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Negativ</Badge>;
    }
    return <Badge variant="outline">Neutral</Badge>;
  };

  const getSourceBadge = (source: string | undefined) => {
    if (!source || source === 'internal') return <Badge variant="secondary">Manuell</Badge>;
    return <Badge variant="outline">{source}</Badge>;
  };

  if (sortedReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border bg-card">
        <p className="text-muted-foreground">Inga recensioner att visa</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Kund</TableHead>
            <TableHead 
              className="w-[150px] cursor-pointer"
              onClick={() => handleSort('rating')}
            >
              <div className="flex items-center gap-1">
                Betyg
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[120px] cursor-pointer"
              onClick={() => handleSort('sentiment_score')}
            >
              <div className="flex items-center gap-1">
                Sentiment
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[300px]">Kommentar</TableHead>
            <TableHead className="w-[100px]">Källa</TableHead>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center gap-1">
                Datum
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedReviews.map((review) => (
            <TableRow key={review.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{review.customer_name}</span>
                  {review.customer_email && (
                    <span className="text-xs text-muted-foreground truncate">
                      {review.customer_email}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{renderStars(review.rating)}</TableCell>
              <TableCell>{getSentimentBadge(review.sentiment_score)}</TableCell>
              <TableCell>
                <span className="text-sm line-clamp-2">
                  {review.comment || '-'}
                </span>
              </TableCell>
              <TableCell>{getSourceBadge(review.source)}</TableCell>
              <TableCell>
                <div className="flex flex-col text-xs">
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(review.submitted_at || review.created_at), {
                      addSuffix: true,
                      locale: sv,
                    })}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(review.submitted_at || review.created_at).toLocaleDateString('sv-SE')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(review)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};