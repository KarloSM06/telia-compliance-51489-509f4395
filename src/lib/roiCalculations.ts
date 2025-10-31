import { BusinessMetrics, ServicePricing } from "@/hooks/useBusinessMetrics";

const USD_TO_SEK = 10.5;

export interface BookingRevenue {
  bookingId: string;
  estimatedRevenue: number;
  confidence: number;
  reasoning: string;
}

export interface OperationalCosts {
  telephonyCost: number;
  smsCost: number;
  emailCost: number;
  hiemsSupportCost: number;
  integrationCost: number;
  totalCost: number;
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

// Match booking title to service pricing
function matchServiceType(
  booking: any,
  servicePricing: ServicePricing[]
): ServicePricing | null {
  if (!booking.title || servicePricing.length === 0) return null;

  const title = booking.title.toLowerCase();
  
  for (const service of servicePricing) {
    if (title.includes(service.service_name.toLowerCase())) {
      return service;
    }
  }
  
  return null;
}

// Calculate average from service pricing
function calculateAveragePrice(servicePricing: ServicePricing[]): number {
  if (servicePricing.length === 0) return 0;
  
  const total = servicePricing.reduce((sum, s) => sum + s.avg_price, 0);
  return total / servicePricing.length;
}

// Calculate estimated revenue for a booking
export function calculateBookingRevenue(
  booking: any,
  businessMetrics: BusinessMetrics
): BookingRevenue {
  const serviceMatch = matchServiceType(booking, businessMetrics.service_pricing);
  
  let avgPrice: number;
  let confidence: number;
  let reasoning: string;
  
  if (serviceMatch) {
    avgPrice = serviceMatch.avg_price;
    confidence = 85;
    reasoning = `Baserat på specifik tjänst "${serviceMatch.service_name}" (${avgPrice.toLocaleString('sv-SE')} SEK)`;
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
    reasoning: `${reasoning} × ${(conversionProb * 100).toFixed(0)}% konvertering`
  };
}

// Calculate operational costs
export function calculateOperationalCosts(
  telephonyEvents: any[],
  messageLogs: any[],
  businessMetrics: BusinessMetrics,
  dateRange: { from: Date; to: Date }
): OperationalCosts {
  // Use aggregate_cost_amount (already in SEK) if available, otherwise convert cost_amount from USD to SEK
  const telephonyCost = telephonyEvents.reduce((sum, e) => {
    const costSEK = e.aggregate_cost_amount || (parseFloat(e.cost_amount) || 0) * USD_TO_SEK;
    return sum + costSEK;
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
  
  // Calculate prorated fixed costs based on date range
  const daysInRange = Math.max(1, Math.ceil(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  // Round to full month if within typical month range (28-32 days)
  const monthlyProration = (daysInRange >= 28 && daysInRange <= 32) ? 1 : daysInRange / 30;
  
  const hiemsSupportCost = (businessMetrics.hiems_monthly_support_cost || 0) * monthlyProration;
  const integrationCost = (businessMetrics.integration_monthly_cost || 0) * monthlyProration;
  
  return {
    telephonyCost,
    smsCost,
    emailCost,
    hiemsSupportCost,
    integrationCost,
    totalCost: telephonyCost + smsCost + emailCost + hiemsSupportCost + integrationCost
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
