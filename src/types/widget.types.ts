import { LucideIcon } from "lucide-react";

export type WidgetType = 
  | 'stat-card'
  | 'counter'
  | 'progress'
  | 'comparison'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'area-chart'
  | 'radar-chart'
  | 'heatmap'
  | 'data-table'
  | 'activity-feed'
  | 'leaderboard'
  | 'filter-panel'
  | 'date-range'
  | 'search'
  | 'objective-card';

export type DataSource = 
  | 'calls'
  | 'bookings'
  | 'messages'
  | 'subscriptions'
  | 'custom-query'
  | 'api-endpoint';

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max';

export interface WidgetDataSource {
  type: DataSource;
  table?: string;
  query?: string;
  apiEndpoint?: string;
  filters?: Record<string, any>;
  aggregation?: AggregationType;
  groupBy?: string;
  refreshInterval?: number; // in seconds
}

export interface WidgetConfig {
  title?: string;
  subtitle?: string;
  color?: string;
  icon?: string;
  showTrend?: boolean;
  chartType?: 'line' | 'bar' | 'area' | 'pie';
  dataKeys?: Array<{ key: string; color: string; name: string }>;
  xAxisKey?: string;
  height?: number;
  target?: number; // for objective cards
  unit?: string;
  [key: string]: any;
}

export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  page_id: string;
  widget_type: WidgetType;
  config: WidgetConfig;
  data_source: WidgetDataSource;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  created_at: string;
}

export interface WidgetTemplate {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  widget_type: WidgetType;
  config_template: WidgetConfig;
  preview_image?: string;
  category?: string;
  downloads: number;
  rating?: number;
  is_public: boolean;
  created_at: string;
}

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'data' | 'chart' | 'table' | 'interactive';
  defaultConfig: WidgetConfig;
  defaultSize: { w: number; h: number };
  component: React.ComponentType<WidgetProps>;
}

export interface WidgetProps {
  id: string;
  config: WidgetConfig;
  dataSource: WidgetDataSource;
  data?: any;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
}
