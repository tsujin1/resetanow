export interface WeeklyData {
  name: string;
  prescription: number;
  medCert: number;
}

export interface SourceData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  name: string;
  revenue: number;
}

export interface DashboardMetrics {
  patients: { total: number; growth: number };
  prescriptions: { total: number; monthly: number };
  medCerts: { total: number; monthly: number };
  revenue: { total: number; monthly: number };
}
