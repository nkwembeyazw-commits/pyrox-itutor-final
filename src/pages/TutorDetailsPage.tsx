import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, Users, Briefcase } from "lucide-react";
import Papa from "papaparse";
import { format } from "date-fns";
export function TutorDetailsPage() {
  const tutors = useQuery(api.pirox.getTutors);
  const students = useQuery(api.pirox.getStudents) ?? [];
  const handlePrint = () => window.print();
  const handleExport = () => {
    if (!tutors) return;
    const data = tutors.map(t => {
      const assigned = students
        .filter(s => t.studentIds.includes(s._id))
        .map(s => s.name)
        .join("; ");
      return {
        Name: t.name,
        Contact: t.contact,
        Mode: t.mode,
        Rate: `$${t.rate}/hr`,
        Subjects: t.subjects.join(", "),
        "Assigned Students": assigned
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pyrox_tutors_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-red">Tutor Roster</h1>
              <p className="text-muted-foreground text-lg">Managing educational experts.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handlePrint} variant="outline" className="h-14 px-8 text-xl border-accent text-accent hover:bg-accent hover:text-background transition-all">
              <Printer className="mr-3 h-6 w-6" /> Print
            </Button>
            <Button onClick={handleExport} className="h-14 px-8 text-xl bg-primary hover:bg-primary/80 shadow-neon-red">
              <Download className="mr-3 h-6 w-6" /> Export CSV
            </Button>
          </div>
        </div>
        <div className="glass-metallic neon-border-cyan rounded-2xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/80 border-b border-white/10">
              <TableRow className="h-20 hover:bg-transparent">
                <TableHead className="text-xl font-bold text-white px-8">Expert Name</TableHead>
                <TableHead className="text-xl font-bold text-white">Contact</TableHead>
                <TableHead className="text-xl font-bold text-white">Rate</TableHead>
                <TableHead className="text-xl font-bold text-white">Subjects</TableHead>
                <TableHead className="text-xl font-bold text-white px-8">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!tutors ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground animate-pulse">Scanning database...</TableCell></TableRow>
              ) : tutors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground italic">No tutors enlisted.</TableCell></TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor._id} className="h-24 hover:bg-white/5 border-b border-white/5 transition-colors">
                    <TableCell className="px-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-glow-cyan text-accent">{tutor.name}</span>
                        <span className="text-sm text-muted-foreground">{tutor.mode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg">{tutor.contact}</TableCell>
                    <TableCell className="text-xl font-bold text-primary">${tutor.rate}/hr</TableCell>
                    <TableCell className="text-lg max-w-xs truncate text-muted-foreground">
                      {tutor.subjects.join(", ")}
                    </TableCell>
                    <TableCell className="px-8">
                      <div className="flex flex-wrap gap-2">
                        {students.filter(s => tutor.studentIds.includes(s._id)).map(s => (
                          <span key={s._id} className="bg-secondary/50 px-3 py-1 rounded text-sm border border-accent/20">
                            {s.name}
                          </span>
                        ))}
                      </div>
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
          .glass-metallic { background: none !important; border: 1px solid #ccc !important; box-shadow: none !important; }
          th, td { color: black !important; border-bottom: 1px solid #eee !important; }
          .text-glow-cyan, .text-glow-red { text-shadow: none !important; color: black !important; }
          .bg-secondary\\/80 { background: #f0f0f0 !important; }
        }
      `}} />
    </div>
  );
}