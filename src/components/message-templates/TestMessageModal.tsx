import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

interface TestMessageModalProps {
  open: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
}

export const TestMessageModal = ({ open, onClose, templateId, templateName }: TestMessageModalProps) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<'sms' | 'email'>('email');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [sent, setSent] = useState(false);

  const handleGeneratePreview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-message', {
        body: {
          eventId: 'test',
          messageType: 'test',
          templateId,
          testData: {
            customer_name: 'Test Kund',
            date: new Date().toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            time: '10:00',
            service: 'Testbokat tjänst',
            address: 'Testgatan 123, Stockholm',
            contact_person: 'Din kontaktperson',
          },
        },
      });

      if (error) throw error;
      setPreview(data.message || data.subject + '\n\n' + data.message);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Kunde inte generera förhandsvisning');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-test-message', {
        body: {
          templateId,
          channel,
        },
      });

      if (error) throw error;

      setSent(true);
      toast.success(
        channel === 'email'
          ? 'Test-e-post skickat till din e-postadress'
          : 'Test-SMS skickat till ditt telefonnummer'
      );

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSent(false);
        setPreview('');
      }, 2000);
    } catch (error) {
      console.error('Error sending test:', error);
      toast.error('Kunde inte skicka testmeddelande');
    } finally {
      setLoading(false);
    }
  };

  // Generate preview when modal opens
  useState(() => {
    if (open && !preview) {
      handleGeneratePreview();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Testa mall: {templateName}</DialogTitle>
          <DialogDescription>
            Skicka ett testmeddelande till dig själv för att se hur det ser ut
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Testmeddelande skickat!</h3>
            <p className="text-muted-foreground">
              Kontrollera din {channel === 'email' ? 'e-post' : 'telefon'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Channel Selection */}
            <div className="space-y-3">
              <Label>Välj kanal</Label>
              <RadioGroup value={channel} onValueChange={(value) => setChannel(value as 'sms' | 'email')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4" />
                    E-post
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    SMS
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Preview */}
            {preview && (
              <Card className="p-4 bg-muted">
                <Label className="text-sm font-semibold mb-2 block">Förhandsvisning:</Label>
                <p className="text-sm whitespace-pre-wrap">{preview}</p>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSendTest}
                disabled={loading || !preview}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Skicka test
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Testmeddelandet kommer att skickas till {channel === 'email' ? user?.email : 'ditt sparade telefonnummer'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
