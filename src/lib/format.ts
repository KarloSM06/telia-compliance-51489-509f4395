export const formatDollar = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
};

export const formatDollarCompact = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '$0.00';
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  if (amount < 1) return `$${amount.toFixed(2)}`;
  return `$${amount.toFixed(2)}`;
};

export const getDailyUsageColor = (daily: number): string => {
  if (daily < 0.10) return 'text-green-600 dark:text-green-400';
  if (daily < 1.00) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const formatSEK = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0,00 SEK';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatSEKCompact = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0 kr';
  if (amount < 1) return `${amount.toFixed(2)} kr`;
  return `${amount.toFixed(0)} kr`;
};
