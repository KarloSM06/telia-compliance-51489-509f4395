import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

interface ConversationViewerProps {
  event: any;
}

export const ConversationViewer = ({ event }: ConversationViewerProps) => {
  const conversation = event.normalized?.conversation || [];
  
  if (!conversation || conversation.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Konversation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {conversation.map((msg: any, i: number) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <Badge
                  variant={msg.role === 'assistant' ? 'default' : 'secondary'}
                  className="h-fit"
                >
                  {msg.role === 'assistant' ? 'AI' : msg.role === 'user' ? 'Användare' : msg.role}
                </Badge>
                <div
                  className={`flex-1 rounded-lg p-3 ${
                    msg.role === 'assistant'
                      ? 'bg-primary/10 text-primary-foreground'
                      : msg.role === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
