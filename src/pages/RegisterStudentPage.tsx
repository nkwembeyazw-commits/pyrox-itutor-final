import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles } from 'lucide-react';
const SUBJECTS = [
  "Mathematics", "English Language", "English Literature", "Physics", "Chemistry",
  "Biology", "History", "Geography", "Computer Science", "Business Studies",
  "Accounting", "Economics", "French", "Spanish", "Art", "Music"
];
const studentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  level: z.string().min(1, "Academic level is required"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
});
type StudentForm = z.infer<typeof studentSchema>;
export function RegisterStudentPage() {
  const createStudent = useMutation(api.pirox.createStudent);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: { subjects: [] }
  });
  const selectedSubjects = watch("subjects");
  const onSubmit = async (data: StudentForm) => {
    try {
      await createStudent(data);
      toast.success("Student enrolled in the future!");
      navigate("/students/details");
    } catch (error) {
      toast.error("Deployment failed. Check connectivity.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Card className="glass-metallic neon-border-cyan">
          <CardHeader className="bg-secondary/80 p-8 rounded-t-lg border-b border-accent/20">
            <div className="flex items-center gap-4">
              <UserPlus className="h-10 w-10 text-accent" />
              <CardTitle className="text-4xl text-white font-display tracking-tight text-glow-cyan">Student Registration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Full Name
                  </Label>
                  <Input {...register("name")} className="h-16 text-lg bg-secondary/50 border-white/10 text-white placeholder:text-muted-foreground focus:border-accent transition-all" placeholder="Enter Legal Name" />
                  {errors.name && <p className="text-primary font-semibold">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent">Deployment Location</Label>
                  <Input {...register("location")} className="h-16 text-lg bg-secondary/50 border-white/10 text-white placeholder:text-muted-foreground focus:border-accent transition-all" placeholder="City or Campus" />
                  {errors.location && <p className="text-primary font-semibold">{errors.location.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent">Academic Tier</Label>
                  <select
                    {...register("level")}
                    className="flex h-16 w-full rounded-md border-white/10 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent"
                  >
                    <option value="" className="bg-background">Select Tier</option>
                    <option value="Primary" className="bg-background">Primary Core</option>
                    <option value="IGCSE" className="bg-background">IGCSE Standard</option>
                    <option value="A Level" className="bg-background">A Level Advanced</option>
                  </select>
                  {errors.level && <p className="text-primary font-semibold">{errors.level.message}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-primary">Core Modules Selection</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SUBJECTS.map((subject) => (
                    <div key={subject} className={`flex items-center space-x-3 p-4 border rounded-xl transition-all cursor-pointer ${selectedSubjects.includes(subject) ? 'bg-primary/20 border-primary shadow-neon-red' : 'bg-secondary/30 border-white/10 hover:border-accent/50'}`} onClick={() => {
                      const next = selectedSubjects.includes(subject) ? selectedSubjects.filter(s => s !== subject) : [...selectedSubjects, subject];
                      setValue("subjects", next);
                    }}>
                      <Checkbox checked={selectedSubjects.includes(subject)} className="h-6 w-6" />
                      <span className="text-lg font-medium text-white/90">{subject}</span>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-primary font-semibold">{errors.subjects.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full h-20 text-2xl font-bold rounded-full bg-accent text-background hover:bg-accent/90 shadow-neon-cyan hover:scale-[1.01] transition-all">
                Execute Enrollment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}