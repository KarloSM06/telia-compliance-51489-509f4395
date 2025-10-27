import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/hooks/useLeads";
import { Mail, Phone, Globe, Building2, MapPin, Save } from "lucide-react";

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
}

const statusOptions: Lead['status'][] = ['new', 'enriched', 'contacted', 'qualified', 'converted', 'rejected'];
const priorityOptions: Lead['priority'][] = ['low', 'medium', 'high'];

const statusLabels = {
  new: "Ny",
  enriched: "Berikad",
  contacted: "Kontaktad",
  qualified: "Kvalificerad",
  converted: "Konverterad",
  rejected: "Avvisad",
};

const priorityLabels = {
  low: "Låg",
  medium: "Medium",
  high: "Hög",
};

export function LeadDetailModal({ lead, open, onOpenChange, onUpdate }: LeadDetailModalProps) {
  const [notes, setNotes] = useState(lead?.notes || "");
  const [status, setStatus] = useState<Lead['status']>(lead?.status || 'new');
  const [priority, setPriority] = useState<Lead['priority']>(lead?.priority || 'medium');

  if (!lead) return null;

  const handleSave = () => {
    onUpdate(lead.id, { notes, status, priority });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {lead.company_name}
          </DialogTitle>
          <DialogDescription>Lead-detaljer och aktivitet</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Person Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Namn</Label>
              <p className="font-medium">
                {lead.full_name || 
                 (lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 
                  lead.contact_person || "-")}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Jobbtitel</Label>
              <p className="font-medium">{lead.job_title || "-"}</p>
            </div>
            {lead.job_seniority_level && (
              <div>
                <Label className="text-muted-foreground">Senioritetsnivå</Label>
                <p className="font-medium capitalize">{lead.job_seniority_level}</p>
              </div>
            )}
            {lead.job_department && (
              <div>
                <Label className="text-muted-foreground">Avdelning</Label>
                <p className="font-medium">{lead.job_department}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Stad</Label>
              <p className="font-medium">{lead.city || lead.location || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Region</Label>
              <p className="font-medium">{lead.region_name || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Land</Label>
              <p className="font-medium">{lead.country_name || "-"}</p>
            </div>
            {(lead.Adress || lead.Postal_Area) && (
              <>
                <div>
                  <Label className="text-muted-foreground">Adress</Label>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {lead.Adress || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Postnummer</Label>
                  <p className="font-medium">{lead.Postal_Area || "-"}</p>
                </div>
              </>
            )}
          </div>

          {/* Company Info */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Företagsinformation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Bransch</Label>
                <p className="font-medium">{lead.industry || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Företagsstorlek</Label>
                <p className="font-medium">{lead.company_size || "-"}</p>
              </div>
              {lead.company_linkedin && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Företagets LinkedIn</Label>
                  <a 
                    href={lead.company_linkedin.startsWith('http') ? lead.company_linkedin : `https://${lead.company_linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    {lead.company_linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Kontaktuppgifter</Label>
            <div className="space-y-1">
              {lead.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                    {lead.email}
                  </a>
                </p>
              )}
              {lead.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                    {lead.phone}
                  </a>
                </p>
              )}
              {lead.linkedin && (
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    LinkedIn-profil
                  </a>
                </p>
              )}
              {lead.website && (
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {lead.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          {lead.experience && lead.experience.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-muted-foreground mb-2 block">Erfarenhet</Label>
              <div className="space-y-2">
                {lead.experience.slice(0, 5).map((exp, idx) => (
                  <div key={idx} className="text-sm bg-muted/50 rounded p-2">
                    {exp}
                  </div>
                ))}
                {lead.experience.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{lead.experience.length - 5} fler positioner
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {lead.skills && lead.skills.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-muted-foreground mb-2 block">Kompetenser</Label>
              <div className="flex flex-wrap gap-1">
                {lead.skills.slice(0, 15).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {lead.skills.length > 15 && (
                  <Badge variant="outline" className="text-xs">
                    +{lead.skills.length - 15} fler
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          {lead.interests && lead.interests.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-muted-foreground mb-2 block">Intressen</Label>
              <div className="flex flex-wrap gap-1">
                {lead.interests.map((interest, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {lead.ai_score && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <Label>AI Score</Label>
                <Badge variant={lead.ai_score >= 80 ? "default" : "secondary"}>
                  {lead.ai_score}/100
                </Badge>
              </div>
              {lead.ai_reasoning && (
                <p className="text-sm text-muted-foreground">{lead.ai_reasoning}</p>
              )}
            </div>
          )}

          {/* Description */}
          {lead.description && (
            <div>
              <Label className="text-muted-foreground">Beskrivning</Label>
              <p className="text-sm mt-1">{lead.description}</p>
            </div>
          )}

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={status === option ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatus(option)}
                  >
                    {statusLabels[option]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prioritet</Label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={priority === option ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setPriority(option)}
                  >
                    {priorityLabels[option]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Anteckningar</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Lägg till anteckningar om detta lead..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Spara ändringar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}