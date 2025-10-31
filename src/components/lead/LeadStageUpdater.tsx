import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface LeadStageUpdaterProps {
  leadId: string;
  currentStage: string;
  onUpdate: (stage: string, dealValue?: number) => void;
  isUpdating?: boolean;
}

const stages = [
  { value: "new", label: "Ny Lead", color: "bg-gray-500" },
  { value: "contacted", label: "Kontaktad", color: "bg-blue-500" },
  { value: "meeting_scheduled", label: "Möte Bokat", color: "bg-purple-500" },
  { value: "meeting_held", label: "Möte Genomfört", color: "bg-indigo-500" },
  { value: "deal_closed", label: "Affär Stängd", color: "bg-green-500" },
  { value: "lost", label: "Förlorad", color: "bg-red-500" }
];

export function LeadStageUpdater({ leadId, currentStage, onUpdate, isUpdating }: LeadStageUpdaterProps) {
  const [open, setOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(currentStage);
  const [dealValue, setDealValue] = useState<string>("");

  const currentStageObj = stages.find(s => s.value === currentStage);
  const selectedStageObj = stages.find(s => s.value === selectedStage);

  const handleUpdate = () => {
    const value = selectedStage === "deal_closed" && dealValue ? parseFloat(dealValue) : undefined;
    onUpdate(selectedStage, value);
    setOpen(false);
    setDealValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className={`w-2 h-2 rounded-full ${currentStageObj?.color}`} />
          {currentStageObj?.label}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uppdatera Lead Stage</DialogTitle>
          <DialogDescription>
            Flytta leaden genom konverteringstratten för att spåra framsteg.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nuvarande Stage</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className={`w-3 h-3 rounded-full ${currentStageObj?.color}`} />
              <span className="font-medium">{currentStageObj?.label}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Ny Stage</Label>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger id="stage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                      {stage.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStage === "deal_closed" && (
            <div className="space-y-2">
              <Label htmlFor="dealValue">Affärsvärde (SEK)</Label>
              <Input
                id="dealValue"
                type="number"
                placeholder="t.ex. 50000"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Avbryt
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Uppdaterar..." : "Uppdatera Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
