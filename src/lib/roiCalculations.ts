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

export interface TrendMetrics {
  revenueChange: number;
  revenueChangeIsPositive: boolean;
  costChange: number;
  costChangeIsPositive: boolean;
  profitChange: number;
  profitChangeIsPositive: boolean;
  roiChange: number;
  roiChangeIsPositive: boolean;
  bookingsChange: number;
  bookingsChangeIsPositive: boolean;
}

export interface CumulativeROIMetrics {
  initialInvestment: number;
  monthsSinceStart: number;
  totalRevenueToDate: number;
  totalCostsToDate: number;
  cumulativeProfit: number;
  breakEvenDate: Date | null;
  isBreakEven: boolean;
  monthlyAverageRevenue: number;
  monthlyAverageCost: number;
  projectedBreakEvenMonths: number | null;
  dailyCumulativeData: Array<{
    date: string;
    cumulativeRevenue: number;
    cumulativeCost: number;
    cumulativeProfit: number;
    isBreakEven: boolean;
  }>;
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
  
  const totalOperatingCost = telephonyCost + smsCost + emailCost + hiemsSupportCost;
  
  return {
    telephonyCost,
    smsCost,
    emailCost,
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

// Calculate trends by comparing current vs previous period
export function calculateTrends(
  current: ROIMetrics & { bookingCount: number },
  previous: ROIMetrics & { bookingCount: number }
): TrendMetrics {
  const safePercentChange = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / Math.abs(prev)) * 100;
  };

  const revenueChange = safePercentChange(current.totalRevenue, previous.totalRevenue);
  const costChange = safePercentChange(current.totalCosts, previous.totalCosts);
  const profitChange = safePercentChange(current.netProfit, previous.netProfit);
  const roiChange = safePercentChange(current.roi, previous.roi);
  const bookingsChange = safePercentChange(current.bookingCount, previous.bookingCount);

  return {
    revenueChange: Math.abs(revenueChange),
    revenueChangeIsPositive: revenueChange >= 0,
    costChange: Math.abs(costChange),
    costChangeIsPositive: costChange <= 0, // Lower cost is positive
    profitChange: Math.abs(profitChange),
    profitChangeIsPositive: profitChange >= 0,
    roiChange: Math.abs(roiChange),
    roiChangeIsPositive: roiChange >= 0,
    bookingsChange: Math.abs(bookingsChange),
    bookingsChangeIsPositive: bookingsChange >= 0,
  };
}

// Calculate cumulative ROI from integration start date
export function calculateCumulativeROI(
  dailyData: Array<{ date: string; revenue: number; costs: number }>,
  integrationCost: number,
  integrationStartDate: Date
): CumulativeROIMetrics {
  const startDate = new Date(integrationStartDate);
  const today = new Date();
  
  // Calculate months since start
  const monthsSinceStart = Math.max(1, 
    (today.getFullYear() - startDate.getFullYear()) * 12 + 
    (today.getMonth() - startDate.getMonth())
  );

  // Build cumulative data starting from integration date
  let cumulativeRevenue = 0;
  let cumulativeCost = integrationCost; // Start with initial investment
  let breakEvenDate: Date | null = null;
  
  const dailyCumulativeData = dailyData.map(day => {
    cumulativeRevenue += day.revenue;
    cumulativeCost += day.costs;
    const cumulativeProfit = cumulativeRevenue - cumulativeCost;
    const isBreakEven = cumulativeProfit >= 0;
    
    // Mark break-even date
    if (isBreakEven && !breakEvenDate) {
      breakEvenDate = new Date(day.date);
    }
    
    return {
      date: day.date,
      cumulativeRevenue,
      cumulativeCost,
      cumulativeProfit,
      isBreakEven
    };
  });

  const totalRevenueToDate = cumulativeRevenue;
  const totalCostsToDate = cumulativeCost;
  const cumulativeProfit = totalRevenueToDate - totalCostsToDate;
  const isBreakEven = cumulativeProfit >= 0;
  
  const monthlyAverageRevenue = totalRevenueToDate / monthsSinceStart;
  const monthlyAverageCost = (totalCostsToDate - integrationCost) / monthsSinceStart;
  
  // Project break-even if not yet achieved
  let projectedBreakEvenMonths: number | null = null;
  if (!isBreakEven && monthlyAverageRevenue > monthlyAverageCost) {
    const monthlyProfit = monthlyAverageRevenue - monthlyAverageCost;
    const remainingDebt = Math.abs(cumulativeProfit);
    projectedBreakEvenMonths = Math.ceil(remainingDebt / monthlyProfit);
  }

  return {
    initialInvestment: integrationCost,
    monthsSinceStart,
    totalRevenueToDate,
    totalCostsToDate,
    cumulativeProfit,
    breakEvenDate,
    isBreakEven,
    monthlyAverageRevenue,
    monthlyAverageCost,
    projectedBreakEvenMonths,
    dailyCumulativeData
  };
}
