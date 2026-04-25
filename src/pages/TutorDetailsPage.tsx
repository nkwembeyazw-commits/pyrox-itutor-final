import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Download, Briefcase, Edit, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id, Doc } from '@convex/_generated/dataModel';
const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science", "Business"
];
export function TutorDetailsPage() {
  const tutors = useQuery(api.pyrox.getTutors);
  const students = useQuery(api.pyrox.getStudents) ?? [];
  const updateTutor = useMutation(api.pyrox.updateTutor);
  const deleteTutor = useMutation(api.pyrox.deleteTutor);
  const [editingTutor, setEditingTutor] = useState<Doc<"tutors"> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
    link.setAttribute("download", `pyrox-itutor-tutors-${format(new Date(), "yyyy-MM-dd")}.csv`);
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
      toast.success("Expert profile updated.");
      setIsEditDialogOpen(false);
      setEditingTutor(null);
    } catch (e) {
      toast.error("Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };
  const handleDelete = async (id: Id<"tutors">) => {
    try {
      await deleteTutor({ id });
      toast.success("Expert expunged from roster.");
    } catch (e) {
      toast.error("Deletion failed.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-red uppercase">Tutor Roster</h1>
              <p className="text-muted-foreground text-lg italic">PyroX-iTutor Knowledge Leader Directory.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handlePrint} variant="outline" className="h-14 px-8 text-xl border-accent text-accent hover:bg-accent hover:text-background font-bold transition-all">
              <Printer className="mr-3 h-6 w-6" /> Print Roster
            </Button>
            <Button onClick={handleExport} className="h-14 px-8 text-xl bg-primary hover:bg-primary/80 shadow-neon-red font-bold transition-all">
              <Download className="mr-3 h-6 w-6" /> Export CSV
            </Button>
          </div>
        </header>
        {/* Print Only Header */}
        <div className="hidden print:block mb-8">
          <h1 className="text-4xl font-bold text-black uppercase tracking-tighter border-b-4 border-black pb-2">PyroX-iTutor Expert Deployment Directory</h1>
          <p className="text-sm font-mono mt-2">Registry Snapshot: {format(new Date(), "PPP HH:mm")}</p>
          <p className="text-xs italic text-gray-600">Ignite Knowledge. Inspire Futures.</p>
        </div>
        <div className="glass-metallic neon-border-cyan rounded-2xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/80 border-b border-white/10">
              <TableRow className="h-20 hover:bg-transparent">
                <TableHead className="text-xl font-bold text-white px-8 uppercase tracking-widest">Leader</TableHead>
                <TableHead className="text-xl font-bold text-white uppercase tracking-widest">Link</TableHead>
                <TableHead className="text-xl font-bold text-white uppercase tracking-widest">Rate</TableHead>
                <TableHead className="text-xl font-bold text-white uppercase tracking-widest">Disciplines</TableHead>
                <TableHead className="text-xl font-bold text-white px-8 uppercase tracking-widest text-right print:hidden">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!tutors ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground animate-pulse">Scanning PyroX Database...</TableCell></TableRow>
              ) : tutors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-2xl text-muted-foreground font-mono italic">No expert data found.</TableCell></TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor._id} className="h-24 hover:bg-white/5 border-b border-white/5 transition-colors group">
                    <TableCell className="px-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-glow-cyan text-accent group-hover:text-white transition-colors font-display tracking-tight">{tutor.name}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{tutor.mode} deployment</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg font-medium">{tutor.contact}</TableCell>
                    <TableCell className="text-xl font-bold text-primary">${tutor.rate}<span className="text-xs text-muted-foreground ml-1">/HR</span></TableCell>
                    <TableCell className="text-lg max-w-xs truncate text-muted-foreground font-medium">
                      {tutor.subjects.join(", ")}
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex justify-end gap-2 print:hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingTutor(tutor); setIsEditDialogOpen(true); }}
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
                              <AlertDialogTitle className="text-2xl font-bold text-white uppercase tracking-tighter">Expunge Expert?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground font-medium">
                                Critical erasure of {tutor.name} from the PyroX knowledge roster. Irreversible command.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-secondary/50 border-white/10 text-white font-bold uppercase">Abort</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(tutor._id)} className="bg-primary text-white shadow-neon-red font-bold uppercase">Confirm Expunge</AlertDialogAction>
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
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { if (!open) setEditingTutor(null); setIsEditDialogOpen(open); }}>
          <DialogContent className="glass-metallic neon-border-cyan border-2 sm:max-w-[700px] p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Modify Expert Registry</DialogTitle>
            </DialogHeader>
            {editingTutor && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Name</Label>
                    <Input value={editingTutor.name} onChange={(e) => setEditingTutor({...editingTutor, name: e.target.value})} className="h-14 bg-secondary/50 border-accent/20 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Contact</Label>
                    <Input value={editingTutor.contact} onChange={(e) => setEditingTutor({...editingTutor, contact: e.target.value})} className="h-14 bg-secondary/50 border-accent/20 font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Mode</Label>
                    <select
                      value={editingTutor.mode}
                      onChange={(e) => setEditingTutor({...editingTutor, mode: e.target.value})}
                      className="flex h-14 w-full rounded-md border-accent/20 bg-secondary/50 px-3 text-white outline-none font-bold"
                    >
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-accent uppercase font-bold text-xs tracking-widest">Rate ($/hr)</Label>
                    <Input type="number" value={editingTutor.rate} onChange={(e) => setEditingTutor({...editingTutor, rate: Number(e.target.value)})} className="h-14 bg-secondary/50 border-accent/20 font-bold" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-primary text-xl font-bold uppercase tracking-widest">Core Disciplines</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SUBJECTS.map((subj) => (
                      <div key={subj} className={`flex items-center space-x-3 p-3 border rounded-xl transition-all ${editingTutor.subjects.includes(subj) ? 'bg-primary/20 border-primary' : 'bg-secondary/30 border-white/5'}`}>
                        <Checkbox
                          checked={editingTutor.subjects.includes(subj)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...editingTutor.subjects, subj]
                              : editingTutor.subjects.filter((s: string) => s !== subj);
                            setEditingTutor({...editingTutor, subjects: next});
                          }}
                        />
                        <span className="text-sm font-bold">{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-accent text-xl font-bold uppercase tracking-widest">Roster Assignments</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {students.map((s) => (
                      <div key={s._id} className={`flex items-center space-x-3 p-3 border rounded-xl transition-all ${editingTutor.studentIds.includes(s._id) ? 'bg-accent/20 border-accent' : 'bg-secondary/30 border-white/5'}`}>
                        <Checkbox
                          checked={editingTutor.studentIds.includes(s._id)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...editingTutor.studentIds, s._id]
                              : editingTutor.studentIds.filter((id: Id<"students">) => id !== s._id);
                            setEditingTutor({...editingTutor, studentIds: next});
                          }}
                        />
                        <span className="text-xs font-bold truncate">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-8">
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="h-16 px-8 border-white/10 font-bold uppercase" disabled={isUpdating}>Abort</Button>
              <Button onClick={handleEditSave} className="h-16 px-12 bg-primary text-white font-bold shadow-neon-red uppercase tracking-widest" disabled={isUpdating}>
                {isUpdating ? <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" /> : <Check className="mr-2" />}
                Commit Updates
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .glass-metallic { background: none !important; border: 1px solid #ccc !important; box-shadow: none !important; }
          th, td { color: black !important; border-bottom: 1px solid #eee !important; padding: 10px !important; }
          .text-glow-cyan, .text-glow-red { text-shadow: none !important; color: black !important; }
          .bg-secondary\\/80 { background: #f0f0f0 !important; }
        }
      `}} />
    </div>
  );
}