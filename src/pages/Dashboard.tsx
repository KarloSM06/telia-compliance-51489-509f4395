import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Play, Pause, FileAudio, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { CallDetailModal } from "@/components/CallDetailModal";

interface Call {
  id: string;
  file_name: string;
  file_path: string;
  status: string;
  score: number | null;
  sale_outcome: boolean | null;
  created_at: string;
  analysis: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  improvements: string[] | null;
  duration: string | null;
  violations: any[] | null;
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

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calls, setCalls] = useState<Call[]>([]);
  const [userAnalysis, setUserAnalysis] = useState<UserAnalysis | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
      setCalls((data || []) as Call[]);
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
      setUserAnalysis(data);
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
          fetchCalls(); // Refresh calls when any change occurs
          fetchUserAnalysis(); // Refresh analysis too
          
          // Safely read new row values
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
    
    // Initialize progress tracking for all files
    const initialProgress: UploadProgress[] = Array.from(files).map(file => ({
      fileName: file.name,
      status: 'uploading',
      progress: 0
    }));
    setUploadProgress(initialProgress);

    // Process files in parallel with concurrency limit
    const MAX_CONCURRENT = 3; // Process max 3 files simultaneously
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

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      updateProgress('uploading', 50);

      // Create call record
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

      // File uploaded successfully, will be shown in call history
      updateProgress('completed', 100);
      
      // Refresh calls to show newly uploaded file
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

  if (loading || loadingCalls) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Samtalsanalys Dashboard</h1>
          <p className="text-muted-foreground">Analysera och förbättra era säljsamtal med AI</p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
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
            
            {/* Start Analysis Button */}
            {!uploading && uploadProgress.length > 0 && uploadProgress.every(p => p.status === 'completed') && (
              <div className="mt-4 text-center">
                <Button 
                  onClick={async () => {
                    try {
                      // Start analysis for all uploaded calls that are ready
                      const readyCalls = calls.filter(call => call.status === 'uploaded');
                      
                      for (const call of readyCalls) {
                        await processCall(call.file_path, call.file_name);
                      }
                      
                      setUploadProgress([]); // Clear progress after starting analysis
                      
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
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Påbörja analys
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="calls" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calls">Samtal</TabsTrigger>
            <TabsTrigger value="analytics">Analys</TabsTrigger>
          </TabsList>

          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Samtalshistorik</CardTitle>
                <CardDescription>
                  Röd = Regelöverträdelse | Grön = Inga överträdelser
                </CardDescription>
              </CardHeader>
              <CardContent>
                {calls.length === 0 ? (
                  <div className="text-center py-8">
                    <FileAudio className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Inga samtal uppladdade än</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ladda upp dina första samtalsloggningar för att komma igång
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {calls.map((call) => {
                      const hasViolations = call.violations && Array.isArray(call.violations) && call.violations.length > 0;
                      const isCompleted = call.status === 'completed';
                      const complianceColor = isCompleted ? (hasViolations ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50') : 'border-gray-300 bg-gray-50';
                      const textColor = isCompleted ? (hasViolations ? 'text-red-700' : 'text-green-700') : 'text-gray-600';
                      
                      return (
                        <div 
                          key={call.id} 
                          className={`relative p-3 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${complianceColor} group`}
                          onClick={() => {
                            setSelectedCall(call);
                            setIsModalOpen(true);
                          }}
                          title={`${call.file_name} - ${hasViolations ? `${call.violations?.length} överträdelser` : 'Inga överträdelser'}`}
                        >
                          <div className="space-y-2">
                            {/* Status indicator */}
                            <div className="flex justify-center">
                              {call.status === 'completed' ? (
                                hasViolations ? (
                                  <AlertCircle className="h-6 w-6 text-red-500" />
                                ) : (
                                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                  </div>
                                )
                              ) : (
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
                              )}
                            </div>
                            
                            {/* File name (truncated) */}
                            <div className={`text-xs font-medium text-center truncate ${textColor}`}>
                              {call.file_name.replace(/\.[^/.]+$/, "")}
                            </div>
                            
                            {/* Duration */}
                            {call.duration && (
                              <div className="text-xs text-center text-gray-500">
                                {call.duration}
                              </div>
                            )}
                            
                            {/* Score or violation count */}
                            {isCompleted && (
                              <div className="text-center">
                                {hasViolations ? (
                                  <div className="text-xs font-bold text-red-600">
                                    {call.violations?.length} övertr.
                                  </div>
                                ) : (
                                  <div className="text-xs font-bold text-green-600">
                                    OK
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Sale outcome */}
                            {call.sale_outcome !== null && (
                              <div className="text-center">
                                <div className={`text-xs px-1 py-0.5 rounded ${call.sale_outcome ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {call.sale_outcome ? '💰' : '❌'}
                                </div>
                              </div>
                            )}
                            
                            {/* Violations details on hover/click */}
                            {hasViolations && call.violations && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-1 p-2 bg-white border border-red-200 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                                <div className="text-xs text-red-700 space-y-1">
                                  {call.violations.slice(0, 3).map((violation: any, idx: number) => (
                                    <div key={idx} className="border-b border-red-100 pb-1">
                                      <div className="font-medium">{violation.timestamp}</div>
                                      <div>{violation.rule}</div>
                                    </div>
                                  ))}
                                  {call.violations.length > 3 && (
                                    <div className="text-center text-red-500">+{call.violations.length - 3} fler</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {userAnalysis ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Totalt antal samtal</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userAnalysis.total_calls}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Genomsnittlig kvalitet</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getScoreColor(userAnalysis.average_score)}`}>
                      {userAnalysis.average_score ? `${Math.round(userAnalysis.average_score)}/100` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Framgångsfrekvens</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userAnalysis.success_rate ? `${Math.round(userAnalysis.success_rate)}%` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>

                {userAnalysis.biggest_strength && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Största styrka</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{userAnalysis.biggest_strength}</p>
                    </CardContent>
                  </Card>
                )}

                {userAnalysis.biggest_weakness && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Utvecklingsområde</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{userAnalysis.biggest_weakness}</p>
                    </CardContent>
                  </Card>
                )}

                {userAnalysis.recommendations && userAnalysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Rekommendationer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {userAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Ingen analysdata tillgänglig än</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ladda upp och analysera samtal för att se statistik
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

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
};

export default Dashboard;