import { BusinessMetrics, ServicePricing } from "@/hooks/useBusinessMetrics";
import { USD_TO_SEK } from './constants';
import { calculateAICost } from './aiCostCalculator';

export interface BookingRevenue {
  bookingId: string;
  estimatedRevenue: number;
  confidence: number;
  reasoning: string;
  matchedFields?: string[]; // Which fields contributed to the match
  matchDetails?: { field: string; value: string; score: number }[]; // Detailed breakdown
}

export interface OperationalCosts {
  telephonyCost: number;
  smsCost: number;
  emailCost: number;
  aiCost: number;
  hiemsSupportCost: number;
  integrationCost: number;
  totalOperatingCost: number;
  totalCost: number;
  isIntegrationCostIncluded: boolean;
}

export interface ROIMetrics {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roi: number;
  revenuePerBooking: number;
  costPerBooking: number;
  profitMargin: number;
}

export interface BreakEvenMetrics {
  breakEvenMonth: number; // Månad när break-even nås (0 = aldrig)
  breakEvenDate: Date | null; // Faktiskt datum
  monthlyRevenue: number; // Genomsnittlig månadsintäkt
  monthlyCost: number; // Genomsnittlig månadskostnad
  monthlyProfit: number; // monthlyRevenue - monthlyCost
  isBreakEvenReached: boolean;
}

export interface CumulativeMetrics {
  month: number;
  monthName: string;
  accumulatedCost: number;
  accumulatedRevenue: number;
  netProfit: number;
  roi: number;
}

export interface ProjectionMetrics {
  period: number; // 12, 24, 36 månader
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  roi: number;
  breakEvenMonth: number;
  cumulativeData: CumulativeMetrics[];
}

// Normalize string for flexible matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[\s-_]/g, '') // Remove spaces, hyphens, underscores
    .replace(/[^a-z0-9]/g, ''); // Remove all non-alphanumeric
}

// Service aliases for common variations and typos
const serviceAliases: Record<string, string[]> = {
  'kundmote': ['kunmote', 'kundbesok', 'klientmote', 'kundmöte', 'kunmöte'],
  'offertmote': ['offertmöte', 'offermöte', 'offermote', 'prisoffert', 'offert'],
  'installation': ['install', 'montage', 'uppsattning', 'montering'],
  'support': ['hjalp', 'felanmalan', 'service', 'tekniskstod'],
  'konsultation': ['konsult', 'radgivning', 'moterådgivning'],
  'uppfoljning': ['uppfoljningsmöte', 'followup', 'uppföljning']
};

// Enhanced multi-field matching with scoring
function matchServiceTypeEnhanced(
  booking: any,
  servicePricing: ServicePricing[]
): { service: ServicePricing; confidence: number; matchedFields: string[]; matchDetails: { field: string; value: string; score: number }[] } | null {
  if (servicePricing.length === 0) return null;

  let bestMatch: { service: ServicePricing; totalScore: number; matchedFields: string[]; matchDetails: { field: string; value: string; score: number }[] } | null = null;

  for (const service of servicePricing) {
    const normalizedServiceName = normalizeString(service.service_name);
    let totalScore = 0;
    const matchedFields: string[] = [];
    const matchDetails: { field: string; value: string; score: number }[] = [];

    // Helper to check if a field matches
    const checkFieldMatch = (fieldName: string, fieldValue: string | undefined, baseScore: number) => {
      if (!fieldValue) return;
      
      const normalizedValue = normalizeString(fieldValue);
      
      // Exact match
      if (normalizedValue === normalizedServiceName) {
        totalScore += baseScore;
        matchedFields.push(fieldName);
        matchDetails.push({ field: fieldName, value: fieldValue, score: baseScore });
        console.log(`✅ Exact ${fieldName} match: "${fieldValue}" → "${service.service_name}" (+${baseScore})`);
        return;
      }
      
      // Partial match (one contains the other)
      if (normalizedValue.includes(normalizedServiceName) || normalizedServiceName.includes(normalizedValue)) {
        const partialScore = Math.floor(baseScore * 0.8);
        totalScore += partialScore;
        matchedFields.push(fieldName);
        matchDetails.push({ field: fieldName, value: fieldValue, score: partialScore });
        console.log(`✅ Partial ${fieldName} match: "${fieldValue}" → "${service.service_name}" (+${partialScore})`);
        return;
      }
      
      // Check aliases
      const aliases = serviceAliases[normalizedServiceName] || [];
      for (const alias of aliases) {
        if (normalizedValue === alias || normalizedValue.includes(alias) || alias.includes(normalizedValue)) {
          const aliasScore = Math.floor(baseScore * 0.7);
          totalScore += aliasScore;
          matchedFields.push(fieldName);
          matchDetails.push({ field: fieldName, value: fieldValue, score: aliasScore });
          console.log(`✅ Alias ${fieldName} match: "${fieldValue}" → "${service.service_name}" via "${alias}" (+${aliasScore})`);
          return;
        }
      }
    };

    // Priority 1: service_type (50 points)
    checkFieldMatch('service_type', booking.service_type, 50);
    
    // Priority 2: title (40 points)
    checkFieldMatch('title', booking.title, 40);
    
    // Priority 3: event_type (25 points)
    checkFieldMatch('event_type', booking.event_type, 25);
    
    // Priority 4: description (20 points)
    checkFieldMatch('description', booking.description, 20);
    
    // Priority 5: notes (15 points)
    checkFieldMatch('notes', booking.notes, 15);
    
    // Priority 6: outcome (15 points)
    checkFieldMatch('outcome', booking.outcome, 15);
    
    // Priority 7: external_resource (parse if JSON)
    if (booking.external_resource) {
      try {
        const resource = typeof booking.external_resource === 'string' 
          ? JSON.parse(booking.external_resource) 
          : booking.external_resource;
        
        // Check common fields in external booking systems
        const externalFields = [
          resource.service_name,
          resource.service_type,
          resource.product_name,
          resource.category
        ].filter(Boolean);
        
        for (const extField of externalFields) {
          checkFieldMatch('external_resource', String(extField), 30);
        }
      } catch (e) {
        // Not JSON, treat as string
        checkFieldMatch('external_resource', String(booking.external_resource), 30);
      }
    }

    // Update best match if this service has better score
    if (totalScore > 0 && (!bestMatch || totalScore > bestMatch.totalScore)) {
      bestMatch = {
        service,
        totalScore,
        matchedFields,
        matchDetails
      };
    }
  }

  if (bestMatch) {
    // Cap confidence at 100%
    const confidence = Math.min(100, bestMatch.totalScore);
    console.log(`🎯 Best match: "${bestMatch.service.service_name}" with ${confidence}% confidence from ${bestMatch.matchedFields.join(', ')}`);
    
    return {
      service: bestMatch.service,
      confidence,
      matchedFields: bestMatch.matchedFields,
      matchDetails: bestMatch.matchDetails
    };
  }

  console.warn(`⚠️ No match found for booking:`, {
    title: booking.title,
    service_type: booking.service_type,
    event_type: booking.event_type,
    description: booking.description?.substring(0, 50)
  });
  
  return null;
}

// Calculate average from service pricing
function calculateAveragePrice(servicePricing: ServicePricing[]): number {
  if (servicePricing.length === 0) return 0;
  
  const total = servicePricing.reduce((sum, s) => sum + s.avg_price, 0);
  return total / servicePricing.length;
}

export interface ServiceMetrics {
  serviceName: string;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  bookingCount: number;
}

// Calculate estimated revenue for a booking
export function calculateBookingRevenue(
  booking: any,
  businessMetrics: BusinessMetrics
): BookingRevenue {
  const serviceMatch = matchServiceTypeEnhanced(booking, businessMetrics.service_pricing);
  
  let avgPrice: number;
  let confidence: number;
  let reasoning: string;
  let matchedFields: string[] | undefined;
  let matchDetails: { field: string; value: string; score: number }[] | undefined;
  
  if (serviceMatch) {
    avgPrice = serviceMatch.service.avg_price;
    confidence = serviceMatch.confidence;
    matchedFields = serviceMatch.matchedFields;
    matchDetails = serviceMatch.matchDetails;
    reasoning = `Baserat på specifik tjänst "${serviceMatch.service.service_name}" (${avgPrice.toLocaleString('sv-SE')} SEK)`;
  } else if (businessMetrics.avg_project_cost && businessMetrics.avg_project_cost > 0) {
    avgPrice = businessMetrics.avg_project_cost;
    confidence = 65;
    reasoning = `Baserat på genomsnittlig projektkostnad (${avgPrice.toLocaleString('sv-SE')} SEK)`;
  } else {
    avgPrice = calculateAveragePrice(businessMetrics.service_pricing);
    confidence = 50;
    reasoning = avgPrice > 0 
      ? `Baserat på genomsnitt av alla tjänster (${avgPrice.toLocaleString('sv-SE')} SEK)`
      : "Ingen prisdata tillgänglig";
  }
  
  const conversionProb = businessMetrics.meeting_to_payment_probability / 100;
  const estimatedRevenue = avgPrice * conversionProb;
  
  return {
    bookingId: booking.id,
    estimatedRevenue,
    confidence,
    reasoning: `${reasoning} × ${(conversionProb * 100).toFixed(0)}% konvertering`,
    matchedFields,
    matchDetails
  };
}

// Calculate operational costs
export function calculateOperationalCosts(
  telephonyEvents: any[],
  messageLogs: any[],
  aiUsageLogs: any[],
  businessMetrics: BusinessMetrics,
  dateRange: { from: Date; to: Date },
  openRouterCostSEK: number = 0
): OperationalCosts {
  // Calculate telephony costs - only VAPI events (aggregate cost)
  const telephonyCost = telephonyEvents
    .filter(e => e.provider === 'vapi')
    .reduce((sum, e) => {
      const costUSD = parseFloat(e.aggregate_cost_amount) || 0;
      return sum + (costUSD * USD_TO_SEK);
    }, 0);
  
  const smsCost = messageLogs
    .filter(m => m.channel === 'sms')
    .reduce((sum, m) => {
      // Try to use cost_sek from metadata first, otherwise convert USD to SEK
      const costSEK = m.metadata?.cost_sek || (parseFloat(m.cost) || 0) * USD_TO_SEK;
      return sum + costSEK;
    }, 0);
  
  const emailCost = messageLogs
    .filter(m => m.channel === 'email')
    .reduce((sum, m) => {
      // Try to use cost_sek from metadata first, otherwise convert USD to SEK
      const costSEK = m.metadata?.cost_sek || (parseFloat(m.cost) || 0) * USD_TO_SEK;
      return sum + costSEK;
    }, 0);
  
  // AI costs - exclude OpenRouter (we use actual API data), calculate others from tokens
  const otherAICost = aiUsageLogs
    .filter(log => log.provider !== 'openrouter')
    .reduce((sum, log) => {
      const costUSD = parseFloat(log.cost_usd) || calculateAICost({
        model: log.model,
        prompt_tokens: log.prompt_tokens || 0,
        completion_tokens: log.completion_tokens || 0,
      });
      return sum + (costUSD * USD_TO_SEK);
    }, 0);
  
  // Total AI cost = other providers + actual OpenRouter cost from API
  const aiCost = otherAICost + openRouterCostSEK;
  
  // Calculate prorated fixed costs based on date range
  const daysInRange = Math.max(1, Math.ceil(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  // Round to full month if within typical month range (28-32 days)
  const monthlyProration = (daysInRange >= 28 && daysInRange <= 32) ? 1 : daysInRange / 30;
  
  const hiemsSupportCost = (businessMetrics.hiems_monthly_support_cost || 0) * monthlyProration;
  
  // Integration cost is a one-time startup cost
  let integrationCost = 0;
  let isIntegrationCostIncluded = false;
  
  if (businessMetrics.integration_cost && businessMetrics.integration_start_date) {
    const integrationDate = new Date(businessMetrics.integration_start_date);
    // Include one-time cost only if the date range includes the integration start date
    if (integrationDate >= dateRange.from && integrationDate <= dateRange.to) {
      integrationCost = businessMetrics.integration_cost;
      isIntegrationCostIncluded = true;
    }
  }
  
  const totalOperatingCost = telephonyCost + smsCost + emailCost + aiCost + hiemsSupportCost;
  
  return {
    telephonyCost,
    smsCost,
    emailCost,
    aiCost,
    hiemsSupportCost,
    integrationCost,
    totalOperatingCost,
    totalCost: totalOperatingCost + integrationCost,
    isIntegrationCostIncluded
  };
}

// Calculate ROI metrics
export function calculateROI(
  bookingRevenues: BookingRevenue[],
  operationalCosts: OperationalCosts
): ROIMetrics {
  const totalRevenue = bookingRevenues.reduce((sum, b) => sum + b.estimatedRevenue, 0);
  const totalCosts = operationalCosts.totalCost;
  const netProfit = totalRevenue - totalCosts;
  const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
  const bookingCount = bookingRevenues.length || 1;
  
  return {
    totalRevenue,
    totalCosts,
    netProfit,
    roi,
    revenuePerBooking: totalRevenue / bookingCount,
    costPerBooking: totalCosts / bookingCount,
    profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  };
}

// Calculate break-even point
export function calculateBreakEven(
  businessMetrics: BusinessMetrics,
  historicalRevenue: number,
  historicalDays: number
): BreakEvenMetrics {
  // Calculate average monthly revenue from historical data
  const avgDailyRevenue = historicalDays > 0 ? historicalRevenue / historicalDays : 0;
  const monthlyRevenue = avgDailyRevenue * 30;
  
  // Monthly cost = Hiems support cost
  const monthlyCost = businessMetrics.hiems_monthly_support_cost || 0;
  
  // Monthly profit
  const monthlyProfit = monthlyRevenue - monthlyCost;
  
  // Calculate break-even month
  const integrationCost = businessMetrics.integration_cost || 0;
  
  let breakEvenMonth = 0;
  let isBreakEvenReached = false;
  let breakEvenDate: Date | null = null;
  
  if (monthlyProfit > 0) {
    breakEvenMonth = Math.ceil(integrationCost / monthlyProfit);
    isBreakEvenReached = true;
    
    // Calculate approximate date
    if (businessMetrics.integration_start_date) {
      const startDate = new Date(businessMetrics.integration_start_date);
      breakEvenDate = new Date(startDate);
      breakEvenDate.setMonth(breakEvenDate.getMonth() + breakEvenMonth);
    }
  }
  
  return {
    breakEvenMonth,
    breakEvenDate,
    monthlyRevenue,
    monthlyCost,
    monthlyProfit,
    isBreakEvenReached
  };
}

// Calculate cumulative metrics month by month
export function calculateCumulativeMetrics(
  months: number,
  monthlyRevenue: number,
  monthlyCost: number,
  integrationCost: number
): CumulativeMetrics[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const data: CumulativeMetrics[] = [];
  
  for (let month = 1; month <= months; month++) {
    const accumulatedRevenue = monthlyRevenue * month;
    const accumulatedCost = integrationCost + (monthlyCost * month);
    const netProfit = accumulatedRevenue - accumulatedCost;
    const roi = accumulatedCost > 0 ? (netProfit / accumulatedCost) * 100 : 0;
    
    data.push({
      month,
      monthName: `Mån ${month}`,
      accumulatedCost,
      accumulatedRevenue,
      netProfit,
      roi
    });
  }
  
  return data;
}

// Project ROI forward for N months
export function projectROI(
  period: number,
  businessMetrics: BusinessMetrics,
  historicalRevenue: number,
  historicalDays: number
): ProjectionMetrics {
  const breakEven = calculateBreakEven(businessMetrics, historicalRevenue, historicalDays);
  const integrationCost = businessMetrics.integration_cost || 0;
  
  const cumulativeData = calculateCumulativeMetrics(
    period,
    breakEven.monthlyRevenue,
    breakEven.monthlyCost,
    integrationCost
  );
  
  const lastMonth = cumulativeData[cumulativeData.length - 1];
  
  return {
    period,
    totalRevenue: lastMonth.accumulatedRevenue,
    totalCost: lastMonth.accumulatedCost,
    netProfit: lastMonth.netProfit,
    roi: lastMonth.roi,
    breakEvenMonth: breakEven.breakEvenMonth,
    cumulativeData
  };
}

// Calculate service-specific ROI
export function calculateServiceROI(
  bookings: any[],
  costs: OperationalCosts,
  businessMetrics: BusinessMetrics
): ServiceMetrics[] {
  const serviceMap = new Map<string, ServiceMetrics>();

  bookings.forEach(booking => {
    const serviceType = booking.service_type || 'Okänd tjänst';
    const revenue = calculateBookingRevenue(booking, businessMetrics);
    
    if (!serviceMap.has(serviceType)) {
      serviceMap.set(serviceType, {
        serviceName: serviceType,
        revenue: 0,
        cost: 0,
        profit: 0,
        roi: 0,
        bookingCount: 0
      });
    }

    const service = serviceMap.get(serviceType)!;
    service.revenue += revenue.estimatedRevenue;
    service.bookingCount += 1;
  });

  // Distribute costs proportionally across services
  const totalRevenue = Array.from(serviceMap.values()).reduce((sum, s) => sum + s.revenue, 0);
  
  serviceMap.forEach(service => {
    if (totalRevenue > 0) {
      const costRatio = service.revenue / totalRevenue;
      service.cost = costs.totalCost * costRatio;
      service.profit = service.revenue - service.cost;
      service.roi = service.cost > 0 ? ((service.profit / service.cost) * 100) : 0;
    }
  });

  return Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue);
}
