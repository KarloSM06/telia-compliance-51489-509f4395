import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, FileAudio, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CallDetailModal } from "@/components/CallDetailModal";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

interface Call {
  id: string;
  file_name: string;
  file_path: string | null;
  status: string;
  score: number | null;
  sale_outcome: boolean | null;
  created_at: string;
  encrypted_transcript: string | null;
  encrypted_analysis: any;
  duration: string | null;
  analysis?: string | null;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  improvements?: string[] | null;
  violations?: any[] | null;
}

interface UploadProgress {
  fileName: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface UserAnalysis {
  total_calls: number;
  average_score: number | null;
  success_rate: number | null;
  biggest_strength: string | null;
  biggest_weakness: string | null;
  recommendations: string[] | null;
}

export function CallAnalysisSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calls, setCalls] = useState<Call[]>([]);
  const [userAnalysis, setUserAnalysis] = useState<UserAnalysis | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCalls();
      fetchUserAnalysis();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsedCalls = (data || []).map(call => {
        const encryptedAnalysis = typeof call.encrypted_analysis === 'object' ? call.encrypted_analysis as any : null;
        return {
          ...call,
          analysis: encryptedAnalysis?.analysis || null,
          strengths: encryptedAnalysis?.strengths || null,
          weaknesses: encryptedAnalysis?.weaknesses || null,
          improvements: encryptedAnalysis?.improvements || null,
          violations: encryptedAnalysis?.violations || null,
        };
      });
      
      setCalls(parsedCalls as Call[]);
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast({
        title: "Fel",
        description: "Kunde inte hämta samtal",
        variant: "destructive",
      });
    } finally {
      setLoadingCalls(false);
    }
  };

  const fetchUserAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('user_analysis')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const encryptedInsights = typeof data.encrypted_insights === 'object' ? data.encrypted_insights as any : null;
        const parsedAnalysis = {
          total_calls: data.total_calls,
          average_score: data.average_score,
          success_rate: data.success_rate,
          biggest_strength: encryptedInsights?.biggest_strength || null,
          biggest_weakness: encryptedInsights?.biggest_weakness || null,
          recommendations: encryptedInsights?.recommendations || null,
        };
        setUserAnalysis(parsedAnalysis);
      }
    } catch (error) {
      console.error('Error fetching user analysis:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('calls_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchCalls();
          fetchUserAnalysis();
          
          const row = (payload as any).new as { file_name?: string; status?: string } | null;
          if (row && row.file_name) {
            setUploadProgress(prev => prev.map(item => 
              item.fileName === row.file_name 
                ? { 
                    ...item, 
                    status: row.status === 'completed' ? 'completed' :
                           row.status === 'error' ? 'error' : 'processing',
                    progress: row.status === 'completed' ? 100 :
                             row.status === 'error' ? 0 : item.progress
                  }
                : item
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    const initialProgress: UploadProgress[] = Array.from(files).map(file => ({
      fileName: file.name,
      status: 'uploading',
      progress: 0
    }));
    setUploadProgress(initialProgress);

    const MAX_CONCURRENT = 3;
    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length; i += MAX_CONCURRENT) {
      const batch = fileArray.slice(i, i + MAX_CONCURRENT);
      
      await Promise.allSettled(
        batch.map(file => uploadAndProcessFile(file))
      );
    }

    setUploading(false);
    event.target.value = '';
  };

  const uploadAndProcessFile = async (file: File): Promise<void> => {
    const updateProgress = (status: UploadProgress['status'], progress: number, error?: string) => {
      setUploadProgress(prev => prev.map(item => 
        item.fileName === file.name 
          ? { ...item, status, progress, error }
          : item
      ));
    };

    try {
      updateProgress('uploading', 25);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      updateProgress('uploading', 50);

      const { error: insertError } = await supabase
        .from('calls')
        .insert({
          user_id: user?.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          status: 'uploaded'
        });

      if (insertError) throw insertError;

      updateProgress('processing', 75);
      updateProgress('completed', 100);
      
      fetchCalls();

    } catch (error) {
      console.error('Upload error for', file.name, ':', error);
      updateProgress('error', 0, error instanceof Error ? error.message : 'Okänt fel');
      
      toast({
        title: "Uppladdningsfel",
        description: `Kunde inte ladda upp ${file.name}`,
        variant: "destructive",
      });
    }
  };

  const processCall = async (filePath: string, fileName: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-call', {
        body: { filePath }
      });

      if (error) throw error;

      toast({
        title: "Bearbetning startad",
        description: `Analyserar ${fileName}`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      setUploadProgress(prev => prev.map(item => 
        item.fileName === fileName 
          ? { ...item, status: 'error', error: 'Kunde inte starta analys' }
          : item
      ));
    }
  };

  const startAnalysisForAllUploaded = async () => {
    try {
      const readyCalls = calls.filter(call => call.status === 'uploaded');
      for (const call of readyCalls) {
        setCalls(prev => prev.map(c => c.id === call.id ? { ...c, status: 'processing' } : c));
        await processCall(call.file_path, call.file_name);
      }
      toast({
        title: "Analys startad",
        description: `Startar analys för ${readyCalls.length} samtal`,
      });
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        title: "Fel",
        description: "Kunde inte starta analysen",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'uploaded': { label: 'Uppladdad', variant: 'secondary' as const },
      'processing': { label: 'Bearbetas', variant: 'default' as const },
      'completed': { label: 'Klar', variant: 'default' as const },
      'error': { label: 'Fel', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.uploaded;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loadingCalls) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar samtalsanalys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Samtalsanalys Dashboard</h1>
        <p className="text-muted-foreground text-lg">Analysera och förbättra era säljsamtal med AI</p>
      </div>

      <DashboardStats
        totalCalls={userAnalysis?.total_calls || 0}
        averageScore={userAnalysis?.average_score || null}
        successRate={userAnalysis?.success_rate || null}
      />

      <Card className="transition-all hover:shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Upload className="mr-2 h-5 w-5" />
            Ladda upp samtalsloggningar
          </CardTitle>
          <CardDescription>
            Stöder MP3, WAV, M4A och andra ljudformat. Flera filer kan laddas upp samtidigt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileAudio className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Klicka för att ladda upp</span> eller dra och släpp
                </p>
                <p className="text-xs text-muted-foreground">MP3, WAV, M4A (MAX. 20MB per fil)</p>
              </div>
              <input
                type="file"
                multiple
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
          {uploading && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm font-medium">Bearbetar {uploadProgress.length} filer parallellt</span>
              </div>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-48">{progress.fileName}</span>
                    <div className="flex items-center space-x-2">
                      {progress.status === 'uploading' && <span className="text-blue-600">Laddar upp...</span>}
                      {progress.status === 'processing' && <span className="text-yellow-600">Analyserar...</span>}
                      {progress.status === 'completed' && <span className="text-green-600">Klar!</span>}
                      {progress.status === 'error' && <span className="text-red-600">Fel</span>}
                    </div>
                  </div>
                  <Progress value={progress.progress} className="h-2" />
                  {progress.error && (
                    <p className="text-xs text-red-600">{progress.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {calls.some(c => c.status === 'uploaded') && (
            <div className="mt-4 text-center">
              <Button onClick={startAnalysisForAllUploaded} className="bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-4 w-4" />
                Påbörja analys för uppladdade samtal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="calls" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calls" className="transition-all">Samtal</TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all">Analys</TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-6 animate-fade-in">
          <Card className="transition-all hover:shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Samtalshistorik</CardTitle>
              <CardDescription>
                Röd = Regelöverträdelse | Grön = Inga överträdelser
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calls.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <FileAudio className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
                  <p className="text-muted-foreground text-lg">Inga samtal uppladdade än</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ladda upp dina första samtalsloggningar för att komma igång
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {calls.map((call, index) => {
                    const hasViolations = call.violations && Array.isArray(call.violations) && call.violations.length > 0;
                    const isCompleted = call.status === 'completed';
                    const complianceColor = isCompleted ? (hasViolations ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50') : 'border-gray-300 bg-gray-50';
                    const textColor = isCompleted ? (hasViolations ? 'text-red-700' : 'text-green-700') : 'text-gray-600';
                    
                    return (
                      <div 
                        key={call.id} 
                        className={`relative p-3 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all animate-scale-in ${complianceColor} group`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => {
                          setSelectedCall(call);
                          setIsModalOpen(true);
                        }}
                        title={`${call.file_name} - ${hasViolations ? `${call.violations?.length} överträdelser` : 'Inga överträdelser'}`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            {call.status === 'completed' ? (
                              hasViolations ? (
                                <AlertCircle className="h-8 w-8 text-red-600" />
                              ) : (
                                <FileAudio className="h-8 w-8 text-green-600" />
                              )
                            ) : call.status === 'processing' ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                            ) : (
                              <FileAudio className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-medium truncate ${textColor}`}>
                              {call.file_name.length > 12 
                                ? `${call.file_name.substring(0, 12)}...` 
                                : call.file_name}
                            </p>
                            {call.score !== null && (
                              <p className={`text-lg font-bold mt-1 ${getScoreColor(call.score)}`}>
                                {call.score}%
                              </p>
                            )}
                            <div className="mt-1">
                              {getStatusBadge(call.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-2">
            {userAnalysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="mr-2 h-5 w-5 text-success" />
                      Största Styrka
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {userAnalysis.biggest_strength || 'Ladda upp samtal för analys'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3 className="mr-2 h-5 w-5 text-warning" />
                      Förbättringsområde
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {userAnalysis.biggest_weakness || 'Ladda upp samtal för analys'}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {userAnalysis?.recommendations && userAnalysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rekommendationer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {userAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CallDetailModal
        call={selectedCall}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCall(null);
        }}
      />
    </div>
  );
}
