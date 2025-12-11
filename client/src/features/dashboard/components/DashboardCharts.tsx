import { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type {
  WeeklyData,
  SourceData,
  MonthlyData,
} from "../../dashboard/types";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export const WeeklyAnalysisChart = memo(
  ({ data }: { data: WeeklyData[] }) => (
    <Card className="col-span-4 border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Weekly Analysis</CardTitle>
        <CardDescription>Revenue by service type</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₱${val}`}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="prescription"
                stackId="a"
                fill="#0f172a"
                animationDuration={600}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="medCert"
                stackId="a"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#0f172a]" />
            <span>Prescription</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#64748b]" />
            <span>Medical Certification</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
  (prevProps, nextProps) => {
    // Only re-render if data actually changed
    if (prevProps.data.length !== nextProps.data.length) return false;
    return prevProps.data.every(
      (item, idx) =>
        item.name === nextProps.data[idx].name &&
        item.prescription === nextProps.data[idx].prescription &&
        item.medCert === nextProps.data[idx].medCert,
    );
  },
);

WeeklyAnalysisChart.displayName = "WeeklyAnalysisChart";

export const RevenueSourceChart = memo(
  ({ data, total }: { data: SourceData[]; total: number }) => {
    // Transform data to match Recharts expected format - memoize transformation
    const chartData = useMemo(
      () =>
        data.map((item) => ({
          name: item.name,
          value: item.value,
          color: item.color,
        })),
      [data],
    );

    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">₱{total.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-600">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if data or total changed
    if (prevProps.total !== nextProps.total) return false;
    if (prevProps.data.length !== nextProps.data.length) return false;
    return prevProps.data.every(
      (item, idx) =>
        item.name === nextProps.data[idx].name &&
        item.value === nextProps.data[idx].value &&
        item.color === nextProps.data[idx].color,
    );
  },
);

RevenueSourceChart.displayName = "RevenueSourceChart";

export const MonthlyGrowthChart = memo(
  ({ data }: { data: MonthlyData[] }) => {
    const current = data[data.length - 1]?.revenue || 0;
    const prev = data[data.length - 2]?.revenue || 0;
    const diff = current - prev;

    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>Revenue trend</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ₱{current.toLocaleString()}
            </div>
            <div
              className={`text-xs flex items-center justify-end ${diff >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
            >
              {diff >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              )}
              {diff > 0 ? "+" : ""}₱{Math.abs(diff).toLocaleString()}
              <span className="ml-1 text-slate-600">this month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₱${val / 1000}k`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f172a"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if data actually changed
    if (prevProps.data.length !== nextProps.data.length) return false;
    return prevProps.data.every(
      (item, idx) =>
        item.name === nextProps.data[idx].name &&
        item.revenue === nextProps.data[idx].revenue,
    );
  },
);

MonthlyGrowthChart.displayName = "MonthlyGrowthChart";
