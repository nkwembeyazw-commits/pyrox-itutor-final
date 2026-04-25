import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, Database, Edit, Trash2, Check, ArrowLeft, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";
import { format } from "date-fns";
import { toast } from "sonner";
import { Doc } from '@convex/_generated/dataModel';
import { Link } from 'react-router-dom';
import { SUBJECT_LIST } from '@/lib/constants';
import { calculateNextDue, isOverdue as checkOverdue } from '@/lib/utils';
export function StudentDetailsPage() {
  const students = useQuery(api.pyrox.getStudents);
  const updateStudent = useMutation(api.pyrox.updateStudent);
  const deleteStudent = useMutation(api.pyrox.deleteStudent);
  const [editingStudent, setEditingStudent] = useState<Doc<"students"> | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleExport = () => {
    if (!students) return;
    const data = students.map(s => {
      const nextDueTs = calculateNextDue(s.lastPaidDate, s.paymentInterval, s.createdAt);
      return {
        Name: s.name,
        Location: s.location,
        Level: s.level,
        Subjects: s.subjects.join(", "),
        "Last Paid": s.lastPaidDate ? format(s.lastPaidDate, "yyyy-MM-dd") : "No Record",
        Interval: s.paymentInterval || "N/A",
        "Next Due": format(nextDueTs, "yyyy-MM-dd"),
        "Registered On": format(s.createdAt, "PPP")
      };
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pyrox-itutor-students-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleEditSave = async () => {
    if (!editingStudent) return;
    setIsUpdating(true);
    try {
      await updateStudent({
        id: editingStudent._id,
        name: editingStudent.name,
        location: editingStudent.location,
        level: editingStudent.level,
        subjects: editingStudent.subjects,
        lastPaidDate: editingStudent.lastPaidDate || editingStudent.createdAt,
        paymentInterval: editingStudent.paymentInterval || "monthly",
      });
      toast.success("Registry updated.");
      setEditDialogOpen(false);
      setEditingStudent(null);
    } catch (e) {
      toast.error("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex justify-start no-print">
          <Button asChild variant="ghost" className="text-accent hover:text-accent/80 font-bold gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 print:hidden">
          <div className="flex items-center gap-6">
            <div className="bg-accent p-4 rounded-2xl shadow-neon-cyan shrink-0">
              <Database className="h-8 w-8 md:h-10 md:w-10 text-background" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-display tracking-tight text-glow-cyan uppercase leading-tight">Student Registry</h1>
              <p className="text-muted-foreground text-sm md:text-lg italic">Real-time Enrollment mainframe.</p>
            </div>
          </div>
          <div className="flex gap-4 w-full xl:w-auto">
            <Button onClick={() => window.print()} variant="outline" className="h-14 px-4 md:px-8 text-xs md:text-xl border-accent text-accent hover:bg-accent hover:text-background font-bold flex-1 transition-all">
              <Printer className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" /> Print
            </Button>
            <Button onClick={handleExport} className="h-14 px-4 md:px-8 text-xs md:text-xl bg-primary hover:bg-primary/80 shadow-neon-red font-bold flex-1 transition-all">
              <Download className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" /> Export
            </Button>
          </div>
        </header>
        <div className="glass-metallic neon-border-red rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-secondary/60 border-b border-white/10">
                <TableRow className="h-20 hover:bg-transparent">
                  <TableHead className="text-sm md:text-xl font-bold text-white px-8 uppercase tracking-widest">Name</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Tier</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Last Paid</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Next Due</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white text-right px-8 print:hidden uppercase tracking-widest">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!students ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-32 text-xl text-muted-foreground animate-pulse">Syncing mainframe...</TableCell></TableRow>
                ) : students.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-32 text-xl text-muted-foreground italic font-mono">Empty database link.</TableCell></TableRow>
                ) : (
                  students.map((student) => {
                    const nextDue = calculateNextDue(student.lastPaidDate, student.paymentInterval, student.createdAt);
                    const isOverdue = checkOverdue(nextDue);
                    return (
                      <TableRow key={student._id} className="h-24 hover:bg-white/5 transition-colors border-b border-white/5 group">
                        <TableCell className="px-8">
                          <span className="text-lg md:text-2xl font-bold text-white group-hover:text-accent transition-colors font-display tracking-tight uppercase">{student.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                            student.level === 'A Level' ? 'bg-primary text-white shadow-neon-red' :
                            student.level === 'IGCSE' ? 'bg-accent text-background shadow-neon-cyan' : 'bg-green-500 text-white'
                          }`}>
                            {student.level}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm md:text-lg text-muted-foreground font-medium font-mono">
                          {student.lastPaidDate ? format(student.lastPaidDate, "MMM dd, yyyy") : "No History"}
                        </TableCell>
                        <TableCell>
                          <span className={isOverdue ? "text-primary font-black drop-shadow-neon-red" : "text-accent font-bold"}>
                            {format(nextDue, "MMM dd, yyyy")}
                          </span>
                        </TableCell>
                        <TableCell className="px-8 text-right print:hidden">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setEditingStudent(student); setEditDialogOpen(true); }}
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
                                  <AlertDialogTitle className="text-xl md:text-2xl font-bold text-white uppercase tracking-tighter">Expunge Record?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground font-medium italic">
                                    Permanent erasure from the mainframe.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-secondary/50 border-white/10 text-white font-bold uppercase">Abort</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteStudent({ id: student._id })} className="bg-primary text-white shadow-neon-red font-bold uppercase">Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) setEditingStudent(null); setEditDialogOpen(open); }}>
          <DialogContent className="glass-metallic neon-border-cyan border-2 sm:max-w-[700px] p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter leading-tight">Modify Learner Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium text-lg italic">Modify core and financial parameters for {editingStudent?.name}</DialogDescription>
            </DialogHeader>
            {editingStudent && (
              <div className="space-y-6 md:space-y-8 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Full Name</Label>
                    <Input value={editingStudent.name} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} className="h-12 md:h-14 bg-secondary/50 border-accent/20 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Location</Label>
                    <Input value={editingStudent.location} onChange={(e) => setEditingStudent({...editingStudent, location: e.target.value})} className="h-12 md:h-14 bg-secondary/50 border-accent/20 font-bold" />
                  </div>
                </div>
                <div className="bg-accent/5 p-6 rounded-2xl border border-accent/20 space-y-4">
                   <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Financial Configuration
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] text-muted-foreground font-bold uppercase">Last Payment Date</Label>
                      <Input
                        type="date"
                        value={editingStudent.lastPaidDate ? new Date(editingStudent.lastPaidDate).toISOString().split('T')[0] : ""}
                        onChange={(e) => setEditingStudent({...editingStudent, lastPaidDate: new Date(e.target.value).getTime()})}
                        className="h-12 bg-secondary/50 border-white/10 text-white font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] text-muted-foreground font-bold uppercase">Billing Interval</Label>
                      <select
                        value={editingStudent.paymentInterval || "monthly"}
                        onChange={(e) => setEditingStudent({...editingStudent, paymentInterval: e.target.value as "weekly" | "monthly"})}
                        className="h-12 w-full rounded-md border-white/10 bg-secondary/50 px-2 text-white font-bold"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-primary text-base md:text-xl font-bold uppercase tracking-widest">Module Access</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUBJECT_LIST.map((subj) => (
                      <div key={subj} className={`flex items-center space-x-2 p-2 border rounded-xl transition-all ${editingStudent.subjects.includes(subj) ? 'bg-primary/20 border-primary' : 'bg-secondary/30 border-white/5'}`}>
                        <Checkbox
                          checked={editingStudent.subjects.includes(subj)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...editingStudent.subjects, subj]
                              : editingStudent.subjects.filter((s: string) => s !== subj);
                            setEditingStudent({...editingStudent, subjects: next});
                          }}
                        />
                        <span className="text-[10px] md:text-xs font-bold uppercase truncate">{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setEditDialogOpen(false)} variant="outline" className="h-14 px-8 border-white/10 font-bold uppercase flex-1" disabled={isUpdating}>Abort</Button>
              <Button onClick={handleEditSave} className="h-14 px-12 bg-accent text-background font-bold shadow-neon-cyan uppercase tracking-widest flex-1" disabled={isUpdating}>
                {isUpdating ? <div className="h-5 w-5 animate-spin border-2 border-background border-t-transparent rounded-full mr-2" /> : <Check className="mr-2" />}
                Commit Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}