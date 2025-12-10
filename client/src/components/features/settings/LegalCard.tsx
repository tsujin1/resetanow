import { FileBadge } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function LegalCard() {
  const { control } = useFormContext();

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <FileBadge className="h-4 w-4" />
        </div>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold text-slate-900">
            Legal Info
          </CardTitle>
          <CardDescription className="text-sm">
            For Rx validation
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        <FormField
          control={control}
          name="licenseNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">PRC License No.</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ptrNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">PTR No.</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="s2No"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">
                S2 No. (Optional)
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
