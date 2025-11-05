import { ReferenceLine, ReferenceArea, Label } from 'recharts';
import { Star, AlertTriangle } from 'lucide-react';

interface Annotation {
  type: 'line' | 'area';
  value?: number | string;
  label?: string;
  color?: string;
  start?: number | string;
  end?: number | string;
  icon?: 'star' | 'warning' | 'check';
}

interface ChartAnnotationsProps {
  annotations: Annotation[];
}

export const ChartAnnotations = ({ annotations }: ChartAnnotationsProps) => {
  return (
    <>
      {annotations.map((annotation, index) => {
        if (annotation.type === 'line') {
          return (
            <ReferenceLine
              key={index}
              y={annotation.value as number}
              stroke={annotation.color || 'hsl(var(--muted-foreground))'}
              strokeDasharray="5 5"
              strokeWidth={2}
            >
              {annotation.label && (
                <Label
                  value={annotation.label}
                  position="insideTopRight"
                  fill={annotation.color || 'hsl(var(--muted-foreground))'}
                  className="text-xs font-medium"
                />
              )}
            </ReferenceLine>
          );
        }

        if (annotation.type === 'area') {
          return (
            <ReferenceArea
              key={index}
              x1={annotation.start}
              x2={annotation.end}
              fill={annotation.color || 'hsl(var(--muted))'}
              fillOpacity={0.1}
              stroke={annotation.color || 'hsl(var(--muted-foreground))'}
              strokeDasharray="3 3"
            >
              {annotation.label && (
                <Label
                  value={annotation.label}
                  position="top"
                  fill={annotation.color || 'hsl(var(--muted-foreground))'}
                  className="text-xs font-medium"
                />
              )}
            </ReferenceArea>
          );
        }

        return null;
      })}
    </>
  );
};
