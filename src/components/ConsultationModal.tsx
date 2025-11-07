import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConsultationForm } from "@/components/ConsultationForm";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent">
            AI Konsultation
          </DialogTitle>
        </DialogHeader>
        
        <ConsultationForm 
          showAsModal={true}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
