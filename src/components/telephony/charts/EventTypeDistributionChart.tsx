import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Phone, MessageSquare, FileText, Mic } from "lucide-react";

interface EventTypeDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

const COLORS = {
  calls: 'hsl(217, 91%, 60%)',
  sms: 'hsl(271, 70%, 60%)',
  transcripts: 'hsl(189, 94%, 43%)',
  recordings: 'hsl(330, 81%, 60%)'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  
  const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);
  
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
      <p className="font-semibold mb-2 text-sm">
        {format(new Date(label), 'dd MMMM yyyy', { locale: sv })}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full ring-2 ring-background" 
              style={{ backgroundColor: entry.fill }}
            />
            <span className="flex-1 text-muted-foreground capitalize">{entry.name}</span>
            <span className="font-semibold tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-2 pt-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Totalt:</span>
          <span className="tabular-nums">{total}</span>
        </div>
      </div>
    </div>
  );
};

export const EventTypeDistributionChart = ({ data, isLoading }: EventTypeDistributionChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[350px] animate-pulse" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Event-fördelning</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <PieChart className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  // Calculate totals
  const totals = data.reduce((acc, day) => ({
    calls: acc.calls + day.calls,
    sms: acc.sms + day.sms,
    transcripts: acc.transcripts + day.transcripts,
    recordings: acc.recordings + day.recordings
  }), { calls: 0, sms: 0, transcripts: 0, recordings: 0 });

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <PieChart className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold">Event-fördelning</h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
          <Phone className="h-4 w-4" style={{ color: COLORS.calls }} />
          <div>
            <p className="text-xs text-muted-foreground">Samtal</p>
            <p className="text-sm font-semibold">{totals.calls}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
          <MessageSquare className="h-4 w-4" style={{ color: COLORS.sms }} />
          <div>
            <p className="text-xs text-muted-foreground">SMS</p>
            <p className="text-sm font-semibold">{totals.sms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
          <FileText className="h-4 w-4" style={{ color: COLORS.transcripts }} />
          <div>
            <p className="text-xs text-muted-foreground">Transkrip.</p>
            <p className="text-sm font-semibold">{totals.transcripts}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
          <Mic className="h-4 w-4" style={{ color: COLORS.recordings }} />
          <div>
            <p className="text-xs text-muted-foreground">Inspeln.</p>
            <p className="text-sm font-semibold">{totals.recordings}</p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted" 
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: sv })}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
            iconType="rect"
            iconSize={10}
          />
          <Bar dataKey="calls" stackId="a" fill={COLORS.calls} name="Samtal" radius={[0, 0, 0, 0]} />
          <Bar dataKey="sms" stackId="a" fill={COLORS.sms} name="SMS" radius={[0, 0, 0, 0]} />
          <Bar dataKey="transcripts" stackId="a" fill={COLORS.transcripts} name="Transkript" radius={[0, 0, 0, 0]} />
          <Bar dataKey="recordings" stackId="a" fill={COLORS.recordings} name="Inspelningar" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
