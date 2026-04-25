import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, GraduationCap } from "lucide-react";
import Papa from "papaparse";
import { format } from "date-fns";
export function StudentDetailsPage() {
  const students = useQuery(api.pirox.getStudents);
  const handlePrint = () => {
    window.print();
  };
  const handleExport = () => {
    if (!students) return;
    const data = students.map(s => ({
      Name: s.name,
      Location: s.location,
      Level: s.level,
      Subjects: s.subjects.join(", "),
      "Registered On": format(s.createdAt, "PPP")
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pirox_students_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Registered Students</h1>
          </div>
          <div className="flex gap-4">
            <Button onClick={handlePrint} variant="outline" className="h-12 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white">
              <Printer className="mr-2 h-5 w-5" /> Print Roster
            </Button>
            <Button onClick={handleExport} variant="default" className="h-12 text-lg bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-5 w-5" /> Export to CSV
            </Button>
          </div>
        </div>
        <div className="bg-white border-2 rounded-xl shadow-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="h-16">
                <TableHead className="text-lg font-bold">Student Name</TableHead>
                <TableHead className="text-lg font-bold">Location</TableHead>
                <TableHead className="text-lg font-bold">Level</TableHead>
                <TableHead className="text-lg font-bold">Subjects</TableHead>
                <TableHead className="text-lg font-bold">Enrolled Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!students ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-xl text-muted-foreground italic">
                    Loading student records...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-xl text-muted-foreground italic">
                    No students registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} className="h-20 hover:bg-muted/30 transition-colors">
                    <TableCell className="text-xl font-semibold">{student.name}</TableCell>
                    <TableCell className="text-lg">{student.location}</TableCell>
                    <TableCell className="text-lg font-medium">
                      <span className={`px-4 py-1 rounded-full text-white ${
                        student.level === 'A Level' ? 'bg-red-500' : 
                        student.level === 'IGCSE' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {student.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-lg text-muted-foreground max-w-xs truncate">
                      {student.subjects.join(", ")}
                    </TableCell>
                    <TableCell className="text-lg">
                      {format(student.createdAt, "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}