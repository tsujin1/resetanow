import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  FilePlus,
  FileBadge,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddPatientDialog from "@/components/features/patient/AddPatientDialog";
import type { IPatient } from "@/types";

// Dummy Data
const dummyPatients: IPatient[] = [
  {
    _id: "1",
    name: "Juan Dela Cruz",
    age: 34,
    gender: "Male",
    contactNumber: "0917-123-4567",
    lastVisit: "2023-10-24",
    address: "123 Rizal St, Manila", // Added address
  },
  {
    _id: "2",
    name: "Maria Clara",
    age: 28,
    gender: "Female",
    contactNumber: "0918-987-6543",
    lastVisit: "2023-11-01",
    address: "456 Mabini Ave, Quezon City", // Added address
  },
  {
    _id: "3",
    name: "Jose Rizal",
    age: 45,
    gender: "Male",
    contactNumber: "0922-555-1234",
    lastVisit: "2023-09-15",
    address: "789 Kalaw Dr, Laguna", // Added address
  },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = dummyPatients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDaysSinceVisit = (lastVisit: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(lastVisit).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* --- HEADER ACTIONS --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-50">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Patients
              </h1>
              <p className="text-sm text-slate-600">
                Manage patient records and medical history
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP BUTTON: Hidden on mobile (hidden), Visible on desktop (sm:block) */}
        <div className="hidden sm:block">
          <AddPatientDialog />
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Male Count */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Male Patients
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {dummyPatients.filter((p) => p.gender === "Male").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round(
                (dummyPatients.filter((p) => p.gender === "Male").length /
                  dummyPatients.length) *
                  100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        {/* Female Count */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Female Patients
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {dummyPatients.filter((p) => p.gender === "Female").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round(
                (dummyPatients.filter((p) => p.gender === "Female").length /
                  dummyPatients.length) *
                  100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        {/* Average Age */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-sm font-medium text-slate-700">
              Average Age
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(
                dummyPatients.reduce((sum, p) => sum + p.age, 0) /
                  dummyPatients.length,
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Years old</p>
          </CardContent>
        </Card>
      </div>

      {/* --- SEARCH & TABLE --- */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3 bg-white p-1 rounded-lg">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search patients by name..."
              className="h-10 pl-9 border-slate-200 bg-white focus-visible:ring-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredPatients.length}
            </span>{" "}
            results
          </div>
        </div>

        {/* Data Table */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="h-12 font-semibold text-slate-700 pl-6">
                    Patient Name
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-700">
                    Age
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-700">
                    Gender
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-700">
                    Contact
                  </TableHead>
                  <TableHead className="h-12 font-semibold text-slate-700">
                    Last Visit
                  </TableHead>
                  <TableHead className="h-12 text-right font-semibold text-slate-700 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const daysSince = getDaysSinceVisit(patient.lastVisit);
                    const isRecent = daysSince <= 7;

                    return (
                      <TableRow
                        key={patient._id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-xs text-slate-600 border border-slate-200">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-900">
                                {patient.name}
                              </p>
                              <p className="text-xs text-slate-500 font-mono">
                                ID: {patient._id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-sm text-slate-600">
                          {patient.age} yrs
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-600 font-normal capitalize"
                          >
                            {patient.gender}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-sm text-slate-600 font-mono">
                          {patient.contactNumber}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-900 font-medium">
                                {new Date(patient.lastVisit).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              {isRecent && (
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {daysSince} days ago
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-slate-100 data-[state=open]:bg-slate-100 text-slate-500"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer">
                                <FilePlus className="mr-2 h-3.5 w-3.5 text-slate-500" />
                                <span>Create Prescription</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileBadge className="mr-2 h-3.5 w-3.5 text-slate-500" />
                                <span>Create Med Cert</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <span>Delete Patient</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <Search className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          No patients found
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      {/* MOBILE BUTTON: Visible on mobile, Hidden on desktop */}
      <div className="mt-8 block sm:hidden pb-10">
        {/* Pass w-full to stretch the button */}
        <AddPatientDialog className="w-full" />
      </div>
    </div>
  );
}
