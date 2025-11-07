import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { AiConsultation } from '@/hooks/useAdminConsultations';

interface ConsultationsTableProps {
  data: AiConsultation[];
  onShowDetails: (consultation: AiConsultation) => void;
}

export function ConsultationsTable({ data, onShowDetails }: ConsultationsTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Inga konsultationer ännu.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Skapad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Företag</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Kontaktperson</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">E-post</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Telefon</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Prioritet</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Åtgärd</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((consultation) => (
              <tr key={consultation.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm">
                  {consultation.created_at
                    ? format(new Date(consultation.created_at), 'PPp', { locale: sv })
                    : '-'}
                </td>
                <td className="px-4 py-3 text-sm font-medium">{consultation.company_name}</td>
                <td className="px-4 py-3 text-sm">{consultation.contact_person}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{consultation.email}</td>
                <td className="px-4 py-3 text-sm">{consultation.phone}</td>
                <td className="px-4 py-3 text-sm">
                  {consultation.ai_priority !== null && consultation.ai_priority !== undefined ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {consultation.ai_priority}/10
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShowDetails(consultation)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visa detaljer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
