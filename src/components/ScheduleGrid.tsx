import React from "react";
import { cn } from "@/lib/utils";
interface SlotData {
  day: string;
  timeSlot: string;
  subject?: string;
  notes?: string;
}
interface ScheduleGridProps {
  slots: SlotData[];
  onCellClick: (day: string, timeSlot: string, existing?: SlotData) => void;
  accentColor?: "cyan" | "red";
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = [
  "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
  "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
  "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"
];
export function ScheduleGrid({ slots, onCellClick, accentColor = "cyan" }: ScheduleGridProps) {
  const getSlot = (day: string, timeSlot: string) =>
    slots.find(s => s.day === day && s.timeSlot === timeSlot);
  const textAccentClass = accentColor === "cyan" ? "text-accent" : "text-primary";
  const glowClass = accentColor === "cyan" ? "shadow-neon-cyan border-accent/40" : "shadow-neon-red border-primary/40";
  return (
    <div className="overflow-x-auto rounded-3xl glass-metallic p-1">
      <table className="w-full border-collapse min-w-[1100px] table-fixed">
        <thead>
          <tr className="bg-secondary/80 h-16">
            <th className="border border-white/5 w-28 text-muted-foreground font-mono text-sm">TIME</th>
            {DAYS.map(day => (
              <th key={day} className={cn("border border-white/5 text-base font-bold uppercase tracking-widest", textAccentClass)}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map(time => (
            <tr key={time} className="h-28 hover:bg-white/5 transition-colors">
              <td className="border border-white/5 text-center font-mono text-xs text-muted-foreground bg-secondary/20">
                {time}
              </td>
              {DAYS.map(day => {
                const slot = getSlot(day, time);
                const isMealBreak = time.includes("13:00") || time.includes("10:00");
                return (
                  <td
                    key={`${day}-${time}`}
                    onClick={() => onCellClick(day, time, slot)}
                    className={cn(
                      "border border-white/5 p-3 cursor-pointer transition-all relative group",
                      slot ? (accentColor === "cyan" ? "bg-accent/30" : "bg-primary/30") : "hover:bg-white/10",
                      slot && glowClass
                    )}
                  >
                    {slot ? (
                      <div className="flex flex-col h-full justify-center items-center text-center space-y-1">
                        <span className="text-base font-bold text-white break-words leading-tight">{slot.subject}</span>
                        {slot.notes && <span className="text-[10px] text-muted-foreground leading-tight italic line-clamp-2">{slot.notes}</span>}
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 flex justify-center items-center h-full">
                        <span className={cn("text-xs font-bold uppercase", textAccentClass)}>+ Schedule</span>
                      </div>
                    )}
                    {isMealBreak && !slot && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <span className="text-[10px] uppercase font-bold text-white/50 tracking-tighter rotate-12">Recess</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}