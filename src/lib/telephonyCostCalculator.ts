export const calculateCost = (
  provider: string,
  eventType: string,
  durationSeconds: number
): number => {
  // Default pricing per provider (in SEK)
  switch (provider.toLowerCase()) {
    case 'twilio':
      if (eventType.includes('call')) {
        return (durationSeconds / 60) * 0.085; // ~$0.0085/min converted to SEK
      }
      if (eventType.includes('sms')) {
        return 0.075; // ~$0.0075 per SMS
      }
      break;
      
    case 'telnyx':
      if (eventType.includes('call')) {
        // Swedish mobile outbound: ~$0.02/min, inbound to number: ~$0.006/min
        // Using average of $0.013/min ≈ 0.14 SEK/min
        return (durationSeconds / 60) * 0.14;
      }
      if (eventType.includes('sms')) {
        return 0.04; // ~$0.004 per SMS
      }
      break;
      
    case 'vapi':
      if (eventType.includes('call')) {
        // Vapi typically charges per minute
        return (durationSeconds / 60) * 0.50; // Estimated ~$0.05/min
      }
      break;
      
    case 'retell':
      if (eventType.includes('call')) {
        // Retell charges per minute
        return (durationSeconds / 60) * 0.50; // Estimated ~$0.05/min
      }
      break;
  }
  
  return 0;
};

export const estimateMonthlyCost = (
  totalCalls: number,
  totalSMS: number,
  avgCallDuration: number,
  provider: string
): number => {
  const callCost = calculateCost(provider, 'call', totalCalls * avgCallDuration);
  const smsCost = calculateCost(provider, 'sms', 0) * totalSMS;
  return callCost + smsCost;
};

export const getCostBreakdown = (events: any[]) => {
  const breakdown: Record<string, { calls: number; sms: number; totalCost: number }> = {};
  
  events.forEach(event => {
    if (!breakdown[event.provider]) {
      breakdown[event.provider] = { calls: 0, sms: 0, totalCost: 0 };
    }
    
    const cost = event.cost_amount || calculateCost(
      event.provider,
      event.event_type,
      event.duration_seconds || 0
    );
    
    breakdown[event.provider].totalCost += cost;
    
    if (event.event_type.includes('call')) {
      breakdown[event.provider].calls++;
    } else if (event.event_type.includes('sms')) {
      breakdown[event.provider].sms++;
    }
  });
  
  return breakdown;
};
