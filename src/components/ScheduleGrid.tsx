import React from "react";
import { cn } from "@/lib/utils";
interface SlotData {
  day: string;
  timeSlot: string;
  subject?: string;
  notes?: string;
  studentName?: string;
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
  const glowClass = accentColor === "cyan" ? "shadow-neon-cyan border-accent/60" : "shadow-neon-red border-primary/60";
  const slotBgClass = accentColor === "cyan" ? "bg-accent/40" : "bg-primary/40";
  return (
    <div className="overflow-x-auto rounded-3xl glass-metallic p-1">
      <table className="w-full border-collapse min-w-[1100px] table-fixed">
        <thead>
          <tr className="bg-secondary/80 h-16">
            <th className="border border-white/5 w-28 text-muted-foreground font-mono text-xs">TIME</th>
            {DAYS.map(day => (
              <th key={day} className={cn("border border-white/5 text-sm font-bold uppercase tracking-widest", textAccentClass)}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map(time => (
            <tr key={time} className="h-28 hover:bg-white/5 transition-colors">
              <td className="border border-white/5 text-center font-mono text-[10px] text-muted-foreground bg-secondary/20">
                {time}
              </td>
              {DAYS.map(day => {
                const slot = getSlot(day, time);
                const isMealBreak = time.startsWith("10:00") || time.startsWith("13:00");
                return (
                  <td
                    key={`${day}-${time}`}
                    onClick={() => onCellClick(day, time, slot)}
                    className={cn(
                      "border border-white/5 p-3 cursor-pointer transition-all relative group",
                      slot ? slotBgClass : "hover:bg-white/10",
                      slot && glowClass
                    )}
                  >
                    {slot ? (
                      <div className="flex flex-col h-full justify-center items-center text-center space-y-1">
                        {slot.studentName && (
                          <span className={cn("text-[11px] font-black uppercase leading-none truncate max-w-full drop-shadow-sm", textAccentClass)}>
                            {slot.studentName}
                          </span>
                        )}
                        <span className="text-sm font-black text-white truncate max-w-full leading-tight">
                          {slot.subject}
                        </span>
                        {slot.notes && (
                          <span className="text-[10px] text-white/70 leading-tight italic line-clamp-2 px-1 font-medium">
                            {slot.notes}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 flex justify-center items-center h-full">
                        <span className={cn("text-[10px] font-bold uppercase", textAccentClass)}>+ Allocate</span>
                      </div>
                    )}
                    {isMealBreak && !slot && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <span className="text-[9px] uppercase font-bold text-white/50 tracking-[0.2em] rotate-12">System Recess</span>
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