import { LucideIcon } from "lucide-react";
import { Layout } from "react-grid-layout";

export interface DashboardPage {
  id: string;
  name: string;
  layout: Layout[];
}

export interface Dashboard {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  layout: Layout[];
  pages: DashboardPage[];
  theme: DashboardTheme;
  is_public: boolean;
  is_template: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardTheme {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  mode?: 'light' | 'dark';
}

export interface DashboardShare {
  id: string;
  dashboard_id: string;
  shared_with_user_id?: string;
  permission_level: 'view' | 'edit' | 'admin';
  share_token?: string;
  expires_at?: string;
  created_at: string;
}

export type PermissionLevel = 'view' | 'edit' | 'admin';
