import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface WebhookTesterProps {
  webhookUrl: string | null;
}

export function WebhookTester({ webhookUrl }: WebhookTesterProps) {
  const [provider, setProvider] = useState<string>('vapi');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Webhook URL saknas');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const mockData = getMockDataForProvider(provider);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Webhook test lyckades!' });
        toast.success('Webhook fungerar korrekt');
      } else {
        setResult({ success: false, message: data.error || 'Webhook test misslyckades' });
        toast.error('Webhook test misslyckades');
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message });
      toast.error('Kunde inte testa webhook');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Testa Webhook
        </CardTitle>
        <CardDescription>
          Skicka ett test-event till din webhook för att verifiera att den fungerar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Välj provider att testa</label>
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vapi">Vapi</SelectItem>
              <SelectItem value="retell">Retell</SelectItem>
              <SelectItem value="twilio">Twilio</SelectItem>
              <SelectItem value="telnyx">Telnyx</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={testWebhook} 
          disabled={testing || !webhookUrl}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testar...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Kör Test
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function getMockDataForProvider(provider: string) {
  switch (provider) {
    case 'vapi':
      return {
        message: {
          type: 'status-update',
          call: {
            id: 'test-call-id',
            status: 'ended',
          }
        }
      };
    case 'retell':
      return {
        event: 'call_ended',
        call_id: 'test-call-id',
        call_type: 'outbound'
      };
    case 'twilio':
      return {
        MessageSid: 'SM' + Math.random().toString(36).substr(2, 9),
        MessageStatus: 'delivered',
        From: '+46701234567',
        To: '+46709876543'
      };
    case 'telnyx':
      return {
        data: {
          event_type: 'message.finalized',
          payload: {
            id: 'test-msg-' + Date.now(),
            to: [{ status: 'delivered' }]
          }
        }
      };
    default:
      return {};
  }
}
