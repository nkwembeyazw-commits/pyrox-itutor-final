import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Mail, Save, PlusCircle, Printer, Files, ArrowLeft } from "lucide-react";
import { toast } from 'sonner';
import { Id, Doc } from '@convex/_generated/dataModel';
import { BrandLogo } from '@/components/BrandLogo';
import { Link } from 'react-router-dom';
function TutorScheduleReport({ tutorId, tutorName, mode }: { tutorId: Id<"tutors">, tutorName: string, mode: string }) {
  const schedule = useQuery(api.pyrox.getSchedule, { ownerId: tutorId }) ?? [];
  return (
    <div className="page-break mb-12 p-4 text-black">
      <div className="flex justify-between items-center border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-6">
          <BrandLogo variant="icon" size={60} className="invert" />
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">PyroX Expert Dispatch</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Expert ID: {tutorId.slice(0, 8)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black uppercase">{tutorName}</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded">{mode} Protocol</span>
          </div>
        </div>
      </div>
      <div className="border border-black">
        <ScheduleGrid slots={schedule} onCellClick={() => {}} accentColor="red" />
      </div>
      <div className="mt-12 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">
        <span>Report Auth: {new Date().toLocaleDateString()}</span>
        <span>Ignite Knowledge. Inspire Futures.</span>
        <span>© PyroX Systems</span>
      </div>
    </div>
  );
}
export function TutorSchedulePage() {
  const tutorsRaw = useQuery(api.pyrox.getTutors);
  const studentsRaw = useQuery(api.pyrox.getStudents);
  const tutors = useMemo(() => tutorsRaw ?? [], [tutorsRaw]);
  const students = useMemo(() => studentsRaw ?? [], [studentsRaw]);
  const [selectedTutorId, setSelectedTutorId] = useState<Id<"tutors"> | null>(null);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const selectedTutor = useMemo(() => tutors.find(t => t._id === selectedTutorId), [tutors, selectedTutorId]);
  const schedule = useQuery(
    api.pyrox.getSchedule,
    selectedTutorId ? { ownerId: selectedTutorId } : "skip"
  ) ?? [];
  const upsertSlot = useMutation(api.pyrox.upsertScheduleSlot);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ day: string; time: string } | null>(null);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<Id<"students"> | "none">("none");
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
  const assignedStudents = useMemo(() => {
    if (!selectedTutor || !students) return [];
    return students.filter(s => selectedTutor.studentIds?.includes(s._id));
  }, [selectedTutor, students]);
  const handleCellClick = (day: string, time: string, existing?: Doc<"schedules">) => {
    if (!selectedTutorId) {
      toast.error("Select a tutor to schedule sessions.");
      return;
    }
    setActiveCell({ day, time });
    setSubject(existing?.subject || "");
    setNotes(existing?.notes || "");
    setSelectedStudentId(existing?.studentId || "none");
    setUseCustomSubject(false);
    setDialogOpen(true);
  };
  const handleSave = async () => {
    if (!activeCell || !selectedTutorId) return;
    const targetStudent = students.find(s => s._id === selectedStudentId);
    if (selectedStudentId !== "none" && !targetStudent) {
      toast.error("Learner reference is invalid or missing.");
      return;
    }
    try {
      await upsertSlot({
        ownerId: selectedTutorId,
        ownerType: "tutor",
        day: activeCell.day,
        timeSlot: activeCell.time,
        subject,
        notes,
        studentId: selectedStudentId === "none" ? undefined : selectedStudentId as Id<"students">,
        studentName: targetStudent?.name,
      });
      toast.success("Tutor roster updated!");
      setDialogOpen(false);
    } catch (e) {
      toast.error("Sync failed.");
    }
  };
  const sendEmail = () => {
    if (!selectedTutor) return;
    const emailTo = "nkwembeyazw@gmail.com";
    const subjectLine = `PyroX-iTutor: Deployment Schedule for ${selectedTutor.name}`;
    let body = `Hello ${selectedTutor.name},\n\nHere is your PyroX-iTutor weekly roster dispatch:\n\n`;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach(day => {
      const daySlots = schedule.filter(s => s.day === day);
      if (daySlots.length > 0) {
        body += `[ ${day.toUpperCase()} ]\n`;
        daySlots.forEach(s => {
          body += `● ${s.timeSlot}: ${s.subject}${s.studentName ? ` (Student: ${s.studentName})` : ""}${s.notes ? ` — Protocol: ${s.notes}` : ""}\n`;
        });
        body += `\n`;
      }
    });
    body += `\nSent via PyroX-iTutor Command Interface.`;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 no-print">
        <div className="flex justify-start">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold gap-2 hover:bg-primary/10">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red shrink-0">
              <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-display tracking-tight text-glow-red uppercase leading-tight">Tutor Dispatch</h1>
              <p className="text-muted-foreground text-sm md:text-lg font-medium italic">Strategic allocation of knowledge leaders.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/10 flex-1 xl:w-[300px]">
              <Users className="text-primary h-6 w-6 shrink-0" />
              <Select onValueChange={(v) => setSelectedTutorId(v as Id<"tutors">)}>
                <SelectTrigger className="w-full h-10 bg-transparent border-none text-lg font-bold text-white focus:ring-0">
                  <SelectValue placeholder="Enlist Expert" />
                </SelectTrigger>
                <SelectContent className="glass-metallic border-primary/20 backdrop-blur-3xl z-[100]">
                  {tutors.map(t => (
                    <SelectItem key={t._id} value={t._id} className="text-lg font-bold text-white hover:bg-primary/20 cursor-pointer uppercase tracking-tight">
                      {t.name} [{t.mode}]
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button onClick={sendEmail} disabled={!selectedTutorId} className="h-14 px-4 bg-white text-primary font-black shadow-xl flex-1 transition-transform active:scale-95 uppercase text-xs">
                <Mail className="mr-2 h-4 w-4" /> Email Dispatch
              </Button>
              <Button onClick={() => window.print()} disabled={!selectedTutorId} className="h-14 px-4 bg-primary text-white font-black shadow-neon-red flex-1 transition-transform active:scale-95 uppercase text-xs">
                <Printer className="mr-2 h-4 w-4" /> Print Dispatch
              </Button>
              <Button onClick={() => setIsPrintingAll(true)} variant="outline" className="h-14 px-4 border-primary text-primary font-black hover:bg-primary/10 flex-1 transition-transform active:scale-95 uppercase text-xs">
                <Files className="mr-2 h-4 w-4" /> Print Batch
              </Button>
            </div>
          </div>
        </header>
        {selectedTutorId ? (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
              <h3 className="text-base md:text-xl font-bold text-primary uppercase tracking-widest truncate max-w-[70%]">Deployment: {selectedTutor?.name}</h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest hidden sm:inline">Active Dispatch Protocol</span>
            </div>
            <div className="rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <ScheduleGrid slots={schedule} onCellClick={handleCellClick} accentColor="red" />
            </div>
          </div>
        ) : (
          <div className="glass-metallic h-[400px] md:h-[600px] flex flex-col items-center justify-center rounded-3xl border-dashed border-2 border-primary/30 space-y-6">
            <BookOpen className="h-20 w-20 md:h-24 md:w-24 text-primary/20 animate-pulse" />
            <h2 className="text-xl md:text-3xl font-bold text-muted-foreground text-center uppercase tracking-widest px-4">Enlist an expert to coordinate deployment</h2>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-metallic neon-border-red border-2 sm:max-w-[500px] p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-tighter leading-none">Deploy Expert</DialogTitle>
              <DialogDescription className="text-primary font-mono uppercase font-bold text-xs mt-2">{activeCell?.day} // {activeCell?.time}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white uppercase tracking-widest">Assigned Learner</Label>
                <Select value={selectedStudentId} onValueChange={(v) => setSelectedStudentId(v as Id<"students"> | "none")}>
                  <SelectTrigger className="h-14 bg-secondary/50 border-primary/30 text-white font-bold">
                    <SelectValue placeholder="Select student context..." />
                  </SelectTrigger>
                  <SelectContent className="glass-metallic border-primary/20">
                    <SelectItem value="none" className="font-bold italic">No Student Context</SelectItem>
                    {assignedStudents.map(s => (
                      <SelectItem key={s._id} value={s._id} className="font-bold">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white uppercase tracking-widest">Target Module</Label>
                {useCustomSubject ? (
                  <div className="flex gap-2">
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white font-bold" placeholder="Define module..." autoFocus />
                    <Button variant="ghost" onClick={() => setUseCustomSubject(false)} className="h-14 text-xs text-primary uppercase font-bold">List</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-14 bg-secondary/50 border-primary/30 text-white font-bold">
                        <SelectValue placeholder="Select module..." />
                      </SelectTrigger>
                      <SelectContent className="glass-metallic border-primary/20">
                        {selectedTutor?.subjects?.map(s => (
                          <SelectItem key={s} value={s} className="font-bold">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => { setUseCustomSubject(true); setSubject(""); }} className="text-left text-[10px] text-primary/70 hover:text-primary flex items-center gap-1 uppercase font-bold tracking-widest">
                      <PlusCircle className="h-3 w-3" /> Add external objective
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white uppercase tracking-widest">Deployment Protocol</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white font-bold" placeholder="Focus Notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-16 text-lg font-bold bg-primary text-white hover:bg-primary/90 shadow-neon-red uppercase tracking-widest">
                <Save className="mr-2 h-6 w-6" /> Confirm Deployment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden print:block print-section p-0 bg-white">
        {isPrintingAll ? (
          tutors.map(t => (
            <TutorScheduleReport
              key={t._id}
              tutorId={t._id}
              tutorName={t.name}
              mode={t.mode}
            />
          ))
        ) : selectedTutorId ? (
          <TutorScheduleReport
            tutorId={selectedTutorId}
            tutorName={selectedTutor?.name || "Expert"}
            mode={selectedTutor?.mode || "Instruction"}
          />
        ) : null}
      </div>
    </div>
  );
}