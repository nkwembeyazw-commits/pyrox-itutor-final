import React, { useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle, ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { calculateNextDue, isOverdue } from '@/lib/utils';
import { Id } from '@convex/_generated/dataModel';
export function PaymentsDuesPage() {
  const studentsRaw = useQuery(api.pyrox.getStudents);
  const markAsPaid = useMutation(api.pyrox.markStudentAsPaid);
  const studentsWithDueDates = useMemo(() => {
    const students = studentsRaw ?? [];
    return students.map(s => {
      const nextDueDate = calculateNextDue(s.lastPaidDate, s.paymentInterval, s.createdAt);
      return {
        ...s,
        nextDueDate,
        isOverdue: isOverdue(nextDueDate),
      };
    }).sort((a, b) => a.nextDueDate - b.nextDueDate);
  }, [studentsRaw]);
  const handleProcessPayment = async (id: Id<"students">) => {
    try {
      await markAsPaid({ id });
      toast.success("Transaction verified. Account updated.");
    } catch (e) {
      toast.error("Process failed.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <div className="flex justify-start no-print">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 print:hidden">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-4 rounded-2xl shadow-neon-red shrink-0 animate-pulse">
              <DollarSign className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white font-display tracking-tight text-glow-red uppercase leading-tight">Payments & Dues</h1>
              <p className="text-muted-foreground text-sm md:text-lg italic font-medium">Financial Monitoring Mainframe.</p>
            </div>
          </div>
          <div className="flex gap-4 w-full xl:w-auto">
            <Button onClick={() => window.print()} variant="outline" className="h-14 px-8 border-accent text-accent hover:bg-accent hover:text-background font-bold flex-1 transition-all">
              <Printer className="mr-3 h-6 w-6" /> Print Report
            </Button>
          </div>
        </header>
        <div className="glass-metallic neon-border-cyan rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-secondary/80 border-b border-white/10">
                <TableRow className="h-20 hover:bg-transparent">
                  <TableHead className="text-sm md:text-xl font-bold text-white px-8 uppercase tracking-widest">Learner</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Billing</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Last Credit</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white uppercase tracking-widest">Due Protocol</TableHead>
                  <TableHead className="text-sm md:text-xl font-bold text-white text-right px-8 print:hidden uppercase tracking-widest">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsWithDueDates.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-32 text-xl text-muted-foreground font-mono">No financial records detected.</TableCell></TableRow>
                ) : (
                  studentsWithDueDates.map((student) => (
                    <TableRow
                      key={student._id}
                      className={`h-24 transition-colors border-b border-white/5 group ${student.isOverdue ? "bg-primary/5 hover:bg-primary/10 border-primary/20" : "hover:bg-white/5"}`}
                    >
                      <TableCell className="px-8">
                        <div className="flex flex-col">
                          <span className={`text-lg md:text-2xl font-bold font-display tracking-tight uppercase ${student.isOverdue ? "text-primary text-glow-red" : "text-white"}`}>
                            {student.name}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{student.level} Tier</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full bg-secondary text-accent text-xs font-black uppercase tracking-tighter">
                          {student.paymentInterval || "monthly"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm md:text-lg text-muted-foreground font-mono">
                        {student.lastPaidDate ? format(student.lastPaidDate, "MMM dd, yyyy") : "No History"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {student.isOverdue && <AlertTriangle className="h-4 w-4 text-primary animate-bounce shrink-0" />}
                          <span className={`text-lg font-black uppercase tracking-tight ${student.isOverdue ? "text-primary drop-shadow-neon-red" : "text-accent"}`}>
                            {format(student.nextDueDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 text-right print:hidden">
                        <Button
                          onClick={() => handleProcessPayment(student._id)}
                          className={`h-12 px-6 font-bold uppercase transition-all rounded-xl ${student.isOverdue ? "bg-primary shadow-neon-red hover:scale-105" : "bg-accent text-background hover:bg-accent/80"}`}
                        >
                          <CheckCircle className="mr-2 h-5 w-5" /> Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}