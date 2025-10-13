import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  dashboardId: string;
}

export const ShareModal = ({ open, onClose, dashboardId }: ShareModalProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareLink = `${window.location.origin}/dashboard/shared/${dashboardId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dela dashboard</DialogTitle>
          <DialogDescription>
            Dela din dashboard med andra eller skapa en publik länk
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Publik åtkomst</Label>
              <p className="text-sm text-muted-foreground">
                Vem som helst med länken kan se
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <div className="space-y-2">
              <Label>Delningslänk</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Dela med specifik användare</Label>
            <div className="flex gap-2">
              <Input id="email" placeholder="email@exempel.se" />
              <Select defaultValue="view">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Visa</SelectItem>
                  <SelectItem value="edit">Redigera</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button>Bjud in</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
