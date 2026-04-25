import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, Briefcase, Edit, Trash2, Check, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id, Doc } from '@convex/_generated/dataModel';
import { Link } from 'react-router-dom';
import { SUBJECT_LIST } from '@/lib/constants';
export function TutorDetailsPage() {
  const tutors = useQuery(api.pyrox.getTutors);
  const students = useQuery(api.pyrox.getStudents) ?? [];
  const updateTutor = useMutation(api.pyrox.updateTutor);
  const deleteTutor = useMutation(api.pyrox.deleteTutor);
  const [editingTutor, setEditingTutor] = useState<Doc<"tutors"> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleExport = () => {
    if (!tutors) return;
    const data = tutors.map(t => {
      const assigned = students
        .filter(s => t.studentIds?.includes(s._id))
        .map(s => s.name)
        .join("; ");
      return {
        Name: t.name,
        Contact: t.contact,
        Mode: t.mode,
        Rate: `${t.rate}/hr`,
        Subjects: t.subjects.join(", "),
        "Assigned Students": assigned
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pyrox-tutors-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleEditSave = async () => {
    if (!editingTutor) return;
    setIsUpdating(true);
    try {
      await updateTutor({
        id: editingTutor._id,
        name: editingTutor.name,
        contact: editingTutor.contact,
        mode: editingTutor.mode,
        subjects: editingTutor.subjects,
        studentIds: editingTutor.studentIds,
        rate: editingTutor.rate,
      });
      toast.success("Expert profile synchronized.");
      setIsEditDialogOpen(false);
      setEditingTutor(null);
    } catch (e) {
      toast.error("Roster update failed.");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex justify-start no-print">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold gap-2 hover:bg-primary/10">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 print:hidden">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red shrink-0">
              <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-display tracking-tight text-glow-red uppercase leading-tight">Expert Roster</h1>
              <p className="text-muted-foreground text-sm md:text-lg italic font-medium">Knowledge Leader Directory.</p>
            </div>
          </div>
          <div className="flex gap-4 w-full xl:w-auto">
            <Button onClick={() => window.print()} variant="outline" className="h-14 px-4 md:px-8 text-xs md:text-xl border-accent text-accent hover:bg-accent hover:text-background font-bold flex-1 transition-all">
              <Printer className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" /> Print
            </Button>
            <Button onClick={handleExport} className="h-14 px-4 md:px-8 text-xs md:text-xl bg-primary hover:bg-primary/90 shadow-neon-red font-bold flex-1 transition-all">
              <Download className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" /> Export
            </Button>
          </div>
        </header>
        <div className="glass-metallic neon-border-cyan rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-secondary/80 border-b border-white/10">
                <TableRow className="h-20 hover:bg-transparent">
                  <TableHead className="text-sm md:text-xl font-bold text-white px-8 uppercase tracking-widest">Leader</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Protocol</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Rate</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest hidden sm:table-cell">Learners</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white px-8 uppercase tracking-widest text-right print:hidden">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!tutors ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-32 text-xl text-muted-foreground animate-pulse font-bold">Scanning mainframe...</TableCell></TableRow>
                ) : tutors.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-32 text-xl text-muted-foreground font-mono italic">No expert data in registry.</TableCell></TableRow>
                ) : (
                  tutors.map((tutor) => (
                    <TableRow key={tutor._id} className="h-24 hover:bg-white/5 border-b border-white/5 transition-colors group">
                      <TableCell className="px-8">
                        <div className="flex flex-col">
                          <span className="text-lg md:text-2xl font-bold text-glow-cyan text-accent group-hover:text-white transition-colors font-display tracking-tight uppercase">{tutor.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{tutor.mode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm md:text-lg font-bold text-white/80">{tutor.contact}</TableCell>
                      <TableCell className="text-base md:text-xl font-black text-primary drop-shadow-neon-red">${tutor.rate}/HR</TableCell>
                      <TableCell className="text-sm md:text-lg text-muted-foreground font-medium hidden sm:table-cell">
                        {students.filter(s => tutor.studentIds?.includes(s._id)).length} Assigned
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <div className="flex justify-end gap-2 print:hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingTutor(tutor); setIsEditDialogOpen(true); }}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-accent hover:bg-accent/20"
                          >
                            <Edit className="h-5 w-5 md:h-6 md:w-6" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl text-primary hover:bg-primary/20">
                                <Trash2 className="h-5 w-5 md:h-6 md:w-6" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-metallic neon-border-red">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Expunge Expert?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground font-medium text-lg italic">Critical erasure protocol will permanently remove this knowledge leader from the PyroX mainframe.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-secondary/50 border-white/10 text-white font-bold uppercase h-12 px-6">Abort</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTutor({ id: tutor._id })} className="bg-primary text-white shadow-neon-red font-bold uppercase h-12 px-6">Confirm Erasure</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}