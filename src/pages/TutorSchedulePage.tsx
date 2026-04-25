import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Mail, Save, PlusCircle } from "lucide-react";
import { toast } from 'sonner';
import { Id } from '@convex/_generated/dataModel';
export function TutorSchedulePage() {
  const tutors = useQuery(api.pirox.getTutors) ?? [];
  const [selectedTutorId, setSelectedTutorId] = useState<Id<"tutors"> | null>(null);
  const selectedTutor = tutors.find(t => t._id === selectedTutorId);
  const schedule = useQuery(api.pirox.getSchedule, { ownerId: selectedTutorId as any }) ?? [];
  const upsertSlot = useMutation(api.pirox.upsertScheduleSlot);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ day: string; time: string } | null>(null);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [useCustomSubject, setUseCustomSubject] = useState(false);
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
    const tutor = tutors.find(t => t._id === selectedTutorId);
    if (!tutor) return;
    const emailTo = "nkwembeyazw@gmail.com";
    const subjectLine = `PyroX iTutor: Weekly Schedule for ${tutor.name}`;
    let body = `Hello ${tutor.name},\n\nHere is your finalized weekly roster:\n\n`;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    days.forEach(day => {
      const daySlots = schedule.filter(s => s.day === day);
      if (daySlots.length > 0) {
        body += `--- ${day.toUpperCase()} ---\n`;
        daySlots.forEach(s => {
          body += `${s.timeSlot}: ${s.subject}${s.notes ? ` (${s.notes})` : ""}\n`;
        });
        body += `\n`;
      }
    });
    body += `\nSent via PyroX-iTutor Management Systems.`;
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-display tracking-tight text-glow-red">Tutor Dispatch</h1>
              <p className="text-muted-foreground text-lg">Strategic allocation of knowledge leaders.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/10 w-full sm:w-[350px]">
              <Users className="text-primary h-6 w-6" />
              <Select onValueChange={(v) => setSelectedTutorId(v as Id<"tutors">)}>
                <SelectTrigger className="w-full h-12 bg-transparent border-none text-xl font-bold text-white focus:ring-0">
                  <SelectValue placeholder="Select Expert" />
                </SelectTrigger>
                <SelectContent className="glass-metallic border-primary/20 backdrop-blur-3xl z-[100]">
                  {tutors.map(t => (
                    <SelectItem key={t._id} value={t._id} className="text-lg font-bold text-white hover:bg-primary/20 cursor-pointer">
                      {t.name} ({t.mode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTutorId && (
              <Button onClick={sendEmail} className="h-16 px-8 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-xl w-full sm:w-auto">
                <Mail className="mr-3 h-6 w-6" /> Email Dispatch
              </Button>
            )}
          </div>
        </div>
        {selectedTutorId ? (
          <ScheduleGrid slots={schedule} onCellClick={handleCellClick} accentColor="red" />
        ) : (
          <div className="glass-metallic h-[600px] flex flex-col items-center justify-center rounded-3xl border-dashed border-2 border-primary/30 space-y-6">
            <BookOpen className="h-32 w-32 text-primary/20 animate-pulse" />
            <h2 className="text-3xl font-bold text-muted-foreground text-center">Enlist an expert to coordinate their timeline.</h2>
          </div>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="glass-metallic neon-border-red border-2 sm:max-w-[500px] p-8">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white mb-2">Deploy Expert</DialogTitle>
              <p className="text-primary font-mono">{activeCell?.day} at {activeCell?.time}</p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-lg font-bold text-white">Project / Module</Label>
                {useCustomSubject ? (
                  <div className="flex gap-2">
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white" placeholder="Enter custom subject..." autoFocus />
                    <Button variant="ghost" onClick={() => setUseCustomSubject(false)} className="h-14 text-xs text-primary">List</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-14 bg-secondary/50 border-primary/30 text-white">
                        <SelectValue placeholder="Select expert field..." />
                      </SelectTrigger>
                      <SelectContent className="glass-metallic border-primary/20">
                        {selectedTutor?.subjects.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button onClick={() => { setUseCustomSubject(true); setSubject(""); }} className="text-left text-sm text-primary/70 hover:text-primary flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" /> Add custom module
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-bold text-white">Deployment Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-14 bg-secondary/50 border-primary/30 text-white" placeholder="Focus on Quantum Mechanics" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-16 text-xl font-bold bg-primary text-white hover:bg-primary/90 shadow-neon-red">
                <Save className="mr-2 h-6 w-6" /> Confirm Deployment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}