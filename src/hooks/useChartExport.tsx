import { useCallback } from 'react';
import { toast } from 'sonner';

export const useChartExport = () => {
  const exportToPNG = useCallback((chartRef: HTMLDivElement | null, filename: string) => {
    if (!chartRef) {
      toast.error('Kunde inte exportera grafen');
      return;
    }

    try {
      // Show manual instruction for PNG export
      toast.info('Högerklicka på grafen och välj "Spara bild som..."');
    } catch (error) {
      toast.error('Kunde inte exportera grafen');
    }
  }, []);

  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('Ingen data att exportera');
      return;
    }

    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.csv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exporterad som CSV');
    } catch (error) {
      toast.error('Kunde inte exportera data');
    }
  }, []);

  return { exportToPNG, exportToCSV };
};
