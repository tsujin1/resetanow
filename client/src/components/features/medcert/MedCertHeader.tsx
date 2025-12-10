import { Save, Download, Loader2, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedCertHeaderProps {
  onDownloadPdf: () => void;
  onSave: () => void;
  isGenerating: boolean;
  isSaving: boolean;
  disableDownload: boolean;
}

export default function MedCertHeader({
  onDownloadPdf,
  onSave,
  isGenerating,
  isSaving,
  disableDownload,
}: MedCertHeaderProps) {
  return (
    <div className="no-print">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <FileBadge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Medical Certificate
              </h1>
              <p className="text-sm text-slate-600">
                Generate and manage patient certification documents
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={onDownloadPdf}
            disabled={isGenerating || disableDownload}
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
