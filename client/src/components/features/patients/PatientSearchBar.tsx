import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export default function PatientSearchBar({
  searchTerm,
  onSearchChange,
  resultCount,
}: PatientSearchBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-1 rounded-lg">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Search patients by name..."
          className="h-10 pl-9 border-slate-200 bg-white focus-visible:ring-slate-200"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="text-sm text-slate-500 hidden sm:block">
        Showing{" "}
        <span className="font-semibold text-slate-900">{resultCount}</span>{" "}
        results
      </div>
    </div>
  );
}

