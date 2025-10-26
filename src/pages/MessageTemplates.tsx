import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMessageTemplates, type TemplateType, type Tone } from "@/hooks/useMessageTemplates";
import { useState } from "react";
import { Plus, Trash2, Edit, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function MessageTemplates() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useMessageTemplates();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    template_type: "booking_confirmation" as TemplateType,
    channel: ["email"] as ("email" | "sms")[],
    subject: "",
    body_template: "",
    tone: "friendly" as Tone,
    language: "sv",
    is_active: true,
    variables: ["customer_name", "date", "time", "service", "address", "contact_person"] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      template_type: "booking_confirmation",
      channel: ["email"],
      subject: "",
      body_template: "",
      tone: "friendly",
      language: "sv",
      is_active: true,
      variables: ["customer_name", "date", "time", "service", "address", "contact_person"],
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateTemplate({ id: editingId, updates: formData });
    } else {
      createTemplate(formData);
    }
    resetForm();
  };

  const handleEdit = (template: any) => {
    setFormData({
      name: template.name,
      template_type: template.template_type,
      channel: template.channel,
      subject: template.subject || "",
      body_template: template.body_template,
      tone: template.tone,
      language: template.language,
      is_active: template.is_active,
      variables: template.variables || ["customer_name", "date", "time", "service", "address", "contact_person"],
    });
    setEditingId(template.id);
    setIsCreating(true);
  };

  const handleChannelChange = (channel: "email" | "sms", checked: boolean | 'indeterminate') => {
    if (checked === 'indeterminate') return;
    
    setFormData(prev => ({
      ...prev,
      channel: checked
        ? [...prev.channel, channel]
        : prev.channel.filter(c => c !== channel)
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">Laddar mallar...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meddelandemallar</h1>
            <p className="text-muted-foreground">
              Skapa och hantera mallar för påminnelser och bekräftelser
            </p>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny mall
            </Button>
          )}
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {editingId ? "Redigera mall" : "Skapa ny mall"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Mallnamn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="T.ex. Standard bekräftelse"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template_type">Malltyp</Label>
                  <Select
                    value={formData.template_type}
                    onValueChange={(value: any) => setFormData({ ...formData, template_type: value })}
                  >
                    <SelectTrigger id="template_type">
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
              </div>

              <div className="space-y-2">
                <Label>Kanaler</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={formData.channel.includes('email')}
                      onCheckedChange={(checked) => handleChannelChange('email', checked)}
                    />
                    <Label htmlFor="email">E-post</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={formData.channel.includes('sms')}
                      onCheckedChange={(checked) => handleChannelChange('sms', checked)}
                    />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                </div>
              </div>

              {formData.channel.includes('email') && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Ämnesrad (E-post)</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="T.ex. Bekräftelse av din bokning"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="body_template">Meddelandetext</Label>
                <Textarea
                  id="body_template"
                  value={formData.body_template}
                  onChange={(e) => setFormData({ ...formData, body_template: e.target.value })}
                  rows={6}
                  placeholder="Hej {{customer_name}}! Din bokning är bekräftad för {{date}} kl {{time}}..."
                />
                <p className="text-sm text-muted-foreground">
                  Variabler: {'{{customer_name}}'}, {'{{date}}'}, {'{{time}}'}, {'{{service}}'}, {'{{address}}'}, {'{{contact_person}}'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Ton</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value: any) => setFormData({ ...formData, tone: value })}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Vänlig</SelectItem>
                      <SelectItem value="formal">Formell</SelectItem>
                      <SelectItem value="fun">Rolig</SelectItem>
                      <SelectItem value="sales">Säljande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-8">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Aktiv mall</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit}>
                  {editingId ? "Uppdatera" : "Skapa"} mall
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Avbryt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {templates?.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {template.name}
                      {!template.is_active && (
                        <span className="text-sm font-normal text-muted-foreground">(Inaktiv)</span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {template.template_type === 'booking_confirmation' && 'Bokningsbekräftelse'}
                      {template.template_type === 'reminder' && 'Påminnelse'}
                      {template.template_type === 'review_request' && 'Recensionsförfrågan'}
                      {template.template_type === 'cancellation' && 'Avbokning'}
                      {' • '}
                      {template.channel.join(', ')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {template.subject && (
                  <p className="text-sm font-medium mb-2">Ämne: {template.subject}</p>
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {template.body_template}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
