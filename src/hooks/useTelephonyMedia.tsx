import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TelephonyMedia {
  id: string;
  event_id: string;
  media_type: 'recording' | 'transcript' | 'voicemail';
  provider_url: string | null;
  storage_path: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  mime_type: string | null;
  download_status: 'pending' | 'downloading' | 'completed' | 'failed';
  download_error: string | null;
  expires_at: string | null;
  created_at: string;
  downloaded_at: string | null;
}

export function useTelephonyMedia(eventId: string) {
  return useQuery({
    queryKey: ['telephony-media', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telephony_media')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TelephonyMedia[];
    },
    enabled: !!eventId,
  });
}

export function useMediaDownloadUrl(storagePath: string | null) {
  return useQuery({
    queryKey: ['media-download-url', storagePath],
    queryFn: async () => {
      if (!storagePath) return null;

      const { data } = await supabase.storage
        .from('audio-files')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    },
    enabled: !!storagePath,
    staleTime: 3000000, // 50 minutes
  });
}
