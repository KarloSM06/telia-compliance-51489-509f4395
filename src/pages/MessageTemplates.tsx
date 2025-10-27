import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMessageTemplates, type TemplateType, type Tone } from "@/hooks/useMessageTemplates";
import { useState } from "react";
import { Plus, Trash2, Edit, FileText, Send, Search, Filter, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TestMessageModal } from "@/components/message-templates/TestMessageModal";
import { StatCard } from "@/components/communications/StatCard";
import { Badge } from "@/components/ui/badge";

export default function MessageTemplates() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useMessageTemplates();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testingTemplate, setTestingTemplate] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

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

  // Calculate stats
  const stats = {
    total: templates?.length || 0,
    active: templates?.filter(t => t.is_active).length || 0,
    email: templates?.filter(t => t.channel.includes('email')).length || 0,
    sms: templates?.filter(t => t.channel.includes('sms')).length || 0,
  };

  // Filter templates
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.body_template.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || template.template_type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laddar mallar...</div>;
  }

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Totalt antal mallar" value={stats.total} icon={FileText} />
        <StatCard title="Aktiva mallar" value={stats.active} icon={CheckCircle} />
        <StatCard title="E-post mallar" value={stats.email} icon={FileText} />
        <StatCard title="SMS mallar" value={stats.sms} icon={Send} />
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök efter mall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla typer</SelectItem>
                  <SelectItem value="booking_confirmation">Bekräftelse</SelectItem>
                  <SelectItem value="reminder">Påminnelse</SelectItem>
                  <SelectItem value="review_request">Recension</SelectItem>
                  <SelectItem value="cancellation">Avbokning</SelectItem>
                </SelectContent>
              </Select>
              {!isCreating && (
                <Button onClick={() => setIsCreating(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ny mall
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-2 border-primary/20 shadow-card">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingId ? "Redigera mall" : "Skapa ny mall"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex gap-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={formData.channel.includes('email')}
                    onCheckedChange={(checked) => handleChannelChange('email', checked)}
                  />
                  <Label htmlFor="email" className="cursor-pointer">E-post</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={formData.channel.includes('sms')}
                    onCheckedChange={(checked) => handleChannelChange('sms', checked)}
                  />
                  <Label htmlFor="sms" className="cursor-pointer">SMS</Label>
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
                rows={8}
                placeholder="Hej {{customer_name}}! Din bokning är bekräftad för {{date}} kl {{time}}..."
                className="font-mono text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {['customer_name', 'date', 'time', 'service', 'address', 'contact_person'].map(variable => (
                  <Badge key={variable} variant="secondary" className="font-mono">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex items-end space-x-2 pb-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Aktiv mall</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSubmit} size="lg">
                {editingId ? "Uppdatera" : "Skapa"} mall
              </Button>
              <Button variant="outline" onClick={resetForm} size="lg">
                Avbryt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-card transition-all hover-scale">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {template.name}
                    {template.is_active ? (
                      <Badge variant="default" className="text-xs">Aktiv</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inaktiv</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {template.template_type === 'booking_confirmation' && 'Bokningsbekräftelse'}
                      {template.template_type === 'reminder' && 'Påminnelse'}
                      {template.template_type === 'review_request' && 'Recensionsförfrågan'}
                      {template.template_type === 'cancellation' && 'Avbokning'}
                    </Badge>
                    {template.channel.map(ch => (
                      <Badge key={ch} variant="outline">{ch}</Badge>
                    ))}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTestingTemplate({ id: template.id, name: template.name })}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {template.subject && (
                <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Ämne</p>
                  <p className="text-sm mt-1">{template.subject}</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {template.body_template}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Inga mallar hittades</p>
          </CardContent>
        </Card>
      )}

      {testingTemplate && (
        <TestMessageModal
          open={!!testingTemplate}
          onClose={() => setTestingTemplate(null)}
          templateId={testingTemplate.id}
          templateName={testingTemplate.name}
        />
      )}
    </div>
  );
}
