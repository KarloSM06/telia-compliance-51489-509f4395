import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary" />
        <img 
          src={hiemsLogoSnowflake} 
          alt="" 
          className="absolute inset-0 m-auto h-8 w-8 opacity-30 animate-pulse" 
        />
      </div>
      <p className="text-muted-foreground font-medium">Laddar användare...</p>
    </div>
  );
}
