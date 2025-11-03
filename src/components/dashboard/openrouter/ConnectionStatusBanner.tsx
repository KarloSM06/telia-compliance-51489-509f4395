import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionStatusBannerProps {
  apiKeyExists: boolean;
  provisioningKeyExists: boolean;
  rateLimitRequests?: number;
  rateLimitInterval?: string;
  onSetupClick: () => void;
}

export const ConnectionStatusBanner = ({
  apiKeyExists,
  provisioningKeyExists,
  rateLimitRequests,
  rateLimitInterval,
  onSetupClick,
}: ConnectionStatusBannerProps) => {
  const bothConfigured = apiKeyExists && provisioningKeyExists;
  const noneConfigured = !apiKeyExists && !provisioningKeyExists;

  return (
    <Alert className={noneConfigured ? "border-destructive" : bothConfigured ? "border-green-500" : "border-yellow-500"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {bothConfigured ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : noneConfigured ? (
            <XCircle className="h-5 w-5 text-destructive" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">API Key:</span>
              <Badge variant={apiKeyExists ? "default" : "secondary"}>
                {apiKeyExists ? "Konfigurerad" : "Inte konfigurerad"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Provisioning Key:</span>
              <Badge variant={provisioningKeyExists ? "default" : "secondary"}>
                {provisioningKeyExists ? "Konfigurerad" : "Inte konfigurerad"}
              </Badge>
            </div>
            {rateLimitRequests && rateLimitInterval && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Rate Limit:</span>
                <Badge variant="outline">
                  {rateLimitRequests} req/{rateLimitInterval}
                </Badge>
              </div>
            )}
          </AlertDescription>
        </div>
        {!bothConfigured && (
          <Button size="sm" onClick={onSetupClick}>
            Konfigurera
          </Button>
        )}
      </div>
    </Alert>
  );
};
