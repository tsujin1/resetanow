import { Calendar, Pill, Stethoscope, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "../utils/patientUtils";

interface HistoryRecordCardProps {
  item: {
    type: "prescription" | "medcert";
    id: string;
    createdAt: string;
    data: any;
  };
  onDelete: (type: string, id: string) => void;
}

export default function HistoryRecordCard({
  item,
  onDelete,
}: HistoryRecordCardProps) {
  return (
    <Card className="bg-white border-slate-200 hover:border-slate-300 transition-colors">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Badge
              variant={item.type === "prescription" ? "default" : "secondary"}
              className={
                item.type === "prescription"
                  ? "bg-slate-900 hover:bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }
            >
              {item.type === "prescription"
                ? "Prescription"
                : "Medical Certificate"}
            </Badge>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">
                {formatDate(item.createdAt)}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="whitespace-nowrap">
                {formatTime(item.createdAt)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.type, item.id)}
            className="h-8 w-8 p-0 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        {item.type === "prescription" ? (
          <div className="space-y-4">
            {/* Diagnosis */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Diagnosis
                </span>
              </div>
              <p className="text-sm text-slate-900 pl-6">
                {item.data.diagnosis || "No diagnosis recorded"}
              </p>
            </div>

            {/* Medications */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Medications
                </span>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-x-auto -mx-1 sm:mx-0">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                        Medicine
                      </th>
                      <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                        Dosage
                      </th>
                      <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                        Frequency
                      </th>
                      <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-slate-500">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {item.data.medications.map((med: any, idx: number) => (
                      <tr key={idx} className="bg-white">
                        <td className="px-3 sm:px-4 py-2.5 text-slate-900 font-medium">
                          {med.name}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-slate-600">
                          {med.dosage}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-slate-600">
                          {med.instructions}
                        </td>
                        <td className="px-3 sm:px-4 py-2.5 text-right text-slate-600">
                          {med.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amount */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                Fee:{" "}
                <span className="font-semibold text-slate-900">
                  ₱{item.data.amount.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Med Cert Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Reason
                </p>
                <p className="text-sm text-slate-900">{item.data.reason}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Diagnosis
                </p>
                <p className="text-sm text-slate-900">{item.data.diagnosis}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Recommendation
              </p>
              <p className="text-sm text-slate-700">
                {item.data.recommendation}
              </p>
            </div>

            {/* Amount */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                Fee:{" "}
                <span className="font-semibold text-slate-900">
                  ₱{item.data.amount.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
