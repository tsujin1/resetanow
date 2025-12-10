import {
  Users,
  FileText,
  FileBadge,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- 1. CENTRALIZED DATA ---
// We move hardcoded numbers here so the Export function can read them too.

const summaryMetrics = {
  patients: { total: 1234, growth: 12 },
  prescriptions: { total: 12450, monthly: 542 },
  medCerts: { total: 3820, monthly: 128 },
  revenue: { total: 5200000, monthly: 120000 },
};

const weeklyData = [
  { name: "Mon", prescription: 4000, medCert: 500 },
  { name: "Tue", prescription: 2500, medCert: 700 },
  { name: "Wed", prescription: 5000, medCert: 1000 },
  { name: "Thu", prescription: 4000, medCert: 800 },
  { name: "Fri", prescription: 6000, medCert: 1500 },
  { name: "Sat", prescription: 7500, medCert: 1500 },
  { name: "Sun", prescription: 1500, medCert: 500 },
];

const sourceData = [
  { name: "Prescriptions", value: 85500, color: "#0f172a" }, // Slate-900
  { name: "Med Certs", value: 34500, color: "#64748b" }, // Slate-500
];

const monthlyData = [
  { name: "Jan", revenue: 45000 },
  { name: "Feb", revenue: 52000 },
  { name: "Mar", revenue: 48000 },
  { name: "Apr", revenue: 61000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 67000 },
  { name: "Jul", revenue: 72000 },
];

export default function Dashboard() {
  // UI Calculations
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const monthDiff = currentMonth.revenue - previousMonth.revenue;
  const monthGrowthStyles = monthDiff > 0 ? "text-emerald-600" : "text-red-600";

  // --- 2. UPDATED EXPORT FUNCTION ---
  // This constructs a CSV with multiple sections: Summary, Weekly, and Monthly
  const handleExportCSV = () => {
    const csvRows = [];

    // SECTION A: SUMMARY METRICS
    csvRows.push("--- EXECUTIVE SUMMARY ---");
    csvRows.push("Category,Total (All Time),Current Month Performance");
    csvRows.push(
      `Total Patients,${summaryMetrics.patients.total},+${summaryMetrics.patients.growth}% New`,
    );
    csvRows.push(
      `Prescriptions,${summaryMetrics.prescriptions.total},${summaryMetrics.prescriptions.monthly} Issued`,
    );
    csvRows.push(
      `Medical Certificates,${summaryMetrics.medCerts.total},${summaryMetrics.medCerts.monthly} Issued`,
    );
    csvRows.push(
      `Total Revenue,${summaryMetrics.revenue.total},${summaryMetrics.revenue.monthly} Earned`,
    );
    csvRows.push(""); // Blank line for spacing

    // SECTION B: WEEKLY BREAKDOWN
    csvRows.push("--- WEEKLY REVENUE BREAKDOWN ---");
    csvRows.push("Day,Prescription Revenue,Med Cert Revenue,Total Daily");
    weeklyData.forEach((day) => {
      const totalDaily = day.prescription + day.medCert;
      csvRows.push(
        `${day.name},${day.prescription},${day.medCert},${totalDaily}`,
      );
    });
    csvRows.push("");

    // SECTION C: MONTHLY HISTORY
    csvRows.push("--- MONTHLY REVENUE HISTORY ---");
    csvRows.push("Month,Revenue");
    monthlyData.forEach((month) => {
      csvRows.push(`${month.name},${month.revenue}`);
    });

    // Generate File
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Full_Clinic_Report_${new Date().toISOString().split("T")[0]}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
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
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button onClick={handleExportCSV} className="flex-1 sm:flex-none">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KEY METRICS CARDS (Now using summaryMetrics variable) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL PATIENTS */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {summaryMetrics.patients.total.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-600 mr-1" />
              <span className="text-emerald-600 font-medium">
                +{summaryMetrics.patients.growth}%
              </span>
              <span className="ml-1">new this month</span>
            </p>
          </CardContent>
        </Card>

        {/* PRESCRIPTIONS */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Prescriptions
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {summaryMetrics.prescriptions.monthly}
                </div>
                <p className="text-xs text-slate-500 mt-1">Issued this month</p>
              </div>
              <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-semibold border border-slate-200">
                Total: {(summaryMetrics.prescriptions.total / 1000).toFixed(1)}k
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MED CERTS */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Med Certs
            </CardTitle>
            <FileBadge className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {summaryMetrics.medCerts.monthly}
                </div>
                <p className="text-xs text-slate-500 mt-1">Issued this month</p>
              </div>
              <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-semibold border border-slate-200">
                Total: {(summaryMetrics.medCerts.total / 1000).toFixed(1)}k
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REVENUE */}
        <Card className="border-slate-200 bg-slate-900 text-slate-50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-800/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-200">
              Total Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-white">
                  ₱{summaryMetrics.revenue.monthly.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">Earned this month</p>
              </div>
              <div className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-semibold border border-slate-700">
                All Time: ₱{(summaryMetrics.revenue.total / 1000000).toFixed(1)}
                M
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Revenue (Bar Chart) */}
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-900">
              Weekly Analysis
            </CardTitle>
            <CardDescription className="text-sm">
              Revenue breakdown by service type
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₱${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      `₱${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                  <Bar
                    dataKey="prescription"
                    name="Prescriptions"
                    stackId="a"
                    fill="#0f172a"
                  />
                  <Bar
                    dataKey="medCert"
                    name="Med Certs"
                    stackId="a"
                    fill="#64748b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-xs text-slate-600 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-900"></div>{" "}
                Prescriptions
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-500"></div> Med Certs
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Sources (Pie Chart) */}
        <Card className="col-span-4 lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-semibold text-slate-900">
              Revenue Sources
            </CardTitle>
            <CardDescription className="text-sm">
              Distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `₱${value.toLocaleString()}`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Total
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ₱{(summaryMetrics.revenue.monthly / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-6 text-sm text-slate-700 -mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-900"></div> Rx
                (71%)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div> Certs
                (29%)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. MONTHLY COMPARISON (Area Chart) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Monthly Growth
              </CardTitle>
              <CardDescription className="text-sm">
                Revenue trend over the last 7 months
              </CardDescription>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-bold text-slate-900">
                ₱{currentMonth.revenue.toLocaleString()}
              </p>
              <p
                className={`text-xs font-medium flex items-center justify-end ${monthGrowthStyles}`}
              >
                {monthDiff > 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                )}
                {monthDiff > 0 ? "+" : ""}₱
                {Math.abs(monthDiff).toLocaleString()} vs last month
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pl-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₱${value / 1000}k`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `₱${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
