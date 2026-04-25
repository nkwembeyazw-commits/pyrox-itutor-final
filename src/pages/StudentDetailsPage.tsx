import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, GraduationCap, Database } from "lucide-react";
import Papa from "papaparse";
import { format } from "date-fns";
export function StudentDetailsPage() {
  const students = useQuery(api.pirox.getStudents);
  const handlePrint = () => window.print();
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
    link.setAttribute("download", `pyrox_students_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
          <div className="flex items-center gap-6">
            <div className="bg-accent p-4 rounded-2xl shadow-neon-cyan">
              <Database className="h-10 w-10 text-background" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-cyan">Student Registry</h1>
              <p className="text-muted-foreground text-lg">Real-time enrollment database.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handlePrint} variant="outline" className="h-14 px-8 text-xl border-accent text-accent hover:bg-accent hover:text-background">
              <Printer className="mr-3 h-6 w-6" /> Print
            </Button>
            <Button onClick={handleExport} className="h-14 px-8 text-xl bg-primary hover:bg-primary/80 shadow-neon-red">
              <Download className="mr-3 h-6 w-6" /> Export
            </Button>
          </div>
        </div>
        <div className="glass-metallic neon-border-red rounded-3xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/60 border-b border-white/10">
              <TableRow className="h-20 hover:bg-transparent">
                <TableHead className="text-xl font-bold text-white px-10">Subject Name</TableHead>
                <TableHead className="text-xl font-bold text-white">Location</TableHead>
                <TableHead className="text-xl font-bold text-white">Tier</TableHead>
                <TableHead className="text-xl font-bold text-white">Modules</TableHead>
                <TableHead className="text-xl font-bold text-white px-10 text-right">Entry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!students ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground animate-pulse">Syncing with mainframe...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground italic">Registry is currently empty.</TableCell></TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} className="h-24 hover:bg-white/5 transition-colors border-b border-white/5">
                    <TableCell className="px-10">
                      <span className="text-2xl font-bold text-white group-hover:text-accent">{student.name}</span>
                    </TableCell>
                    <TableCell className="text-lg text-muted-foreground">{student.location}</TableCell>
                    <TableCell>
                      <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg ${
                        student.level === 'A Level' ? 'bg-primary text-white shadow-neon-red' :
                        student.level === 'IGCSE' ? 'bg-accent text-background shadow-neon-cyan' : 'bg-green-500 text-white'
                      }`}>
                        {student.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-lg text-muted-foreground max-w-md truncate">
                      {student.subjects.join(" | ")}
                    </TableCell>
                    <TableCell className="px-10 text-right text-lg font-mono text-muted-foreground">
                      {format(student.createdAt, "dd-MM-yyyy")}
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
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .glass-metallic { background: none !important; border: 1px solid #000 !important; }
          th, td { color: black !important; border: 1px solid #ddd !important; padding: 12px !important; }
          .bg-secondary\\/60 { background: #f0f0f0 !important; }
          .text-glow-cyan { text-shadow: none !important; }
        }
      `}} />
    </div>
  );
}