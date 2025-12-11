import { Save, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedCertActionButtonsProps {
  onDownloadPdf: () => void;
  onSave: () => void | Promise<void>;
  isGenerating: boolean;
  isSaving: boolean;
  disableDownload: boolean;
}

export default function MedCertActionButtons({
  onDownloadPdf,
  onSave,
  isGenerating,
  isSaving,
  disableDownload,
}: MedCertActionButtonsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:hidden pb-10">
      <Button
        variant="outline"
        onClick={onDownloadPdf}
        disabled={isGenerating || disableDownload}
        className="w-full"
      >
        {isGenerating ? (
          <span className="animate-pulse">Generating...</span>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </>
        )}
      </Button>
      <Button onClick={onSave} className="w-full" size="lg" disabled={isSaving}>
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
  );
}
