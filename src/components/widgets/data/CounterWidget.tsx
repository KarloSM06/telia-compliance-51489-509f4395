import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { useEffect, useState } from "react";

export const CounterWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  const targetValue = data?.[0]?.value || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    
    const duration = 1000;
    const steps = 60;
    const increment = (targetValue - displayValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(prev => prev + increment);
        currentStep++;
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, isLoading]);

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: config.color }}>
            {Math.round(displayValue).toLocaleString()}
          </div>
          {config.unit && (
            <div className="text-sm text-muted-foreground mt-2">{config.unit}</div>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};
