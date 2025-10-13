import { create } from 'zustand';
import { Dashboard, DashboardPage } from '@/types/dashboard.types';
import { DashboardWidget } from '@/types/widget.types';
import { Layout } from 'react-grid-layout';

interface DashboardState {
  currentDashboard: Dashboard | null;
  currentPage: string;
  widgets: DashboardWidget[];
  isEditing: boolean;
  selectedWidget: string | null;
  
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  setCurrentPage: (pageId: string) => void;
  setWidgets: (widgets: DashboardWidget[]) => void;
  addWidget: (widget: DashboardWidget) => void;
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (id: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setSelectedWidget: (id: string | null) => void;
  updateLayout: (layouts: Layout[]) => void;
}

export const useDashboardState = create<DashboardState>((set, get) => ({
  currentDashboard: null,
  currentPage: 'page-1',
  widgets: [],
  isEditing: false,
  selectedWidget: null,
  
  setCurrentDashboard: (dashboard) => set({ currentDashboard: dashboard }),
  
  setCurrentPage: (pageId) => set({ currentPage: pageId }),
  
  setWidgets: (widgets) => set({ widgets }),
  
  addWidget: (widget) => set((state) => ({ 
    widgets: [...state.widgets, widget] 
  })),
  
  updateWidget: (id, updates) => set((state) => ({
    widgets: state.widgets.map(w => 
      w.id === id ? { ...w, ...updates } : w
    )
  })),
  
  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter(w => w.id !== id)
  })),
  
  setIsEditing: (isEditing) => set({ isEditing }),
  
  setSelectedWidget: (id) => set({ selectedWidget: id }),
  
  updateLayout: (layouts) => set((state) => {
    const updatedWidgets = state.widgets.map(widget => {
      const layout = layouts.find(l => l.i === widget.id);
      if (layout) {
        return {
          ...widget,
          position: { x: layout.x, y: layout.y, w: layout.w, h: layout.h }
        };
      }
      return widget;
    });
    return { widgets: updatedWidgets };
  }),
}));
