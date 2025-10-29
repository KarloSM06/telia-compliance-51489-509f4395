export const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

export const formatCallDuration = (seconds: number | null): string => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const formatPhoneNumber = (number: string | null): string => {
  if (!number) return '-';
  // +46701234567 → +46 70 123 45 67
  if (number.startsWith('+46')) {
    return number.replace(/(\+46)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return number;
};

const USD_TO_SEK = 10.5;

export const formatCost = (amount: number | null, currency: string = 'SEK'): string => {
  if (amount === null || amount === undefined) return '-';
  return `${amount.toFixed(2)} ${currency}`;
};

export const formatAggregateCost = (
  aggregateCostAmount: number | null, 
  costAmount: number | null, 
  currency: string = 'USD'
): string => {
  if (aggregateCostAmount === null && costAmount === null) return '-';
  
  const usdAmount = aggregateCostAmount || costAmount || 0;
  const sekAmount = usdAmount * USD_TO_SEK;
  
  return `$${usdAmount.toFixed(4)} USD (≈ ${sekAmount.toFixed(2)} SEK)`;
};

export const formatCostInSEK = (
  usdAmount: number | null
): string => {
  if (usdAmount === null || usdAmount === undefined) return '-';
  const sekAmount = usdAmount * USD_TO_SEK;
  return `${sekAmount.toFixed(2)} SEK`;
};

export const formatFullTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just nu';
  if (diffMins < 60) return `${diffMins}m sedan`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h sedan`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d sedan`;
};

export const getEventTypeLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    'call.start': 'Samtal startat',
    'call.end': 'Samtal avslutat',
    'call.completed': 'Samtal klart',
    'sms.sent': 'SMS skickat',
    'sms.delivered': 'SMS levererat',
    'sms.failed': 'SMS misslyckades',
    'transcript.ready': 'Transkription klar',
    'recording.ready': 'Inspelning klar',
    'call.analyzed': 'Samtal analyserat',
    'call.unknown': 'Okänd händelse',
  };
  return labels[eventType] || eventType;
};

export const getProviderLogo = (provider: string): string => {
  const logos: Record<string, string> = {
    'twilio': '/images/logos/twilio.png',
    'telnyx': '/images/logos/telnyx.png',
    'vapi': '/images/logos/vapi.png',
    'retell': '/images/logos/retell.png',
  };
  return logos[provider] || '/images/logos/phone.png';
};

export const getProviderDisplayName = (provider: string): string => {
  const names: Record<string, string> = {
    'twilio': 'Twilio',
    'telnyx': 'Telnyx',
    'vapi': 'Vapi',
    'retell': 'Retell',
  };
  return names[provider] || provider;
};

export const getDirectionBadgeVariant = (direction: string): 'default' | 'secondary' | 'outline' => {
  return direction === 'inbound' ? 'default' : 'secondary';
};

export const getDirectionLabel = (direction: string | null): string => {
  if (direction === 'inbound') return '📥 Inkommande';
  if (direction === 'outbound') return '📤 Utgående';
  return '-';
};

export const getStatusVariant = (status: string | null): 'default' | 'destructive' | 'secondary' => {
  if (!status) return 'secondary';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('complet') || lowerStatus.includes('deliver') || lowerStatus.includes('answer')) {
    return 'default';
  }
  if (lowerStatus.includes('fail') || lowerStatus.includes('error') || lowerStatus.includes('busy')) {
    return 'destructive';
  }
  return 'secondary';
};

export const getStatusLabel = (status: string | null): string => {
  if (!status) return 'Okänd';
  const lowerStatus = status.toLowerCase();
  
  if (lowerStatus.includes('complet')) return 'Klar';
  if (lowerStatus.includes('answer')) return 'Besvarad';
  if (lowerStatus.includes('deliver')) return 'Levererad';
  if (lowerStatus.includes('fail')) return 'Misslyckades';
  if (lowerStatus.includes('busy')) return 'Upptagen';
  if (lowerStatus.includes('no-answer')) return 'Inget svar';
  if (lowerStatus.includes('ringing')) return 'Ringer';
  if (lowerStatus.includes('progress')) return 'Pågår';
  
  return status;
};
