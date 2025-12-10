import { useState, useEffect } from "react";
import { toast } from "sonner";
import patientService from "@/services/patientService";
import prescriptionService from "@/services/prescriptionService";
import medCertService from "@/services/medCertService";
import type {
  DashboardMetrics,
  WeeklyData,
  SourceData,
  MonthlyData,
} from "./types";
const initialWeeklyData: WeeklyData[] = [
  { name: "Mon", prescription: 0, medCert: 0 },
  { name: "Tue", prescription: 0, medCert: 0 },
  { name: "Wed", prescription: 0, medCert: 0 },
  { name: "Thu", prescription: 0, medCert: 0 },
  { name: "Fri", prescription: 0, medCert: 0 },
  { name: "Sat", prescription: 0, medCert: 0 },
  { name: "Sun", prescription: 0, medCert: 0 },
];

const initialSourceData: SourceData[] = [
  { name: "Prescription", value: 0, color: "#0f172a" },
  { name: "Medical Certificate", value: 0, color: "#64748b" },
];

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>(initialWeeklyData);
  const [revenueSource, setRevenueSource] =
    useState<SourceData[]>(initialSourceData);
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    patients: { total: 0, growth: 0 },
    prescriptions: { total: 0, monthly: 0 },
    medCerts: { total: 0, monthly: 0 },
    revenue: { total: 0, monthly: 0 },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Helper to safe extract array
        const getArray = (res: any) =>
          Array.isArray(res) ? res : res?.data || [];

        const [resP, resRx, resMc] = await Promise.allSettled([
          patientService.getPatients(),
          prescriptionService.getPrescriptions(),
          medCertService.getMedCerts(),
        ]);

        const patients =
          resP.status === "fulfilled" ? getArray(resP.value) : [];
        const prescriptions =
          resRx.status === "fulfilled" ? getArray(resRx.value) : [];
        const medCerts =
          resMc.status === "fulfilled" ? getArray(resMc.value) : [];

        // --- CALCULATION LOGIC ---
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const getSafeDate = (val: any) => {
          if (!val) return null;
          const d = new Date(val);
          return isNaN(d.getTime()) ? null : d;
        };
        const getSafeAmount = (val: any) =>
          isNaN(Number(val)) ? 0 : Number(val);

        // 1. Patients Logic
        const newPatientsCount = patients.filter((p: any) => {
          const d = getSafeDate(p.createdAt || p.lastVisit);
          return (
            d &&
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        }).length;
        const prevTotal = patients.length - newPatientsCount;
        const patientGrowth =
          prevTotal > 0
            ? Math.round((newPatientsCount / prevTotal) * 100)
            : newPatientsCount > 0
              ? 100
              : 0;

        // 2. Revenue & Monthly Data Logic
        const monthlyTotals = new Array(12).fill(0);
        let rxTotal = 0,
          rxMonthly = 0,
          mcTotal = 0,
          mcMonthly = 0;
        let rxCountMonth = 0,
          mcCountMonth = 0;

        prescriptions.forEach((rx: any) => {
          const amt = getSafeAmount(rx.amount);
          rxTotal += amt;
          const d = getSafeDate(rx.date || rx.createdAt);
          if (d && d.getFullYear() === currentYear) {
            monthlyTotals[d.getMonth()] += amt;
            if (d.getMonth() === currentMonth) {
              rxMonthly += amt;
              rxCountMonth++;
            }
          }
        });

        medCerts.forEach((mc: any) => {
          const amt = getSafeAmount(mc.amount);
          mcTotal += amt;
          const d = getSafeDate(mc.date || mc.createdAt);
          if (d && d.getFullYear() === currentYear) {
            monthlyTotals[d.getMonth()] += amt;
            if (d.getMonth() === currentMonth) {
              mcMonthly += amt;
              mcCountMonth++;
            }
          }
        });

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const dynamicMonthlyChart = monthNames
          .map((name, i) => ({ name, revenue: monthlyTotals[i] }))
          .slice(0, currentMonth + 1);

        // 3. Weekly Data Logic
        const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const newWeekly = initialWeeklyData.map((d) => ({ ...d }));
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const processWeekly = (
          items: any[],
          type: "prescription" | "medCert",
        ) => {
          items.forEach((item: any) => {
            const d = getSafeDate(item.date || item.createdAt);
            if (d && d >= oneWeekAgo) {
              const dayName = dayMap[d.getDay()];
              const idx = newWeekly.findIndex((w) => w.name === dayName);
              if (idx !== -1)
                newWeekly[idx][type] += getSafeAmount(item.amount);
            }
          });
        };
        processWeekly(prescriptions, "prescription");
        processWeekly(medCerts, "medCert");

        // Set All State
        setMetrics({
          patients: { total: patients.length, growth: patientGrowth },
          prescriptions: { total: prescriptions.length, monthly: rxCountMonth },
          medCerts: { total: medCerts.length, monthly: mcCountMonth },
          revenue: { total: rxTotal + mcTotal, monthly: rxMonthly + mcMonthly },
        });
        setWeeklyData(newWeekly);
        setRevenueSource([
          { name: "Prescription", value: rxTotal, color: "#0f172a" },
          { name: "Medical Certificate", value: mcTotal, color: "#64748b" },
        ]);
        setMonthlyChartData(dynamicMonthlyChart);
      } catch (err) {
        console.error("Dashboard error", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Move Export Logic Here
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Category,Total",
        `Revenue,${metrics.revenue.total}`,
        `Patients,${metrics.patients.total}`,
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clinic_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return {
    isLoading,
    metrics,
    weeklyData,
    revenueSource,
    monthlyChartData,
    exportCSV,
  };
}
