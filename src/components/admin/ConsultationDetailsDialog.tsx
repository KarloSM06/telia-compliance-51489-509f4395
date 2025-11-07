import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { AiConsultation } from '@/hooks/useAdminConsultations';

interface ConsultationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation: AiConsultation | null;
}

export function ConsultationDetailsDialog({
  open,
  onOpenChange,
  consultation,
}: ConsultationDetailsDialogProps) {
  if (!consultation) return null;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-primary border-b pb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}:</dt>
      <dd className="col-span-2 text-sm">{value || '-'}</dd>
    </div>
  );

  const ArrayField = ({ label, values }: { label: string; values?: string[] | null }) => (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}:</dt>
      <dd className="col-span-2">
        {values && values.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {values.map((val, idx) => (
              <Badge key={idx} variant="secondary">
                {val}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </dd>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Konsultationsförfrågan: {consultation.company_name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Mottagen:{' '}
            {consultation.created_at
              ? format(new Date(consultation.created_at), 'PPPp', { locale: sv })
              : '-'}
          </p>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* 1. Företagsinformation */}
            <Section title="1. Företagsinformation">
              <Field label="Företagsnamn" value={consultation.company_name} />
              <Field label="Kontaktperson" value={consultation.contact_person} />
              <Field label="E-post" value={consultation.email} />
              <Field label="Telefon" value={consultation.phone} />
              <Field label="Verksamhetsbeskrivning" value={consultation.business_description} />
            </Section>

            {/* 2. AI-mål och vision */}
            <Section title="2. AI-mål och vision">
              <ArrayField label="AI-mål" values={consultation.ai_goals} />
              {consultation.ai_goals_other && (
                <Field label="Övriga mål" value={consultation.ai_goals_other} />
              )}
              <Field label="Framgångsdefinition" value={consultation.success_definition} />
              <Field
                label="AI-prioritet"
                value={
                  consultation.ai_priority !== null && consultation.ai_priority !== undefined
                    ? `${consultation.ai_priority}/10`
                    : undefined
                }
              />
            </Section>

            {/* 3. Nulägesanalys */}
            <Section title="3. Nulägesanalys">
              <Field label="Manuella processer" value={consultation.manual_processes} />
              <Field label="Befintlig AI" value={consultation.existing_ai} />
              <Field label="Nuvarande system" value={consultation.current_systems} />
            </Section>

            {/* 4. Data och infrastruktur */}
            <Section title="4. Data och infrastruktur">
              <ArrayField label="Datatyper" values={consultation.data_types} />
              {consultation.data_types_other && (
                <Field label="Övriga datatyper" value={consultation.data_types_other} />
              )}
              <Field label="Historisk data" value={consultation.historical_data} />
              <Field
                label="Datakvalitet"
                value={
                  consultation.data_quality !== null && consultation.data_quality !== undefined
                    ? `${consultation.data_quality}/10`
                    : undefined
                }
              />
              <Field label="GDPR-efterlevnad" value={consultation.gdpr_compliant} />
            </Section>

            {/* 5. Resurser och organisation */}
            <Section title="5. Resurser och organisation">
              <ArrayField label="Interna resurser" values={consultation.internal_resources} />
              {consultation.internal_resources_other && (
                <Field label="Övriga resurser" value={consultation.internal_resources_other} />
              )}
              <Field label="Budget" value={consultation.budget} />
              <Field label="Tidsram" value={consultation.timeframe} />
            </Section>

            {/* 6. Målgrupper och användare */}
            <Section title="6. Målgrupper och användare">
              <ArrayField label="AI-användare" values={consultation.ai_users} />
              {consultation.ai_users_other && (
                <Field label="Övriga användare" value={consultation.ai_users_other} />
              )}
              <Field label="Utbildningsbehov" value={consultation.training_needed} />
            </Section>

            {/* 7. Regler och etik */}
            <Section title="7. Regler och etik">
              <Field label="Lagkrav" value={consultation.regulatory_requirements} />
              <Field label="Känslig data" value={consultation.sensitive_data} />
              <Field label="Etiska begränsningar" value={consultation.ethical_limitations} />
            </Section>

            {/* 8. Framtidsplaner */}
            <Section title="8. Framtidsplaner">
              <Field label="Långsiktiga mål" value={consultation.long_term_goals} />
              <Field label="Öppen för experiment" value={consultation.open_to_experiments} />
            </Section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
