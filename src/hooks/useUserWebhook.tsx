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

  const webhookUrl = webhookToken 
    ? `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/user-webhook?token=${webhookToken}`
    : null;

  return {
    webhookUrl,
    webhookToken,
    isLoading,
  };
};
