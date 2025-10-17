import { LeadSearch } from "@/hooks/useLeadSearches";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Trash2 } from "lucide-react";

interface LeadSearchListProps {
  searches: LeadSearch[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  active: "bg-green-500/10 text-green-700 dark:text-green-300",
  paused: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  completed: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
};

const statusLabels = {
  active: "Aktiv",
  paused: "Pausad",
  completed: "Klar",
};

export function LeadSearchList({ searches, onPause, onResume, onDelete }: LeadSearchListProps) {
  if (searches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Inga aktiva sökningar</p>
        <p className="text-sm mt-2">Skapa en ny sökning för att komma igång</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {searches.map((search) => {
        const progress = (search.leads_generated / search.leads_target) * 100;

        return (
          <Card key={search.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{search.search_name}</CardTitle>
                <Badge className={statusColors[search.status]}>
                  {statusLabels[search.status]}
                </Badge>
              </div>
              <CardDescription>
                {search.industry?.join(", ") || "Alla branscher"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Framsteg</span>
                  <span className="font-medium">
                    {search.leads_generated} / {search.leads_target}
                  </span>
                </div>
                <Progress value={progress} />
              </div>

              {search.location && search.location.length > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Platser: </span>
                  <span>{search.location.join(", ")}</span>
                </div>
              )}

              {search.keywords && search.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {search.keywords.slice(0, 3).map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {search.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{search.keywords.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {search.status === 'active' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPause(search.id)}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pausa
                  </Button>
                ) : search.status === 'paused' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResume(search.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Återuppta
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(search.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}