import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Mail, Save, PlusCircle, Printer, Files, Send } from "lucide-react";
import { toast } from 'sonner';
import { format } from "date-fns";
import { Id } from '@convex/_generated/dataModel';
import { BrandLogo } from '@/components/BrandLogo';
function TutorScheduleReport({ tutorId, tutorName, mode }: { tutorId: Id<"tutors">, tutorName: string, mode: string }) {
  const schedule = useQuery(api.pyrox.getSchedule, { ownerId: tutorId }) ?? [];
  return (
    <div className="mb-20 page-break-after border-b border-gray-300 pb-12">
      <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
        <div className="flex items-center gap-4">
          <BrandLogo variant="icon" size={60} />
          <div>
            <h2 className="text-3xl font-extrabold text-black uppercase tracking-tighter">PyroX-iTutor Expert Deployment Dispatch</h2>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Leader ID: {tutorId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-black uppercase">{tutorName}</p>
          <p className="text-sm font-bold uppercase text-gray-500 tracking-widest">{mode} Instruction Protocol</p>
        </div>
      </div>
      <ScheduleGrid slots={schedule} onCellClick={() => {}} accentColor="red" />
      <div className="mt-8 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400">Ignite Knowledge. Inspire Futures.</p>
      </div>
    </div>
  );
}
export function TutorSchedulePage() {
  const tutors = useQuery(api.pyrox.getTutors) ?? [];
  const [selectedTutorId, setSelectedTutorId] = useState<Id<"tutors"> | null>(null);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const selectedTutor = tutors.find(t => t._id === selectedTutorId);
  const schedule = useQuery(
    api.pyrox.getSchedule, 
    selectedTutorId ? { ownerId: selectedTutorId } : "skip"
  ) ?? [];
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
  const handleCellClick = (day: string, time: string, existing?: any) => {
    if (!selectedTutorId) {
      toast.error("Select a tutor to schedule sessions.");
      return;
    }
    setActiveCell({ day, time });
    setSubject(existing?.subject || "");
    setNotes(existing?.notes || "");
    setUseCustomSubject(false);
    setDialogOpen(true);
  };
  const handleSave = async () => {
    if (!activeCell || !selectedTutorId) return;
    try {
      await upsertSlot({
        ownerId: selectedTutorId,
        ownerType: "tutor",
        day: activeCell.day,
        timeSlot: activeCell.time,
        subject,
        notes
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
    let body = `Hello ${selectedTutor.name},\n\nHere is your finalized PyroX-iTutor weekly roster dispatch:\n\n`;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach(day => {
      const daySlots = schedule.filter(s => s.day === day);
      if (daySlots.length > 0) {
        body += `[ ${day.toUpperCase()} ]\n`;
        daySlots.forEach(s => {
          body += `● ${s.timeSlot}: ${s.subject}${s.notes ? ` — Protocol: ${s.notes}` : ""}\n`;
        });
        body += `\n`;
      }
    });
    body += `\nSent via PyroX-iTutor Command Interface.\nIgnite Knowledge. Inspire Futures.`;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  };
  const emailAllSchedules = () => {
    if (tutors.length === 0) {
      toast.error("No tutors found in the roster.");
      return;
    }
    const emailTo = "nkwembeyazw@gmail.com";
    const subjectLine = `PyroX-iTutor: Aggregate Roster Dispatch ${format(new Date(), "MM/dd")}`;
    let body = `URGENT: PyroX-iTutor AGGREGATE EXPERT DISPATCH SUMMARY\n\n`;
    tutors.forEach(t => {
      body += `▶ ${t.name} (${t.mode})\n`;
      body += `  Link: ${t.contact}\n`;
      body += `--------------------------------\n\n`;
    });
    body += `\nGenerated by PyroX Automated Systems.`;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  };
  const printSingle = () => window.print();
  const printAll = () => setIsPrintingAll(true);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12 no-print">
        <header className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red animate-pulse">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-red uppercase">Tutor Dispatch</h1>
              <p className="text-muted-foreground text-lg font-medium italic">Strategic allocation of knowledge leaders via PyroX-iTutor.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/10 w-full sm:w-[300px] shadow-inner">
              <Users className="text-primary h-6 w-6" />
              <Select onValueChange={(v) => setSelectedTutorId(v as Id<"tutors">)}>
                <SelectTrigger className="w-full h-12 bg-transparent border-none text-xl font-bold text-white focus:ring-0">
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
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={sendEmail} disabled={!selectedTutorId} className="h-16 px-6 bg-white text-primary font-black shadow-xl flex-1 transition-transform active:scale-95 uppercase">
                <Mail className="mr-2 h-5 w-5" /> Email My
              </Button>
              <Button onClick={emailAllSchedules} className="h-16 px-6 bg-primary text-white font-black shadow-neon-red flex-1 transition-transform active:scale-95 uppercase">
                <Send className="mr-2 h-5 w-5" /> Email All
              </Button>
            </div>
          </div>
        </header>
        <div className="flex justify-end gap-4 no-print">
           <Button onClick={printSingle} disabled={!selectedTutorId} variant="outline" className="h-14 px-8 border-primary text-primary font-black hover:bg-primary/10 transition-transform active:scale-95 uppercase">
              <Printer className="mr-2 h-6 w-6" /> Print My Roster
           </Button>
           <Button onClick={printAll} className="h-14 px-8 bg-primary text-white font-black shadow-neon-red transition-transform active:scale-95 uppercase">
              <Files className="mr-2 h-6 w-6" /> Print All Experts
           </Button>
        </div>
        {selectedTutorId ? (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-bold text-primary uppercase tracking-widest">Deployment Roster: {selectedTutor?.name}</h3>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Protocol: Active Deployment</span>
            </div>
            <ScheduleGrid slots={schedule} onCellClick={handleCellClick} accentColor="red" />
          </div>
        ) : (
          <div className="glass-metallic h-[600px] flex flex-col items-center justify-center rounded-3xl border-dashed border-2 border-primary/30 space-y-6">
            <BookOpen className="h-32 w-32 text-primary/20 animate-pulse" />
            <h2 className="text-3xl font-bold text-muted-foreground text-center uppercase tracking-widest">Enlist an expert to coordinate their timeline</h2>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-metallic neon-border-red border-2 sm:max-w-[500px] p-8" aria-describedby="tutor-dialog-desc">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">Deploy Expert</DialogTitle>
              <DialogDescription id="tutor-dialog-desc" className="text-primary font-mono uppercase font-bold">{activeCell?.day} // {activeCell?.time}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-lg font-bold text-white uppercase tracking-widest text-xs">Target Module</Label>
                {useCustomSubject ? (
                  <div className="flex gap-2">
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white font-bold" placeholder="Define target module..." autoFocus />
                    <Button variant="ghost" onClick={() => setUseCustomSubject(false)} className="h-14 text-xs text-primary uppercase font-bold">List</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-14 bg-secondary/50 border-primary/30 text-white font-bold">
                        <SelectValue placeholder="Select expert field..." />
                      </SelectTrigger>
                      <SelectContent className="glass-metallic border-primary/20">
                        {selectedTutor?.subjects.map(s => (
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
                <Label className="text-lg font-bold text-white uppercase tracking-widest text-xs">Deployment Protocol</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white font-bold" placeholder="E.g. Focus on Objective 7" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-16 text-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-neon-red uppercase tracking-widest">
                <Save className="mr-2 h-6 w-6" /> Confirm Deployment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="hidden print:block print-section p-10 bg-white text-black">
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