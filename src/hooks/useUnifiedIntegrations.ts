import { useIntegrations } from './useIntegrations';
import { useBookingIntegrations } from './useBookingIntegrations';
import { useAISettings } from './useAISettings';
import { useOpenRouterKeys } from './useOpenRouterKeys';

export type UnifiedIntegrationType = 'telephony' | 'messaging' | 'calendar' | 'ai';

export interface UnifiedIntegration {
  id: string;
  name: string;
  provider: string;
  type: UnifiedIntegrationType;
  isActive: boolean;
  isVerified: boolean;
  healthStatus?: 'healthy' | 'warning' | 'error' | null;
  lastSync?: string;
  errorMessage?: string;
  capabilities?: string[];
  metadata?: any;
}

export const useUnifiedIntegrations = () => {
  const { 
    integrations: baseIntegrations, 
    isLoading: isLoadingBase,
    addIntegration,
    deleteIntegration,
    toggleActive,
    updateIntegration,
  } = useIntegrations();
  
  const { 
    integrations: bookingIntegrations, 
    loading: isLoadingBooking,
    deleteIntegration: deleteBookingIntegration,
    updateIntegration: updateBookingIntegration,
    createIntegration: createBookingIntegration,
  } = useBookingIntegrations();
  
  const { settings: aiSettings, isLoading: isLoadingAI } = useAISettings();
  const { data: openRouterKeys } = useOpenRouterKeys();

  // Convert base integrations (telephony, messaging)
  const telephonyIntegrations: UnifiedIntegration[] = baseIntegrations
    .filter(i => i.capabilities.some(c => ['voice', 'sms', 'mms'].includes(c)))
    .map(i => ({
      id: i.id,
      name: i.provider_display_name,
      provider: i.provider,
      type: i.capabilities.includes('voice') ? 'telephony' as const : 'messaging' as const,
      isActive: i.is_active,
      isVerified: i.is_verified,
      healthStatus: (i as any).health_status as any,
      lastSync: i.last_synced_at || undefined,
      errorMessage: i.error_message || undefined,
      capabilities: i.capabilities,
      metadata: i,
    }));

  // Convert booking integrations (calendar)
  const calendarIntegrations: UnifiedIntegration[] = bookingIntegrations.map(i => ({
    id: i.id,
    name: i.provider_display_name,
    provider: i.provider,
    type: 'calendar' as const,
    isActive: i.is_enabled,
    isVerified: i.last_sync_status === 'success',
    healthStatus: i.last_sync_status === 'success' ? 'healthy' : 
                  i.last_sync_status === 'error' ? 'error' : null,
    lastSync: i.last_sync_at || undefined,
    errorMessage: (i as any).last_error_message || undefined,
    capabilities: ['calendar_sync', 'booking'],
    metadata: i,
  }));

  // Convert AI settings to integration
  const aiIntegrations: UnifiedIntegration[] = [];
  if (aiSettings?.ai_provider === 'openrouter') {
    aiIntegrations.push({
      id: 'openrouter',
      name: 'OpenRouter',
      provider: 'openrouter',
      type: 'ai' as const,
      isActive: !!(openRouterKeys?.api_key_exists || openRouterKeys?.provisioning_key_exists),
      isVerified: !!(openRouterKeys?.api_key_exists && openRouterKeys?.provisioning_key_exists),
      healthStatus: (openRouterKeys?.api_key_exists && openRouterKeys?.provisioning_key_exists) 
        ? 'healthy' : openRouterKeys?.api_key_exists ? 'warning' : null,
      lastSync: undefined,
      errorMessage: undefined,
      capabilities: ['ai_chat', 'ai_models'],
      metadata: { aiSettings, openRouterKeys },
    });
  }

  // Combine all integrations
  const allIntegrations = [
    ...telephonyIntegrations,
    ...calendarIntegrations,
    ...aiIntegrations,
  ];

  // Filter functions
  const getByType = (type: UnifiedIntegrationType) => {
    return allIntegrations.filter(i => i.type === type);
  };

  const getActive = () => {
    return allIntegrations.filter(i => i.isActive);
  };

  const getHealthy = () => {
    return allIntegrations.filter(i => i.healthStatus === 'healthy');
  };

  const getWithWarnings = () => {
    return allIntegrations.filter(i => i.healthStatus === 'warning');
  };

  const getWithErrors = () => {
    return allIntegrations.filter(i => i.healthStatus === 'error');
  };

  // Delete handler that routes to correct hook
  const handleDelete = async (integration: UnifiedIntegration) => {
    if (integration.type === 'calendar') {
      await deleteBookingIntegration(integration.id);
    } else if (integration.type === 'telephony' || integration.type === 'messaging') {
      await deleteIntegration(integration.id);
    }
    // AI integrations handled separately through settings
  };

  // Toggle handler
  const handleToggle = async (integration: UnifiedIntegration, isActive: boolean) => {
    if (integration.type === 'calendar') {
      await updateBookingIntegration(integration.id, { is_enabled: isActive });
    } else if (integration.type === 'telephony' || integration.type === 'messaging') {
      await toggleActive({ integrationId: integration.id, isActive });
    }
  };

  return {
    integrations: allIntegrations,
    isLoading: isLoadingBase || isLoadingBooking || isLoadingAI,
    
    // Filtered lists
    telephonyIntegrations: getByType('telephony'),
    messagingIntegrations: getByType('messaging'),
    calendarIntegrations: getByType('calendar'),
    aiIntegrations: getByType('ai'),
    
    // Status filters
    activeIntegrations: getActive(),
    healthyIntegrations: getHealthy(),
    warningIntegrations: getWithWarnings(),
    errorIntegrations: getWithErrors(),
    
    // Actions
    handleDelete,
    handleToggle,
    
    // Pass through specific hooks for adding new integrations
    addIntegration,
    createBookingIntegration,
    
    // Original hooks for direct access if needed
    baseIntegrations,
    bookingIntegrations,
    aiSettings,
  };
};
