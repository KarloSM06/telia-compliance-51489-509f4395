import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SetupGuideProps {
  webhookUrl: string | null;
}

export function SetupGuide({ webhookUrl }: SetupGuideProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Setup Guide
        </CardTitle>
        <CardDescription>
          Steg-för-steg instruktioner för att koppla samman dina telephony providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vapi" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vapi">Vapi</TabsTrigger>
            <TabsTrigger value="retell">Retell</TabsTrigger>
            <TabsTrigger value="twilio">Twilio</TabsTrigger>
            <TabsTrigger value="telnyx">Telnyx</TabsTrigger>
          </TabsList>

          <TabsContent value="vapi" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Din Webhook URL:</strong>
                <code className="block mt-2 p-2 bg-muted rounded text-xs break-all">
                  {webhookUrl || 'Lägg till en provider först för att få din webhook URL'}
                </code>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Steg för att koppla Vapi:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Gå till <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Vapi Dashboard <ExternalLink className="h-3 w-3" /></a></li>
                <li>Navigera till <strong>Settings → Webhooks</strong></li>
                <li>Klistra in din Webhook URL ovan</li>
                <li>Välj vilka events du vill ta emot (rekommenderar: <code>call.started</code>, <code>call.ended</code>)</li>
                <li>Spara inställningarna</li>
                <li>Kopiera din <strong>API Key</strong> från Vapi och lägg till den här i Hiems</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="retell" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Din Webhook URL:</strong>
                <code className="block mt-2 p-2 bg-muted rounded text-xs break-all">
                  {webhookUrl || 'Lägg till en provider först för att få din webhook URL'}
                </code>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Steg för att koppla Retell:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Logga in på <a href="https://retellai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Retell AI <ExternalLink className="h-3 w-3" /></a></li>
                <li>Gå till <strong>Dashboard → Settings → Webhooks</strong></li>
                <li>Klicka på "Add Webhook"</li>
                <li>Klistra in din Webhook URL</li>
                <li>Välj events: <code>call_started</code>, <code>call_ended</code>, <code>call_analyzed</code></li>
                <li>Hämta din <strong>API Key</strong> och lägg till den här</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="twilio" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Din Webhook URL:</strong>
                <code className="block mt-2 p-2 bg-muted rounded text-xs break-all">
                  {webhookUrl || 'Lägg till en provider först för att få din webhook URL'}
                </code>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Steg för att koppla Twilio:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Öppna <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Twilio Console <ExternalLink className="h-3 w-3" /></a></li>
                <li>Gå till <strong>Phone Numbers → Manage → Active numbers</strong></li>
                <li>Välj det nummer du vill använda</li>
                <li>Under <strong>Messaging Configuration</strong>, leta upp "A MESSAGE COMES IN"</li>
                <li>Välj "Webhook" och klistra in din Webhook URL</li>
                <li>Välj HTTP POST som metod</li>
                <li>Hämta <strong>Account SID</strong> och <strong>Auth Token</strong> från Console Home</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="telnyx" className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Din Webhook URL:</strong>
                <code className="block mt-2 p-2 bg-muted rounded text-xs break-all">
                  {webhookUrl || 'Lägg till en provider först för att få din webhook URL'}
                </code>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Steg för att koppla Telnyx:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Logga in på <a href="https://portal.telnyx.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Telnyx Portal <ExternalLink className="h-3 w-3" /></a></li>
                <li>Gå till <strong>Messaging → Messaging Profiles</strong></li>
                <li>Välj eller skapa en Messaging Profile</li>
                <li>Under <strong>Inbound Settings</strong>, sätt Webhook URL till din URL ovan</li>
                <li>Aktivera "Send webhooks for message events"</li>
                <li>Spara inställningarna</li>
                <li>Kopiera din <strong>API Key</strong> från <strong>Auth → API Keys</strong></li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
