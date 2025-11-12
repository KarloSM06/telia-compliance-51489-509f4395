import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface PhoneNumber {
  id: string;
  user_id: string;
  integration_id: string;
  phone_number: string;
  capabilities: {
    voice?: boolean;
    sms?: boolean;
    mms?: boolean;
  };
  status: 'active' | 'inactive';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const usePhoneNumbers = () => {
  const queryClient = useQueryClient();

  const { data: phoneNumbers, isLoading } = useQuery({
    queryKey: ['phone-numbers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('phone_numbers_duplicate')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PhoneNumber[];
    },
  });

  const syncNumbers = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-phone-numbers');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['phone-numbers'] });
      
      const results = data?.results || [];
      const successCount = results.filter((r: any) => r.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        toast.success(`Synkade ${successCount} integration(er)`);
      } else {
        toast.warning(`Synkade ${successCount}/${totalCount} integrationer`);
      }
    },
    onError: (error: Error) => {
      console.error('Phone number sync error:', error);
      toast.error(`Synkning misslyckades: ${error.message}`);
    },
  });

  // Real-time subscription for phone numbers
  useEffect(() => {
    const channel = supabase
      .channel('phone-numbers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'phone_numbers_duplicate',
        },
        (payload) => {
          console.log('📱 Phone number update:', payload);
          queryClient.invalidateQueries({ queryKey: ['phone-numbers'] });
          
          if (payload.eventType === 'INSERT') {
            toast.info(`📱 Nytt telefonnummer: ${(payload.new as any)?.phone_number}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    phoneNumbers,
    isLoading,
    syncNumbers: syncNumbers.mutate,
    isSyncing: syncNumbers.isPending,
  };
};
