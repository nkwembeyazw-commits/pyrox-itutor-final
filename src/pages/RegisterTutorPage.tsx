import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';
const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science", "Business"
];
const tutorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contact: z.string().min(5, "Contact info is required"),
  mode: z.string().min(1, "Mode is required"),
  rate: z.coerce.number().positive("Rate must be positive"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  studentIds: z.array(z.string()).default([]),
});
type TutorForm = z.infer<typeof tutorSchema>;
export function RegisterTutorPage() {
  const createTutor = useMutation(api.pirox.createTutor);
  const students = useQuery(api.pirox.getStudents) ?? [];
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TutorForm>({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      name: "",
      contact: "",
      mode: "",
      rate: 0,
      subjects: [],
      studentIds: []
    }
  });
  const selectedSubjects = watch("subjects") || [];
  const selectedStudents = watch("studentIds") || [];
  const onSubmit = async (data: TutorForm) => {
    try {
      await createTutor({
        name: data.name,
        contact: data.contact,
        mode: data.mode,
        rate: data.rate,
        subjects: data.subjects,
        studentIds: data.studentIds as Id<"students">[],
      });
      toast.success("Tutor commissioned for excellence!");
      navigate("/tutors/details");
    } catch (error) {
      toast.error("Roster synchronization failed.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Card className="glass-metallic neon-border-red">
          <CardHeader className="bg-primary p-8 rounded-t-lg border-b border-white/10">
            <div className="flex items-center gap-4">
              <Users className="h-10 w-10 text-white" />
              <CardTitle className="text-4xl text-white font-display tracking-tight text-glow-red">Tutor Registration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Full Name
                  </Label>
                  <Input {...register("name")} className="h-16 text-lg bg-secondary/50 border-accent/30 focus:border-accent text-white" placeholder="Expert Name" />
                  {errors.name && <p className="text-primary font-semibold">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent">Communication Link</Label>
                  <Input {...register("contact")} className="h-16 text-lg bg-secondary/50 border-accent/30 focus:border-accent text-white" placeholder="Email / ID" />
                  {errors.contact && <p className="text-primary font-semibold">{errors.contact.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent">Instruction Mode</Label>
                  <select {...register("mode")} className="flex h-16 w-full rounded-md border-accent/30 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent">
                    <option value="" className="bg-background">Select Mode</option>
                    <option value="Online" className="bg-background">Online</option>
                    <option value="In-person" className="bg-background">In-person</option>
                    <option value="Hybrid" className="bg-background">Hybrid</option>
                  </select>
                  {errors.mode && <p className="text-primary font-semibold">{errors.mode.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent">Credit Rate ($/hr)</Label>
                  <Input type="number" {...register("rate")} className="h-16 text-lg bg-secondary/50 border-accent/30 focus:border-accent text-white" placeholder="0.00" />
                  {errors.rate && <p className="text-primary font-semibold">{errors.rate.message}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-primary uppercase tracking-widest">Core Disciplines</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SUBJECTS.map((subject) => (
                    <div key={subject} className={`flex items-center space-x-3 p-4 border rounded-xl transition-all cursor-pointer ${selectedSubjects.includes(subject) ? 'bg-primary/20 border-primary shadow-neon-red' : 'bg-secondary/30 border-white/10'}`}>
                      <Checkbox
                        id={`tutor-subject-${subject}`}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={(checked) => {
                          const next = checked ? [...selectedSubjects, subject] : selectedSubjects.filter(s => s !== subject);
                          setValue("subjects", next, { shouldValidate: true });
                        }}
                        className="h-6 w-6"
                      />
                      <Label htmlFor={`tutor-subject-${subject}`} className="text-lg font-medium cursor-pointer flex-1">{subject}</Label>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-primary font-semibold">{errors.subjects.message}</p>}
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-accent uppercase tracking-widest">Assigned Learner Roster</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student._id} className={`flex items-center space-x-3 p-4 border rounded-xl transition-all cursor-pointer ${selectedStudents.includes(student._id) ? 'bg-accent/20 border-accent shadow-neon-cyan' : 'bg-secondary/30 border-white/10'}`}>
                      <Checkbox
                        id={`tutor-student-${student._id}`}
                        checked={selectedStudents.includes(student._id)}
                        onCheckedChange={(checked) => {
                          const next = checked ? [...selectedStudents, student._id] : selectedStudents.filter(id => id !== student._id);
                          setValue("studentIds", next, { shouldValidate: true });
                        }}
                        className="h-6 w-6"
                      />
                      <Label htmlFor={`tutor-student-${student._id}`} className="flex flex-col cursor-pointer flex-1">
                        <span className="text-lg font-bold">{student.name}</span>
                        <span className="text-xs text-muted-foreground">{student.level}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-20 text-2xl font-bold rounded-full bg-primary hover:bg-primary/90 shadow-neon-red hover:scale-[1.01] transition-all">
                Authorize Expert Deployment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}