import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import patientService from "@/services/patientService";
import prescriptionService from "@/services/prescriptionService";
import medCertService from "@/services/medCertService";
import type { WeeklyData, SourceData } from "./types";

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

// Move helper functions outside component to avoid recreation
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

  const newPatientsCount = patients.filter((p) => {
    const d = getSafeDate(p.createdAt || p.lastVisit);
    return (
      d && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    );
  }).length;

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

  prescriptions.forEach((rx) => {
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

  medCerts.forEach((mc) => {
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

const calculateWeeklyData = (
  prescriptions: Prescription[],
  medCerts: MedCert[],
  oneWeekAgo: Date,
) => {
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const newWeekly = initialWeeklyData.map((d) => ({ ...d }));

  const processWeekly = (
    items: (Prescription | MedCert)[],
    type: "prescription" | "medCert",
  ) => {
    items.forEach((item) => {
      const d = getSafeDate(item.date || item.createdAt);
      if (d && d >= oneWeekAgo) {
        const dayName = dayMap[d.getDay()];
        const idx = newWeekly.findIndex((w) => w.name === dayName);
        if (idx !== -1) newWeekly[idx][type] += getSafeAmount(item.amount);
      }
    });
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

  // Fetch data only once
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [resP, resRx, resMc] = await Promise.allSettled([
          patientService.getPatients(),
          prescriptionService.getPrescriptions(),
          medCertService.getMedCerts(),
        ]);

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
        console.error("Dashboard error", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
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
      // Add slight delay for smooth UX feedback
      await new Promise((resolve) => setTimeout(resolve, 300));

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
      document.body.removeChild(link);

      setIsExporting(false);
    },
    [metrics.revenue.total, metrics.patients.total],
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
