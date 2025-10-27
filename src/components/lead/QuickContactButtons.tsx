import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, Phone, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

interface QuickContactButtonsProps {
  email?: string;
  phone?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function QuickContactButtons({ email, phone, className = "", size = "default" }: QuickContactButtonsProps) {
  const handleCopyPhone = async (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const normalized = normalizePhoneNumber(phoneNumber);
    await navigator.clipboard.writeText(normalized);
    toast({
      title: "Telefonnummer kopierat",
      description: normalized,
    });
  };

  const handleEmailClick = (emailAddress: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {email && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={size}
                variant="outline"
                className="gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950 transition-colors"
                onClick={(e) => handleEmailClick(email, e)}
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Email</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {phone && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={size}
                variant="outline"
                className="gap-2 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950 transition-colors"
                onClick={(e) => handleCopyPhone(phone, e)}
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span className="hidden sm:inline">Ring</span>
                <Copy className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Klicka för att kopiera: {phone}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}