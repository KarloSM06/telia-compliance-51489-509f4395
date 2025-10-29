import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, RefreshCw, Settings, Trash2 } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getProviderDisplayName, getProviderLogo } from '@/lib/telephonyFormatters';

export const AgentManager = () => {
  const { agents, isLoading, syncAgents, updateAgent, deleteAgent } = useAgents();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Voice Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const agentsByProvider = agents.reduce((acc, agent) => {
    if (!acc[agent.provider]) acc[agent.provider] = [];
    acc[agent.provider].push(agent);
    return acc;
  }, {} as Record<string, typeof agents>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Voice Agents
            </CardTitle>
            <CardDescription>
              Hantera dina AI-assistenter och röstflöden från alla providers
            </CardDescription>
          </div>
          <Button
            onClick={() => syncAgents.mutate()}
            disabled={syncAgents.isPending}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncAgents.isPending ? 'animate-spin' : ''}`} />
            Synka Agents
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Inga agents hittades</p>
            <p className="text-sm">Synka för att hämta dina agents från providers</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(agentsByProvider).map(([provider, providerAgents]) => (
              <div key={provider} className="space-y-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={getProviderLogo(provider)} 
                    alt={provider}
                    className="h-5 w-5 object-contain"
                  />
                  <h3 className="font-semibold text-sm">
                    {getProviderDisplayName(provider)}
                  </h3>
                  <Badge variant="secondary">{providerAgents.length}</Badge>
                </div>
                
                <div className="space-y-2">
                  {providerAgents.map(agent => (
                    <Card key={agent.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{agent.name}</h4>
                              <Badge 
                                variant={agent.status === 'active' ? 'default' : 'secondary'}
                              >
                                {agent.status}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Provider ID: <code className="bg-background px-1 rounded">{agent.provider_agent_id}</code></p>
                              
                              {/* Provider-specific config */}
                              {agent.provider === 'vapi' && agent.config.voice_id && (
                                <p>Voice: {agent.config.voice_id} ({agent.config.tts_provider})</p>
                              )}
                              {agent.provider === 'retell' && agent.config.voice_id && (
                                <p>Voice: {agent.config.voice_id} • Response: {agent.config.response_engine}</p>
                              )}
                              {agent.provider === 'twilio' && agent.config.voice_url && (
                                <p>Voice URL: {agent.config.voice_url}</p>
                              )}
                              {agent.provider === 'telnyx' && agent.config.connection_type && (
                                <p>Connection: {agent.config.connection_type}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateAgent.mutate({ 
                                id: agent.id, 
                                updates: { status: agent.status === 'active' ? 'inactive' : 'active' }
                              })}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ta bort agent?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Detta kommer att ta bort agenten från systemet. 
                                    Historiska samtal kommer att behållas men inte längre vara kopplade till denna agent.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteAgent.mutate(agent.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Ta bort
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
