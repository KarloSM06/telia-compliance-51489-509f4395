import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LeadTypeSelector } from "./LeadTypeSelector";
import { BRFSearchForm } from "./BRFSearchForm";
import { BusinessSearchForm } from "./BusinessSearchForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface LeadWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function LeadWizard({ open, onOpenChange, onSubmit, isSubmitting }: LeadWizardProps) {
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [leadType, setLeadType] = useState<'brf' | 'business' | null>(null);

  const handleTypeSelect = (type: 'brf' | 'business') => {
    setLeadType(type);
    setStep('form');
  };

  const handleBack = () => {
    setStep('type');
    setLeadType(null);
  };

  const handleClose = () => {
    setStep('type');
    setLeadType(null);
    onOpenChange(false);
  };

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 'type' ? 'Välj typ av lead' : leadType === 'brf' ? 'BRF-sökning' : 'Företagssökning'}
          </DialogTitle>
          <DialogDescription>
            {step === 'type' 
              ? 'Välj om du vill söka efter Bostadsrättsföreningar eller Företag' 
              : 'Fyll i kriterier för din AI-drivna prospektering'}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        )}

        {step === 'type' && (
          <LeadTypeSelector onSelect={handleTypeSelect} selected={leadType || undefined} />
        )}

        {step === 'form' && leadType === 'brf' && (
          <BRFSearchForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}

        {step === 'form' && leadType === 'business' && (
          <BusinessSearchForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </DialogContent>
    </Dialog>
  );
}
