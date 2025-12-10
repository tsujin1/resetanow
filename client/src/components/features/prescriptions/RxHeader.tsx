import { Save, Download, Loader2, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RxHeaderProps {
  onDownloadPdf: () => void;
  onSave: () => void;
  isGenerating: boolean;
  isSaving: boolean;
}

export default function RxHeader({
  onDownloadPdf,
  onSave,
  isGenerating,
  isSaving,
}: RxHeaderProps) {
  return (
    <div className="no-print">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create Prescription
              </h1>
              <p className="text-sm text-slate-600">
                Create digital prescriptions and track billing
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onDownloadPdf}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </>
            )}
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Record
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

