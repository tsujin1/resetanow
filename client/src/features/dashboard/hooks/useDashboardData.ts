import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import patientService from "@/features/patients/services/patientService";
import prescriptionService from "@/features/prescriptions/services/prescriptionService";
import medCertService from "@/features/medcert/services/medCertService";
import type { WeeklyData, SourceData } from "../types";

interface Patient {
  id: number | string;
  createdAt?: string | Date;
  lastVisit?: string | Date;
}

interface Prescription {
  id: number | string;
  amount?: number;
  date?: string | Date;
  createdAt?: string | Date;
}

interface MedCert {
  id: number | string;
  amount?: number;
  date?: string | Date;
  createdAt?: string | Date;
}

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
] as const;

const getSafeDate = (val: string | Date | null | undefined) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const getSafeAmount = (val: number | string | null | undefined) =>
  isNaN(Number(val)) ? 0 : Number(val);

const getArray = <T>(res: T[] | { data: T[] } | unknown): T[] =>
  Array.isArray(res) ? res : (res as { data: T[] })?.data || [];

// Memoized calculation functions
const calculatePatientMetrics = (patients: Patient[], now: Date) => {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let newPatientsCount = 0;
  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];
    const d = getSafeDate(p.createdAt || p.lastVisit);
    if (d && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      newPatientsCount++;
    }
  }

  const prevTotal = patients.length - newPatientsCount;
  const patientGrowth =
    prevTotal > 0
      ? Math.round((newPatientsCount / prevTotal) * 100)
      : newPatientsCount > 0
        ? 100
        : 0;

  return { total: patients.length, growth: patientGrowth };
};

const calculateRevenueMetrics = (
  prescriptions: Prescription[],
  medCerts: MedCert[],
  now: Date,
) => {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyTotals = new Array(12).fill(0);

  let rxTotal = 0,
    rxMonthly = 0,
    mcTotal = 0,
    mcMonthly = 0;
  let rxCountMonth = 0,
    mcCountMonth = 0;

  for (let i = 0; i < prescriptions.length; i++) {
    const rx = prescriptions[i];
    const amt = getSafeAmount(rx.amount);
    rxTotal += amt;
    const d = getSafeDate(rx.date || rx.createdAt);
    if (d && d.getFullYear() === currentYear) {
      const month = d.getMonth();
      monthlyTotals[month] += amt;
      if (month === currentMonth) {
        rxMonthly += amt;
        rxCountMonth++;
      }
    }
  }

  for (let i = 0; i < medCerts.length; i++) {
    const mc = medCerts[i];
    const amt = getSafeAmount(mc.amount);
    mcTotal += amt;
    const d = getSafeDate(mc.date || mc.createdAt);
    if (d && d.getFullYear() === currentYear) {
      const month = d.getMonth();
      monthlyTotals[month] += amt;
      if (month === currentMonth) {
        mcMonthly += amt;
        mcCountMonth++;
      }
    }
  }

  return {
    rxTotal,
    rxMonthly,
    mcTotal,
    mcMonthly,
    rxCountMonth,
    mcCountMonth,
    monthlyTotals,
  };
};

const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const calculateWeeklyData = (
  prescriptions: Prescription[],
  medCerts: MedCert[],
  oneWeekAgo: Date,
) => {
  const newWeekly = initialWeeklyData.map((d) => ({ ...d }));

  const processWeekly = (
    items: (Prescription | MedCert)[],
    type: "prescription" | "medCert",
  ) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const d = getSafeDate(item.date || item.createdAt);
      if (d && d >= oneWeekAgo) {
        const dayName = dayMap[d.getDay()];
        const idx = newWeekly.findIndex((w) => w.name === dayName);
        if (idx !== -1) newWeekly[idx][type] += getSafeAmount(item.amount);
      }
    }
  };

  processWeekly(prescriptions, "prescription");
  processWeekly(medCerts, "medCert");

  return newWeekly;
};

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [rawData, setRawData] = useState<{
    patients: Patient[];
    prescriptions: Prescription[];
    medCerts: MedCert[];
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [resP, resRx, resMc] = await Promise.allSettled([
          patientService.getPatients(),
          prescriptionService.getPrescriptions(),
          medCertService.getMedCerts(),
        ]);

        if (!isMounted) return;

        const patients =
          resP.status === "fulfilled" ? getArray<Patient>(resP.value) : [];
        const prescriptions =
          resRx.status === "fulfilled"
            ? getArray<Prescription>(resRx.value)
            : [];
        const medCerts =
          resMc.status === "fulfilled" ? getArray<MedCert>(resMc.value) : [];

        setRawData({ patients, prescriptions, medCerts });
      } catch (err) {
        if (!isMounted) return;
        console.error("Dashboard error", err);
        toast.error("Failed to load dashboard data");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Memoize all calculations
  const { metrics, weeklyData, revenueSource, monthlyChartData } =
    useMemo(() => {
      if (!rawData) {
        return {
          metrics: {
            patients: { total: 0, growth: 0 },
            prescriptions: { total: 0, monthly: 0 },
            medCerts: { total: 0, monthly: 0 },
            revenue: { total: 0, monthly: 0 },
          },
          weeklyData: initialWeeklyData,
          revenueSource: initialSourceData,
          monthlyChartData: [],
        };
      }

      const { patients, prescriptions, medCerts } = rawData;
      const now = new Date();
      const currentMonth = now.getMonth();

      // Calculate patient metrics
      const patientMetrics = calculatePatientMetrics(patients, now);

      // Calculate revenue metrics
      const revenueMetrics = calculateRevenueMetrics(
        prescriptions,
        medCerts,
        now,
      );

      // Calculate weekly data
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyData = calculateWeeklyData(
        prescriptions,
        medCerts,
        oneWeekAgo,
      );

      // Monthly chart data
      const monthlyChartData = monthNames
        .map((name, i) => ({ name, revenue: revenueMetrics.monthlyTotals[i] }))
        .slice(0, currentMonth + 1);

      // Revenue source data
      const revenueSource = [
        {
          name: "Prescription",
          value: revenueMetrics.rxTotal,
          color: "#0f172a",
        },
        {
          name: "Medical Certificate",
          value: revenueMetrics.mcTotal,
          color: "#64748b",
        },
      ];

      return {
        metrics: {
          patients: patientMetrics,
          prescriptions: {
            total: prescriptions.length,
            monthly: revenueMetrics.rxCountMonth,
          },
          medCerts: {
            total: medCerts.length,
            monthly: revenueMetrics.mcCountMonth,
          },
          revenue: {
            total: revenueMetrics.rxTotal + revenueMetrics.mcTotal,
            monthly: revenueMetrics.rxMonthly + revenueMetrics.mcMonthly,
          },
        },
        weeklyData,
        revenueSource,
        monthlyChartData,
      };
    }, [rawData]);

  // Export function with loading state
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useMemo(
    () => async () => {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Calculate month-over-month growth
      const now = new Date();
      const currentMonth = now.getMonth();
      const prevMonth = currentMonth > 0 ? currentMonth - 1 : 11;
      const currentMonthRevenue = monthlyChartData.find(
        (m) => m.name === monthNames[currentMonth],
      )?.revenue || 0;
      const prevMonthRevenue = monthlyChartData.find(
        (m) => m.name === monthNames[prevMonth],
      )?.revenue || 0;
      const monthOverMonthGrowth =
        prevMonthRevenue > 0
          ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
          : currentMonthRevenue > 0
            ? 100
            : 0;

      // Calculate total revenue for percentages
      const totalRevenue = revenueSource.reduce((sum, source) => sum + source.value, 0);

      // Calculate date range (Last 30 Days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

      // Build CSV content with all sections
      const csvRows: string[] = [];

      // Header
      csvRows.push("CLINIC REPORT");
      csvRows.push(`Report Period: ${dateRange} (Last 30 Days)`);
      csvRows.push("");

      // Summary Metrics
      csvRows.push("SUMMARY METRICS");
      csvRows.push("Category,Total,This Month");
      csvRows.push(`Total Patients,${metrics.patients.total},${metrics.patients.growth}% growth`);
      csvRows.push(`Prescriptions Issued,${metrics.prescriptions.total},${metrics.prescriptions.monthly}`);
      csvRows.push(`Medical Certificates Issued,${metrics.medCerts.total},${metrics.medCerts.monthly}`);
      csvRows.push(`Total Revenue,₱${metrics.revenue.total.toLocaleString()},₱${metrics.revenue.monthly.toLocaleString()}`);
      csvRows.push("");

      // Weekly Analysis
      csvRows.push("WEEKLY ANALYSIS (Last 7 Days)");
      csvRows.push("Day,Prescription Revenue,Medical Certificate Revenue,Daily Total");
      weeklyData.forEach((day) => {
        const dailyTotal = day.prescription + day.medCert;
        csvRows.push(
          `${day.name},₱${day.prescription.toLocaleString()},₱${day.medCert.toLocaleString()},₱${dailyTotal.toLocaleString()}`,
        );
      });
      csvRows.push("");

      // Monthly Growth Data
      csvRows.push("MONTHLY GROWTH DATA");
      csvRows.push("Month,Revenue,Month-over-Month Growth");
      monthlyChartData.forEach((month, index) => {
        const prevMonthRev =
          index > 0 ? monthlyChartData[index - 1]?.revenue || 0 : 0;
        const growth =
          prevMonthRev > 0
            ? ((month.revenue - prevMonthRev) / prevMonthRev) * 100
            : month.revenue > 0
              ? 100
              : 0;
        const growthText =
          index === 0 ? "-" : `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
        csvRows.push(
          `${month.name},₱${month.revenue.toLocaleString()},${growthText}`,
        );
      });
      csvRows.push(`Current Month Growth: ${monthOverMonthGrowth >= 0 ? "+" : ""}${monthOverMonthGrowth.toFixed(1)}%`);
      csvRows.push("");

      // Revenue Sources Breakdown
      csvRows.push("REVENUE SOURCES BREAKDOWN");
      csvRows.push("Source,Amount,Percentage");
      revenueSource.forEach((source) => {
        const percentage =
          totalRevenue > 0 ? (source.value / totalRevenue) * 100 : 0;
        csvRows.push(
          `${source.name},₱${source.value.toLocaleString()},${percentage.toFixed(1)}%`,
        );
      });
      csvRows.push(`Total,₱${totalRevenue.toLocaleString()},100.0%`);

      // Create CSV
      const csvContent = csvRows.join("\n");
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "clinic_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsExporting(false);
    },
    [
      metrics.revenue.total,
      metrics.revenue.monthly,
      metrics.patients.total,
      metrics.patients.growth,
      metrics.prescriptions.total,
      metrics.prescriptions.monthly,
      metrics.medCerts.total,
      metrics.medCerts.monthly,
      weeklyData,
      revenueSource,
      monthlyChartData,
    ],
  );

  return {
    isLoading,
    isExporting,
    metrics,
    weeklyData,
    revenueSource,
    monthlyChartData,
    exportCSV,
  };
}
