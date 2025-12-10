import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RxAlertsProps {
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
}

export default function RxAlerts({
  error,
  saveError,
  saveSuccess,
}: RxAlertsProps) {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="no-print">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="no-print border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Success</AlertTitle>
          <AlertDescription className="text-green-800">
            Prescription saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive" className="no-print">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
