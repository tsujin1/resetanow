import { lazy, Suspense } from "react";
import { LayoutDashboard, Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { DashboardMetricsCards } from "@/features/dashboard/components/DashboardMetrics";

// Lazy load chart components to reduce initial bundle size
const WeeklyAnalysisChart = lazy(() =>
  import("@/features/dashboard/components/DashboardCharts").then((module) => ({
    default: module.WeeklyAnalysisChart,
  })),
);
const RevenueSourceChart = lazy(() =>
  import("@/features/dashboard/components/DashboardCharts").then((module) => ({
    default: module.RevenueSourceChart,
  })),
);
const MonthlyGrowthChart = lazy(() =>
  import("@/features/dashboard/components/DashboardCharts").then((module) => ({
    default: module.MonthlyGrowthChart,
  })),
);

// Chart loading skeleton
const ChartSkeleton = () => (
  <div className="h-[300px] w-full bg-slate-50 rounded-lg animate-pulse flex items-center justify-center">
    <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
  </div>
);

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

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button
            onClick={exportCSV}
            disabled={isLoading || isExporting}
            className="relative w-full sm:w-auto"
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
        <Suspense fallback={<ChartSkeleton />}>
          <WeeklyAnalysisChart data={weeklyData} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueSourceChart
            data={revenueSource}
            total={metrics.revenue.total}
          />
        </Suspense>
      </div>

      {/* CHARTS ROW 2 */}
      <Suspense fallback={<ChartSkeleton />}>
        <MonthlyGrowthChart data={monthlyChartData} />
      </Suspense>
    </div>
  );
}
