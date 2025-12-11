import { memo } from "react";
import { Users, FileText, FileBadge, Wallet, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetrics as IMetrics } from "../../dashboard/types";

interface Props {
  metrics: IMetrics;
  isLoading: boolean;
}

const formatK = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toLocaleString();

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const DashboardMetricsCards = memo(({ metrics, isLoading }: Props) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{metrics.patients.total}</div>
              <p className="text-xs text-muted-foreground flex items-center pt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-emerald-600 font-medium">
                  +{metrics.patients.growth}%
                </span>
                <span className="ml-1">new this month</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Prescriptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {metrics.prescriptions.monthly}
              </div>
              <p className="text-xs text-muted-foreground">Issued this month</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Med Certs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Medical Certifications
          </CardTitle>
          <FileBadge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {metrics.medCerts.monthly}
              </div>
              <p className="text-xs text-muted-foreground">Issued this month</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            Total Revenue
          </CardTitle>
          <Wallet className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-20 mb-2 bg-slate-700" />
              <Skeleton className="h-4 w-full bg-slate-700" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                ₱{metrics.revenue.monthly.toLocaleString()}
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-slate-400">This Month</p>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  All Time: ₱{formatK(metrics.revenue.total)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

DashboardMetricsCards.displayName = "DashboardMetricsCards";
