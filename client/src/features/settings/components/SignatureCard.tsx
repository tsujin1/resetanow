import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Upload, X, PenTool, Eraser, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SignatureCardProps {
  signaturePreview: string | null;
  setSignaturePreview: (val: string | null) => void;
  sigCanvasRef: React.RefObject<SignatureCanvas | null>;
  onClear: () => void;
  onSaveDraw: () => void;
}

export function SignatureCard({
  signaturePreview,
  setSignaturePreview,
  sigCanvasRef,
  onClear,
  onSaveDraw,
}: SignatureCardProps) {
  const [mode, setMode] = useState<"upload" | "draw">("draw");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
        setMode("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              E-Signature
            </CardTitle>
            <CardDescription className="text-sm">
              Draw or upload signature
            </CardDescription>
          </div>
          <div className="flex bg-slate-200 rounded-md p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("draw")}
              className={`p-1.5 rounded text-xs font-medium transition-all ${mode === "draw" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              <PenTool className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`p-1.5 rounded text-xs font-medium transition-all ${mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              {signaturePreview ? (
                <span className="flex items-center gap-1">
                  <FileBadge className="h-4 w-4" /> View
                </span>
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* DRAW MODE */}
        {mode === "draw" && (
          <div className="space-y-3">
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                  width: 320,
                  height: 160,
                  className:
                    "signature-canvas w-full h-40 bg-white cursor-crosshair",
                }}
                onEnd={onSaveDraw}
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-slate-500 hover:text-red-600"
              >
                <Eraser className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        )}

        {/* UPLOAD MODE */}
        {mode === "upload" && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50/30 hover:bg-slate-50 transition-colors w-full h-40">
            {signaturePreview ? (
              <div className="relative group w-full flex justify-center">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    className="h-16 object-contain"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSignaturePreview(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="signature-upload"
                className="w-full h-full cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                  <Upload className="h-4 w-4 text-slate-500" />
                </div>
                <div className="text-xs text-slate-500 text-center">
                  <span className="font-semibold text-slate-900">
                    Click to upload
                  </span>
                  <br /> transparent PNG
                </div>
              </label>
            )}
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="signature-upload"
              onChange={handleFileChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
