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
  const neonBorderClass = accentColor === "cyan" ? "neon-border-cyan" : "neon-border-red";
  const textAccentClass = accentColor === "cyan" ? "text-accent" : "text-primary";
  return (
    <div className="overflow-x-auto rounded-3xl glass-metallic p-1">
      <table className="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-secondary/80 h-16">
            <th className="border border-white/5 w-32 text-muted-foreground font-mono">TIME</th>
            {DAYS.map(day => (
              <th key={day} className={cn("border border-white/5 text-lg font-bold uppercase tracking-widest", textAccentClass)}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMES.map(time => (
            <tr key={time} className="h-24 hover:bg-white/5 transition-colors">
              <td className="border border-white/5 text-center font-mono text-sm text-muted-foreground bg-secondary/20">
                {time.split(" - ")[0]}
              </td>
              {DAYS.map(day => {
                const slot = getSlot(day, time);
                const isMealBreak = time.includes("13:00") || time.includes("10:00");
                return (
                  <td 
                    key={`${day}-${time}`} 
                    onClick={() => onCellClick(day, time, slot)}
                    className={cn(
                      "border border-white/5 p-2 cursor-pointer transition-all relative group",
                      slot ? (accentColor === "cyan" ? "bg-accent/20" : "bg-primary/20") : "hover:bg-white/10"
                    )}
                  >
                    {slot ? (
                      <div className="flex flex-col h-full justify-center items-center text-center">
                        <span className="text-lg font-bold text-white line-clamp-1">{slot.subject}</span>
                        {slot.notes && <span className="text-[10px] text-muted-foreground line-clamp-1">{slot.notes}</span>}
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 flex justify-center items-center h-full">
                        <span className={cn("text-xs font-bold uppercase", textAccentClass)}>+ Schedule</span>
                      </div>
                    )}
                    {isMealBreak && !slot && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                        <span className="text-[10px] uppercase font-bold text-white">Suggested Break</span>
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