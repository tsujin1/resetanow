import { LayoutDashboard, Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/components/features/dashboard/useDashboardData";
import { DashboardMetricsCards } from "@/components/features/dashboard/DashboardMetrics";
import {
  WeeklyAnalysisChart,
  RevenueSourceChart,
  MonthlyGrowthChart,
} from "@/components/features/dashboard/DashboardCharts";

export default function Dashboard() {
  const {
    isLoading,
    isExporting,
    metrics,
    weeklyData,
    revenueSource,
    monthlyChartData,
    exportCSV,
  } = useDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Overview of your clinic's performance
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button
            onClick={exportCSV}
            disabled={isLoading || isExporting}
            className="relative"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* METRICS */}
      <DashboardMetricsCards metrics={metrics} isLoading={isLoading} />

      {/* CHARTS ROW 1 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <WeeklyAnalysisChart data={weeklyData} />
        <RevenueSourceChart
          data={revenueSource}
          total={metrics.revenue.total}
        />
      </div>

      {/* CHARTS ROW 2 */}
      <MonthlyGrowthChart data={monthlyChartData} />
    </div>
  );
}
