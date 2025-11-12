import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserWebhook = () => {
  const { data: webhookToken, isLoading } = useQuery({
    queryKey: ['user-webhook-token'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('telephony_webhook_token')
        .single();
      
      if (error) throw error;
      return data?.telephony_webhook_token;
    },
  });

  // SECURITY: Webhook token should be sent in X-Webhook-Token header, not URL
  const webhookUrl = webhookToken 
    ? `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/user-webhook`
    : null;
  
  const webhookInstructions = webhookToken
    ? `Send requests to: ${webhookUrl}\nInclude header: X-Webhook-Token: ${webhookToken}`
    : null;

  return {
    webhookUrl,
    webhookToken,
    webhookInstructions,
    isLoading,
  };
};
