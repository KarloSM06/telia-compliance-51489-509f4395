import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMessageTemplates, type TemplateType, type Tone } from "@/hooks/useMessageTemplates";
import { useState } from "react";
import { Plus, Trash2, Edit, FileText, Send, Search, Filter, CheckCircle, RefreshCw, Mail, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TestMessageModal } from "@/components/message-templates/TestMessageModal";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function MessageTemplates() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useMessageTemplates();
  const queryClient = useQueryClient();
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

  const handleRefresh = async () => {
    toast.loading('Uppdaterar mallar...');
    await queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    toast.dismiss();
    toast.success('Mallar uppdaterade');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laddar mallar...</div>;
  }

  return (
    <div className="space-y-0 w-full">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_80s_linear_infinite]" />
        </div>
        <div className="absolute top-10 left-1/3 w-[300px] h-[300px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_100s_linear_infinite_reverse]" />
        </div>
        <div className="absolute bottom-1/3 right-10 w-[250px] h-[250px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_70s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Automatisering</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Meddelandemallar
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Skapa och hantera anpassade meddelandemallar för automatiska utskick
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section className="relative py-6 border-y border-primary/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Live</span>
              </div>
              <Badge variant="secondary">{templates?.length || 0} mallar</Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Uppdatera
              </Button>
              {!isCreating && (
                <Button onClick={() => setIsCreating(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ny mall
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <AnimatedSection delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumTelephonyStatCard
              title="Totalt antal mallar"
              value={stats.total}
              icon={FileText}
              subtitle="Alla skapade mallar"
              color="text-blue-600"
            />
            <PremiumTelephonyStatCard
              title="Aktiva mallar"
              value={stats.active}
              icon={CheckCircle}
              subtitle="I användning"
              color="text-green-600"
              animate
            />
            <PremiumTelephonyStatCard
              title="E-post mallar"
              value={stats.email}
              icon={Mail}
              subtitle="För e-postutskick"
              color="text-purple-600"
            />
            <PremiumTelephonyStatCard
              title="SMS mallar"
              value={stats.sms}
              icon={MessageSquare}
              subtitle="För SMS-utskick"
              color="text-orange-600"
            />
          </div>
        </AnimatedSection>

        {/* Search and Filter Bar */}
        <AnimatedSection delay={200}>
          <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
            </div>
          </div>
        </CardContent>
      </Card>
        </AnimatedSection>

        {/* Create/Edit Form */}
        {isCreating && (
          <AnimatedSection delay={300}>
            <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-lg">
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
          </AnimatedSection>
        )}

        {/* Templates Grid */}
        <AnimatedSection delay={400}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-1 transition-all duration-500">
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
        </AnimatedSection>

        {filteredTemplates.length === 0 && (
          <AnimatedSection delay={500}>
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Inga mallar hittades</p>
          </CardContent>
        </Card>
          </AnimatedSection>
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
    </div>
  );
}
