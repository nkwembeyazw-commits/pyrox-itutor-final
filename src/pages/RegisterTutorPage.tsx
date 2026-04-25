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
import { useNavigate, Link } from 'react-router-dom';
import { Users, Sparkles, ArrowLeft } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';
import { BrandLogo } from '@/components/BrandLogo';
import { SUBJECT_LIST } from '@/lib/constants';
const tutorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contact: z.string().min(5, "Contact info is required"),
  mode: z.string().min(1, "Mode is required"),
  rate: z.number().positive("Rate must be positive"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  studentIds: z.array(z.string()),
});
type TutorForm = z.infer<typeof tutorSchema>;
export function RegisterTutorPage() {
  const createTutor = useMutation(api.pyrox.createTutor);
  const students = useQuery(api.pyrox.getStudents) ?? [];
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
  const selectedSubjects = watch("subjects");
  const selectedStudents = watch("studentIds");
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
      <div className="py-8 md:py-10 lg:py-12 space-y-6">
        <div className="flex justify-start">
          <Button asChild variant="ghost" className="text-primary hover:text-primary/80 font-bold gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <Card className="glass-metallic neon-border-red border-2 overflow-hidden shadow-2xl transition-all duration-500">
          <CardHeader className="bg-primary p-6 md:p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                <CardTitle className="text-xl md:text-3xl text-white font-display tracking-tight text-glow-red uppercase">PyroX Tutor Commissioning</CardTitle>
              </div>
              <BrandLogo variant="icon" size={32} className="hidden sm:flex" />
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Sparkles className="h-4 w-4" /> Full Name
                  </Label>
                  <input {...register("name")} className="flex h-12 md:h-14 w-full rounded-md border-accent/30 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent font-bold" placeholder="Expert Name" />
                  {errors.name && <p className="text-primary font-bold text-xs uppercase italic">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs">Communication Link</Label>
                  <input {...register("contact")} className="flex h-12 md:h-14 w-full rounded-md border-accent/30 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent font-bold" placeholder="Email / ID Protocol" />
                  {errors.contact && <p className="text-primary font-bold text-xs uppercase italic">{errors.contact.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs">Instruction Mode</Label>
                  <select {...register("mode")} className="flex h-12 md:h-14 w-full rounded-md border-accent/30 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent font-bold">
                    <option value="" className="bg-background">Select Mode</option>
                    <option value="Online" className="bg-background">Online</option>
                    <option value="In-person" className="bg-background">In-person</option>
                    <option value="Hybrid" className="bg-background">Hybrid</option>
                  </select>
                  {errors.mode && <p className="text-primary font-bold text-xs uppercase italic">{errors.mode.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs">Credit Rate ($/hr)</Label>
                  <input type="number" {...register("rate", { valueAsNumber: true })} className="flex h-12 md:h-14 w-full rounded-md border-accent/30 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent font-bold" placeholder="0.00" />
                  {errors.rate && <p className="text-primary font-bold text-xs uppercase italic">{errors.rate.message}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-primary uppercase tracking-[0.2em] text-xs">Core Knowledge Disciplines</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {SUBJECT_LIST.map((subject) => (
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
                      <Label htmlFor={`tutor-subject-${subject}`} className="text-lg font-bold cursor-pointer flex-1 uppercase tracking-tight">{subject}</Label>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-primary font-bold text-xs uppercase italic">{errors.subjects.message}</p>}
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-accent uppercase tracking-[0.2em] text-xs">Assigned Learner Roster</Label>
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
                        <span className="text-lg font-black uppercase tracking-tighter">{student.name}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{student.level} Tier</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-16 md:h-20 text-xl md:text-2xl font-black rounded-full bg-primary hover:bg-primary/90 shadow-neon-red hover:scale-[1.01] transition-all uppercase tracking-[0.2em]">
                Authorize Expert Deployment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}