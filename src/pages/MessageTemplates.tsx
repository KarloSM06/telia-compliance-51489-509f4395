import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMessageTemplates, type TemplateType, type Tone, type Channel, type CreateMessageTemplate } from "@/hooks/useMessageTemplates";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function MessageTemplates() {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useMessageTemplates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const [formData, setFormData] = useState<CreateMessageTemplate>({
    name: '',
    template_type: 'booking_confirmation',
    subject: '',
    body_template: '',
    tone: 'friendly',
    language: 'sv',
    channel: ['email'],
    is_active: true,
    variables: ['customer_name', 'date', 'time', 'service', 'address'],
  });

  const handleOpenModal = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        template_type: template.template_type,
        subject: template.subject || '',
        body_template: template.body_template,
        tone: template.tone,
        language: template.language,
        channel: template.channel,
        is_active: template.is_active,
        variables: template.variables,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        template_type: 'booking_confirmation',
        subject: '',
        body_template: '',
        tone: 'friendly',
        language: 'sv',
        channel: ['email'],
        is_active: true,
        variables: ['customer_name', 'date', 'time', 'service', 'address'],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingTemplate) {
      updateTemplate({ id: editingTemplate.id, updates: formData });
    } else {
      createTemplate(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Är du säker på att du vill radera denna mall?')) {
      deleteTemplate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">Laddar mallar...</div>
      </DashboardLayout>
    );
  }

  const getTemplateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      booking_confirmation: 'Bokningsbekräftelse',
      reminder: 'Påminnelse',
      review_request: 'Recensionsförfrågan',
      cancellation: 'Avbokning',
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meddelandemallar</h1>
            <p className="text-muted-foreground">
              Skapa och hantera mallar för automatiska meddelanden
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Ny mall
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {getTemplateTypeLabel(template.template_type)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Ton:</span> {template.tone}
                  </div>
                  <div>
                    <span className="font-medium">Kanaler:</span>{' '}
                    {template.channel.join(', ')}
                  </div>
                  <div className="mt-3 p-3 bg-muted rounded text-xs">
                    {template.body_template.substring(0, 100)}...
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Inga mallar ännu</p>
              <p className="text-muted-foreground mb-4">Skapa din första meddelandemall</p>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Skapa mall
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Redigera mall' : 'Skapa ny mall'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Mallnamn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="T.ex. Standard bokningsbekräftelse"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Malltyp</Label>
                <Select
                  value={formData.template_type}
                  onValueChange={(value) => setFormData({ ...formData, template_type: value as TemplateType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking_confirmation">Bokningsbekräftelse</SelectItem>
                    <SelectItem value="reminder">Påminnelse</SelectItem>
                    <SelectItem value="review_request">Recensionsförfrågan</SelectItem>
                    <SelectItem value="cancellation">Avbokning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Ämne (för e-post)</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="{{customer_name}} - Din bokning är bekräftad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Meddelandetext</Label>
                <Textarea
                  id="body"
                  value={formData.body_template}
                  onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
                  placeholder="Hej {{customer_name}}! Din bokning är bekräftad för {{date}} kl {{time}}."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Använd variabler: {'{{customer_name}}'}, {'{{date}}'}, {'{{time}}'}, {'{{service}}'}, {'{{address}}'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Ton</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData({ ...formData, tone: value as Tone })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formell</SelectItem>
                      <SelectItem value="friendly">Vänlig</SelectItem>
                      <SelectItem value="fun">Lekfull</SelectItem>
                      <SelectItem value="sales">Säljande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Språk</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sv">Svenska</SelectItem>
                      <SelectItem value="en">Engelska</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kanaler</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="channel-email"
                      checked={formData.channel.includes('email')}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return;
                        const channels = checked
                          ? [...formData.channel, 'email']
                          : formData.channel.filter(c => c !== 'email');
                        setFormData({ ...formData, channel: channels as Channel[] });
                      }}
                    />
                    <Label htmlFor="channel-email">E-post</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="channel-sms"
                      checked={formData.channel.includes('sms')}
                      onCheckedChange={(checked) => {
                        if (checked === 'indeterminate') return;
                        const channels = checked
                          ? [...formData.channel, 'sms']
                          : formData.channel.filter(c => c !== 'sms');
                        setFormData({ ...formData, channel: channels as Channel[] });
                      }}
                    />
                    <Label htmlFor="channel-sms">SMS</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleSave}>
                  {editingTemplate ? 'Uppdatera' : 'Skapa'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
