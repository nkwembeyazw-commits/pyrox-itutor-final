import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, Database, Edit, Trash2, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from '@convex/_generated/dataModel';
const SUBJECT_LIST = [
  "Mathematics", "English Language", "English Literature", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Computer Science", "Business Studies",
  "Accounting", "Economics", "French", "Spanish", "Art", "Music"
];
export function StudentDetailsPage() {
  const students = useQuery(api.pirox.getStudents);
  const updateStudent = useMutation(api.pirox.updateStudent);
  const deleteStudent = useMutation(api.pirox.deleteStudent);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
  const handleEditSave = async () => {
    if (!editingStudent) return;
    try {
      await updateStudent({
        id: editingStudent._id as Id<"students">,
        name: editingStudent.name,
        location: editingStudent.location,
        level: editingStudent.level,
        subjects: editingStudent.subjects,
      });
      toast.success("Registry updated.");
      setEditDialogOpen(false);
    } catch (e) {
      toast.error("Update failed.");
    }
  };
  const handleDelete = async (id: Id<"students">) => {
    try {
      await deleteStudent({ id });
      toast.success("Record expunged.");
    } catch (e) {
      toast.error("Deletion failed.");
    }
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
                <TableHead className="text-xl font-bold text-white px-10">Student Name</TableHead>
                <TableHead className="text-xl font-bold text-white">Location</TableHead>
                <TableHead className="text-xl font-bold text-white">Tier</TableHead>
                <TableHead className="text-xl font-bold text-white">Modules</TableHead>
                <TableHead className="text-xl font-bold text-white text-right px-10 print:hidden">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!students ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground animate-pulse">Syncing with mainframe...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground italic">Registry is currently empty.</TableCell></TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} className="h-24 hover:bg-white/5 transition-colors border-b border-white/5 group">
                    <TableCell className="px-10">
                      <span className="text-2xl font-bold text-white group-hover:text-accent transition-colors">{student.name}</span>
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
                    <TableCell className="px-10 text-right print:hidden">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingStudent(student); setEditDialogOpen(true); }}
                          className="h-12 w-12 rounded-xl text-accent hover:bg-accent/20"
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-primary hover:bg-primary/20">
                              <Trash2 className="h-6 w-6" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-metallic neon-border-red">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-bold text-white">Critical Command: Expunge Record?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                This will permanently remove {student.name} and all associated schedules from the mainframe.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-secondary/50 border-white/10 text-white">Abort</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(student._id)} className="bg-primary text-white shadow-neon-red">Confirm Erasure</AlertDialogAction>
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
        {/* Inline Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="glass-metallic neon-border-cyan border-2 sm:max-w-[700px] p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-6">Modify Learner Data</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent">Full Name</Label>
                    <Input value={editingStudent.name} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} className="h-14 bg-secondary/50 border-accent/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent">Location</Label>
                    <Input value={editingStudent.location} onChange={(e) => setEditingStudent({...editingStudent, location: e.target.value})} className="h-14 bg-secondary/50 border-accent/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-accent">Academic Tier</Label>
                  <select
                    value={editingStudent.level}
                    onChange={(e) => setEditingStudent({...editingStudent, level: e.target.value})}
                    className="flex h-14 w-full rounded-md border-accent/20 bg-secondary/50 px-3 text-white outline-none"
                  >
                    <option value="Primary">Primary Core</option>
                    <option value="IGCSE">IGCSE Standard</option>
                    <option value="A Level">A Level Advanced</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <Label className="text-primary text-xl font-bold">Modules Selection</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SUBJECT_LIST.map((subj) => (
                      <div key={subj} className={`flex items-center space-x-3 p-3 border rounded-xl ${editingStudent.subjects.includes(subj) ? 'bg-primary/20 border-primary' : 'bg-secondary/30 border-white/5'}`}>
                        <Checkbox
                          checked={editingStudent.subjects.includes(subj)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...editingStudent.subjects, subj]
                              : editingStudent.subjects.filter((s: string) => s !== subj);
                            setEditingStudent({...editingStudent, subjects: next});
                          }}
                        />
                        <span className="text-sm font-medium">{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-8">
              <Button onClick={() => setEditDialogOpen(false)} variant="outline" className="h-16 px-8 border-white/10">Abort</Button>
              <Button onClick={handleEditSave} className="h-16 px-12 bg-accent text-background font-bold shadow-neon-cyan">
                <Check className="mr-2" /> Commit Updates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .glass-metallic { background: none !important; border: 1px solid #000 !important; }
          th, td { color: black !important; border: 1px solid #ddd !important; padding: 12px !important; }
          .bg-secondary\\/60 { background: #f0f0f0 !important; }
          .text-glow-cyan { text-shadow: none !important; }
          .group:hover { background: none !important; }
        }
      `}} />
    </div>
  );
}