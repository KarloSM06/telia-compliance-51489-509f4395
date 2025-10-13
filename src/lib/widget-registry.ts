import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity,
  Target,
  Table,
  List,
  Calendar,
  Filter,
  Search,
  TrendingDown,
  Gauge,
  Users
} from "lucide-react";
import { WidgetDefinition, WidgetType } from "@/types/widget.types";
import { StatCardWidget } from "@/components/widgets/data/StatCardWidget";
import { CounterWidget } from "@/components/widgets/data/CounterWidget";
import { ProgressWidget } from "@/components/widgets/data/ProgressWidget";
import { ComparisonWidget } from "@/components/widgets/data/ComparisonWidget";
import { LineChartWidget } from "@/components/widgets/charts/LineChartWidget";
import { BarChartWidget } from "@/components/widgets/charts/BarChartWidget";
import { PieChartWidget } from "@/components/widgets/charts/PieChartWidget";
import { AreaChartWidget } from "@/components/widgets/charts/AreaChartWidget";
import { DataTableWidget } from "@/components/widgets/tables/DataTableWidget";
import { ActivityFeedWidget } from "@/components/widgets/tables/ActivityFeedWidget";
import { ObjectiveCardWidget } from "@/components/widgets/data/ObjectiveCardWidget";

export const widgetRegistry: Record<WidgetType, WidgetDefinition> = {
  'stat-card': {
    type: 'stat-card',
    name: 'Statistikkort',
    description: 'Visa nyckeltal med trend och sparkline',
    icon: TrendingUp,
    category: 'data',
    defaultConfig: {
      title: 'Statistik',
      color: 'hsl(var(--primary))',
      showTrend: true,
    },
    defaultSize: { w: 3, h: 2 },
    component: StatCardWidget,
  },
  'counter': {
    type: 'counter',
    name: 'Räknare',
    description: 'Animerad räknare för stora siffror',
    icon: Gauge,
    category: 'data',
    defaultConfig: {
      title: 'Räknare',
      color: 'hsl(var(--primary))',
    },
    defaultSize: { w: 3, h: 2 },
    component: CounterWidget,
  },
  'progress': {
    type: 'progress',
    name: 'Framsteg',
    description: 'Progress bar med procent',
    icon: Activity,
    category: 'data',
    defaultConfig: {
      title: 'Framsteg',
      color: 'hsl(var(--success))',
      target: 100,
    },
    defaultSize: { w: 4, h: 2 },
    component: ProgressWidget,
  },
  'objective-card': {
    type: 'objective-card',
    name: 'Målkort',
    description: 'Måluppfyllelse med progress',
    icon: Target,
    category: 'data',
    defaultConfig: {
      title: 'Mål',
      color: 'hsl(var(--success))',
      target: 1000,
      unit: '',
    },
    defaultSize: { w: 4, h: 2 },
    component: ObjectiveCardWidget,
  },
  'comparison': {
    type: 'comparison',
    name: 'Jämförelse',
    description: 'Jämför två perioder',
    icon: TrendingDown,
    category: 'data',
    defaultConfig: {
      title: 'Jämförelse',
    },
    defaultSize: { w: 4, h: 2 },
    component: ComparisonWidget,
  },
  'line-chart': {
    type: 'line-chart',
    name: 'Linjediagram',
    description: 'Tidstrender över tid',
    icon: LineChart,
    category: 'chart',
    defaultConfig: {
      title: 'Trend',
      height: 300,
      dataKeys: [],
    },
    defaultSize: { w: 6, h: 4 },
    component: LineChartWidget,
  },
  'bar-chart': {
    type: 'bar-chart',
    name: 'Stapeldiagram',
    description: 'Jämför kategorier',
    icon: BarChart3,
    category: 'chart',
    defaultConfig: {
      title: 'Jämförelse',
      height: 300,
      dataKeys: [],
    },
    defaultSize: { w: 6, h: 4 },
    component: BarChartWidget,
  },
  'pie-chart': {
    type: 'pie-chart',
    name: 'Cirkeldiagram',
    description: 'Fördelning i procent',
    icon: PieChart,
    category: 'chart',
    defaultConfig: {
      title: 'Fördelning',
      height: 300,
      dataKeys: [],
    },
    defaultSize: { w: 4, h: 4 },
    component: PieChartWidget,
  },
  'area-chart': {
    type: 'area-chart',
    name: 'Ytdiagram',
    description: 'Ackumulerade värden',
    icon: Activity,
    category: 'chart',
    defaultConfig: {
      title: 'Utveckling',
      height: 300,
      dataKeys: [],
    },
    defaultSize: { w: 6, h: 4 },
    component: AreaChartWidget,
  },
  'data-table': {
    type: 'data-table',
    name: 'Datatabell',
    description: 'Sorterbar tabell med pagination',
    icon: Table,
    category: 'table',
    defaultConfig: {
      title: 'Tabell',
    },
    defaultSize: { w: 12, h: 5 },
    component: DataTableWidget,
  },
  'activity-feed': {
    type: 'activity-feed',
    name: 'Aktivitetsflöde',
    description: 'Realtids händelser',
    icon: List,
    category: 'table',
    defaultConfig: {
      title: 'Aktivitet',
    },
    defaultSize: { w: 4, h: 5 },
    component: ActivityFeedWidget,
  },
  'leaderboard': {
    type: 'leaderboard',
    name: 'Topplista',
    description: 'Ranking och statistik',
    icon: Users,
    category: 'table',
    defaultConfig: {
      title: 'Topplista',
    },
    defaultSize: { w: 4, h: 5 },
    component: ActivityFeedWidget, // TODO: Create dedicated LeaderboardWidget
  },
  'filter-panel': {
    type: 'filter-panel',
    name: 'Filterpanel',
    description: 'Global filtrering',
    icon: Filter,
    category: 'interactive',
    defaultConfig: {
      title: 'Filter',
    },
    defaultSize: { w: 3, h: 3 },
    component: StatCardWidget, // TODO: Create dedicated FilterPanelWidget
  },
  'date-range': {
    type: 'date-range',
    name: 'Datumväljare',
    description: 'Välj tidsintervall',
    icon: Calendar,
    category: 'interactive',
    defaultConfig: {
      title: 'Datumintervall',
    },
    defaultSize: { w: 4, h: 2 },
    component: StatCardWidget, // TODO: Create dedicated DateRangeWidget
  },
  'search': {
    type: 'search',
    name: 'Sökwidget',
    description: 'Sök över data',
    icon: Search,
    category: 'interactive',
    defaultConfig: {
      title: 'Sök',
    },
    defaultSize: { w: 4, h: 2 },
    component: StatCardWidget, // TODO: Create dedicated SearchWidget
  },
  'radar-chart': {
    type: 'radar-chart',
    name: 'Radardiagram',
    description: 'Multi-dimensional analys',
    icon: Activity,
    category: 'chart',
    defaultConfig: {
      title: 'Radar',
      height: 300,
    },
    defaultSize: { w: 6, h: 4 },
    component: StatCardWidget, // TODO: Create RadarChartWidget
  },
  'heatmap': {
    type: 'heatmap',
    name: 'Värmekarta',
    description: 'Aktivitet över tid',
    icon: Activity,
    category: 'chart',
    defaultConfig: {
      title: 'Värmekarta',
    },
    defaultSize: { w: 12, h: 3 },
    component: StatCardWidget, // TODO: Create HeatmapWidget
  },
};

export const getWidgetDefinition = (type: WidgetType): WidgetDefinition => {
  return widgetRegistry[type];
};

export const getWidgetsByCategory = (category: WidgetDefinition['category']) => {
  return Object.values(widgetRegistry).filter(w => w.category === category);
};

export const getAllWidgets = () => Object.values(widgetRegistry);
