import { User } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ProfileCard() {
  const { control } = useFormContext(); // Access parent form automatically

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 border-b border-slate-100 bg-slate-50/50 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <User className="h-4 w-4" />
        </div>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold text-slate-900">Professional Profile</CardTitle>
          <CardDescription className="text-sm">Information appearing on your document headers</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Title</FormLabel>
                  <FormControl><Input placeholder="MD" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Specialty</FormLabel>
                  <FormControl><Input placeholder="Physician" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email Address</FormLabel>
                <FormControl><Input {...field} disabled /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Contact Number</FormLabel>
                <FormControl><Input placeholder="0917-XXX-XXXX" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}