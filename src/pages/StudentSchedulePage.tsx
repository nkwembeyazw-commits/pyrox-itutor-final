import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Save, PlusCircle, Printer, Files } from "lucide-react";
import { toast } from 'sonner';
import { Id } from '@convex/_generated/dataModel';
function ScheduleReport({ studentId, studentName, level }: { studentId: Id<"students">, studentName: string, level: string }) {
  const schedule = useQuery(api.pirox.getSchedule, { ownerId: studentId }) ?? [];
  return (
    <div className="mb-20 page-break-after border-b border-gray-200 pb-10">
      <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-black uppercase tracking-tighter">iTutor Student Schedule</h2>
          <p className="text-sm font-mono text-gray-600">ID: {studentId}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black">{studentName}</p>
          <p className="text-md font-bold uppercase text-gray-500">{level}</p>
        </div>
      </div>
      <ScheduleGrid slots={schedule} onCellClick={() => {}} accentColor="cyan" />
    </div>
  );
}
export function StudentSchedulePage() {
  const students = useQuery(api.pirox.getStudents) ?? [];
  const [selectedStudentId, setSelectedStudentId] = useState<Id<"students"> | null>(null);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const queryArgs = selectedStudentId ? { ownerId: selectedStudentId } : "skip";
  const schedule = useQuery(api.pirox.getSchedule, queryArgs === "skip" ? "skip" : queryArgs) ?? [];
  const selectedStudent = students.find(s => s._id === selectedStudentId);
  const upsertSlot = useMutation(api.pirox.upsertScheduleSlot);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ day: string; time: string } | null>(null);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  useEffect(() => {
    if (isPrintingAll) {
      const timer = setTimeout(() => {
        window.print();
        setIsPrintingAll(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrintingAll]);
  const handleCellClick = (day: string, time: string, existing?: any) => {
    if (!selectedStudentId) {
      toast.error("Please select a student first.");
      return;
    }
    setActiveCell({ day, time });
    setSubject(existing?.subject || "");
    setNotes(existing?.notes || "");
    setUseCustomSubject(false);
    setDialogOpen(true);
  };
  const handleSave = async () => {
    if (!activeCell || !selectedStudentId) return;
    try {
      await upsertSlot({
        ownerId: selectedStudentId,
        ownerType: "student",
        day: activeCell.day,
        timeSlot: activeCell.time,
        subject,
        notes
      });
      toast.success("Schedule updated!");
      setDialogOpen(false);
    } catch (e) {
      toast.error("Failed to save slot.");
    }
  };
  const printSingle = () => window.print();
  const printAll = () => setIsPrintingAll(true);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12 no-print">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-accent p-4 rounded-2xl shadow-neon-cyan">
              <Calendar className="h-10 w-10 text-background" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-cyan">Student Schedule</h1>
              <p className="text-muted-foreground text-lg">Timeline of academic success.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/10 w-full sm:w-[300px]">
              <GraduationCap className="text-accent h-6 w-6" />
              <Select onValueChange={(v) => setSelectedStudentId(v as Id<"students">)}>
                <SelectTrigger className="w-full h-12 bg-transparent border-none text-xl font-bold text-white focus:ring-0">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent className="glass-metallic border-accent/20 backdrop-blur-3xl z-[100]">
                  {students.map(s => (
                    <SelectItem key={s._id} value={s._id} className="text-lg font-bold text-white hover:bg-accent/20 cursor-pointer">
                      {s.name} ({s.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={printSingle} disabled={!selectedStudentId} className="h-16 px-6 bg-accent text-background font-bold shadow-neon-cyan flex-1 transition-transform active:scale-95">
                <Printer className="mr-2 h-5 w-5" /> Print My
              </Button>
              <Button onClick={printAll} variant="outline" className="h-16 px-6 border-accent text-accent font-bold hover:bg-accent/10 flex-1 transition-transform active:scale-95">
                <Files className="mr-2 h-5 w-5" /> Print All
              </Button>
            </div>
          </div>
        </div>
        {selectedStudentId ? (
          <ScheduleGrid slots={schedule} onCellClick={handleCellClick} accentColor="cyan" />
        ) : (
          <div className="glass-metallic h-[600px] flex flex-col items-center justify-center rounded-3xl border-dashed border-2 border-accent/30 space-y-6">
            <Calendar className="h-32 w-32 text-accent/20 animate-pulse" />
            <h2 className="text-3xl font-bold text-muted-foreground">Select a student to view their trajectory.</h2>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-metallic neon-border-cyan border-2 sm:max-w-[500px] p-8" aria-describedby="student-dialog-desc">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-2">Schedule Session</DialogTitle>
              <DialogDescription id="student-dialog-desc" className="text-accent font-mono">{activeCell?.day} at {activeCell?.time}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-lg font-bold text-white">Module Selection</Label>
                {useCustomSubject ? (
                  <div className="flex gap-2">
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-14 bg-secondary/50 border-accent/30 text-white" placeholder="Enter custom subject..." autoFocus />
                    <Button variant="ghost" onClick={() => setUseCustomSubject(false)} className="h-14 text-xs text-accent">Select List</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-14 bg-secondary/50 border-accent/30 text-white">
                        <SelectValue placeholder="Choose module..." />
                      </SelectTrigger>
                      <SelectContent className="glass-metallic border-accent/20">
                        {selectedStudent?.subjects.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => { setUseCustomSubject(true); setSubject(""); }} className="text-left text-sm text-accent/70 hover:text-accent flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" /> Use custom subject
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-bold text-white">Session Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-14 bg-secondary/50 border-accent/30 text-white" placeholder="Chapter 5: Calculus basics" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-16 text-xl font-bold bg-accent text-background hover:bg-accent/90 shadow-neon-cyan">
                <Save className="mr-2 h-6 w-6" /> Commit Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden print:block print-section p-10 bg-white text-black">
        {isPrintingAll ? (
          students.map(s => (
            <ScheduleReport
              key={s._id}
              studentId={s._id}
              studentName={s.name}
              level={s.level}
            />
          ))
        ) : selectedStudentId ? (
          <ScheduleReport
            studentId={selectedStudentId}
            studentName={selectedStudent?.name || "Learner"}
            level={selectedStudent?.level || "Core Tier"}
          />
        ) : null}
      </div>
    </div>
  );
}