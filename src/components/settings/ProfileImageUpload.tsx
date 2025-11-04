import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function ProfileImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAvatar();
  }, [user]);

  const fetchAvatar = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();
    
    if (data?.avatar_url) setAvatarUrl(data.avatar_url);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Endast bildfiler är tillåtna');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Filen är för stor. Max 2MB.');
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success('Profilbild uppdaterad!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Kunde inte ladda upp bilden');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !avatarUrl) return;
    
    try {
      setUploading(true);
      
      // Delete from storage
      const fileName = avatarUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('avatars').remove([fileName]);

      // Update profile
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      setAvatarUrl(null);
      toast.success('Profilbild borttagen');
    } catch (error) {
      toast.error('Kunde inte ta bort bilden');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-24 w-24 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5">
          <Camera className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {avatarUrl ? 'Byt bild' : 'Ladda upp'}
          </Button>
          
          {avatarUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={uploading}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          Max 2MB • JPG, PNG eller GIF
        </p>
      </div>
    </div>
  );
}
