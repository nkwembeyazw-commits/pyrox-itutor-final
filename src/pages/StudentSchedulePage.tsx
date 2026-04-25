import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Save, PlusCircle, Printer, Files, ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { Id, Doc } from '@convex/_generated/dataModel';
import { BrandLogo } from '@/components/BrandLogo';
import { Link } from 'react-router-dom';
function ScheduleReport({ studentId, studentName, level }: { studentId: Id<"students">, studentName: string, level: string }) {
  const schedule = useQuery(api.pyrox.getSchedule, { ownerId: studentId }) ?? [];
  return (
    <div className="page-break mb-12 p-4 text-black">
      <div className="flex justify-between items-center border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-6">
          <BrandLogo variant="icon" size={60} className="invert" />
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">PyroX Student Schedule</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Learner Protocol ID: {studentId.slice(0, 8)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black uppercase">{studentName}</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded">{level} Tier</span>
          </div>
        </div>
      </div>
      <div className="border border-black">
        <ScheduleGrid slots={schedule} onCellClick={() => {}} accentColor="cyan" />
      </div>
      <div className="mt-12 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">
        <span>Generated: {new Date().toLocaleDateString()}</span>
        <span>Ignite Knowledge. Inspire Futures.</span>
        <span>© PyroX Systems</span>
      </div>
    </div>
  );
}
export function StudentSchedulePage() {
  const studentsRaw = useQuery(api.pyrox.getStudents);
  const students = useMemo(() => studentsRaw ?? [], [studentsRaw]);
  const [selectedStudentId, setSelectedStudentId] = useState<Id<"students"> | null>(null);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const schedule = useQuery(
    api.pyrox.getSchedule,
    selectedStudentId ? { ownerId: selectedStudentId } : "skip"
  ) ?? [];
  const selectedStudent = useMemo(() => students.find(s => s._id === selectedStudentId), [students, selectedStudentId]);
  const upsertSlot = useMutation(api.pyrox.upsertScheduleSlot);
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
  const handleCellClick = (day: string, time: string, existing?: Doc<"schedules">) => {
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 no-print">
        <div className="flex justify-start">
          <Button asChild variant="ghost" className="text-accent hover:text-accent/80 font-bold gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-accent p-4 rounded-2xl shadow-neon-cyan animate-pulse">
              <Calendar className="h-8 w-8 md:h-10 md:w-10 text-background" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-display tracking-tight text-glow-cyan uppercase leading-tight">Student Schedule</h1>
              <p className="text-muted-foreground text-sm md:text-lg font-medium italic">Academic success timeline via PyroX.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/10 flex-1 lg:w-[300px]">
              <GraduationCap className="text-accent h-6 w-6 shrink-0" />
              <Select onValueChange={(v) => setSelectedStudentId(v as Id<"students">)}>
                <SelectTrigger className="w-full h-10 bg-transparent border-none text-lg font-bold text-white focus:ring-0">
                  <SelectValue placeholder="Identify Student" />
                </SelectTrigger>
                <SelectContent className="glass-metallic border-accent/20 backdrop-blur-3xl z-[100]">
                  {students.map(s => (
                    <SelectItem key={s._id} value={s._id} className="text-lg font-bold text-white hover:bg-accent/20 cursor-pointer uppercase tracking-tight">
                      {s.name} [{s.level}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button onClick={() => window.print()} disabled={!selectedStudentId} className="h-14 px-4 bg-accent text-background font-black shadow-neon-cyan flex-1 transition-transform active:scale-95 uppercase text-xs">
                <Printer className="mr-2 h-4 w-4" /> Print Current
              </Button>
              <Button onClick={() => setIsPrintingAll(true)} variant="outline" className="h-14 px-4 border-accent text-accent font-black hover:bg-accent/10 flex-1 transition-transform active:scale-95 uppercase text-xs">
                <Files className="mr-2 h-4 w-4" /> Print Batch
              </Button>
            </div>
          </div>
        </header>
        {selectedStudentId ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base md:text-xl font-bold text-accent uppercase tracking-widest truncate max-w-[70%]">Timeline: {selectedStudent?.name}</h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase hidden sm:inline">Sync Status: Optimized</span>
            </div>
            <div className="rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <ScheduleGrid slots={schedule} onCellClick={handleCellClick} accentColor="cyan" />
            </div>
          </div>
        ) : (
          <div className="glass-metallic h-[400px] md:h-[600px] flex flex-col items-center justify-center rounded-3xl border-dashed border-2 border-accent/30 space-y-6">
            <Calendar className="h-20 w-20 md:h-24 md:w-24 text-accent/20 animate-pulse" />
            <h2 className="text-xl md:text-3xl font-bold text-muted-foreground text-center uppercase tracking-widest px-4">Identify a learner to visualize trajectory</h2>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-metallic neon-border-cyan border-2 sm:max-w-[500px] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-tighter leading-none">Schedule Session</DialogTitle>
              <DialogDescription className="text-accent font-mono uppercase font-bold text-xs mt-2">{activeCell?.day} // {activeCell?.time}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white uppercase tracking-widest">Module ID</Label>
                {useCustomSubject ? (
                  <div className="flex gap-2">
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-14 bg-secondary/50 border-accent/30 text-white font-bold" placeholder="Identify module..." autoFocus />
                    <Button variant="ghost" onClick={() => setUseCustomSubject(false)} className="h-14 text-xs text-accent uppercase font-bold">List</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-14 bg-secondary/50 border-accent/30 text-white font-bold">
                        <SelectValue placeholder="Choose module..." />
                      </SelectTrigger>
                      <SelectContent className="glass-metallic border-accent/20">
                        {selectedStudent?.subjects.map(s => (
                          <SelectItem key={s} value={s} className="font-bold">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => { setUseCustomSubject(true); setSubject(""); }} className="text-left text-[10px] text-accent/70 hover:text-accent flex items-center gap-1 uppercase font-bold tracking-widest">
                      <PlusCircle className="h-3 w-3" /> Insert external module
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white uppercase tracking-widest">Session Protocol</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-14 bg-secondary/50 border-accent/30 text-white font-bold" placeholder="Focus Notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-16 text-lg font-bold bg-accent text-background hover:bg-accent/90 shadow-neon-cyan uppercase tracking-widest">
                <Save className="mr-2 h-6 w-6" /> Commit Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden print:block print-section p-0 bg-white">
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