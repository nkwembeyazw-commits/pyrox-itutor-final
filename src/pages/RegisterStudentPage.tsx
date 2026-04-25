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
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Sparkles, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SUBJECT_LIST } from '@/lib/constants';
const studentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.string().min(2, "Location is required"),
  level: z.string().min(1, "Academic level is required"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
});
type StudentForm = z.infer<typeof studentSchema>;
export function RegisterStudentPage() {
  const createStudent = useMutation(api.pyrox.createStudent);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: "", location: "", level: "", subjects: [] }
  });
  const watchedSubjects = watch("subjects");
  const onSubmit = async (data: StudentForm) => {
    try {
      await createStudent(data);
      toast.success("Student enrolled in the future!");
      navigate("/students/details");
    } catch (error) {
      toast.error("Deployment failed. Check connectivity.");
    }
  };
  const handleSubjectChange = (subject: string, checked: boolean) => {
    const current = watchedSubjects;
    if (checked) {
      setValue("subjects", [...current, subject], { shouldValidate: true });
    } else {
      setValue("subjects", current.filter(s => s !== subject), { shouldValidate: true });
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-6">
        <div className="flex justify-start">
          <Button asChild variant="ghost" className="text-accent hover:text-accent/80 font-bold gap-2">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <Card className="glass-metallic neon-border-cyan border-2 overflow-hidden shadow-2xl transition-all duration-500">
          <CardHeader className="bg-secondary/80 p-6 md:p-8 border-b border-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <UserPlus className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                <CardTitle className="text-2xl md:text-4xl text-white font-display tracking-tight text-glow-cyan uppercase">PyroX Student Registration</CardTitle>
              </div>
              <BrandLogo variant="icon" size={40} className="hidden sm:flex" />
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Sparkles className="h-4 w-4" /> Full Name
                  </Label>
                  <Input {...register("name")} className="h-14 md:h-16 text-lg bg-secondary/50 border-white/10 text-white placeholder:text-muted-foreground focus:border-accent transition-all font-bold" placeholder="Legal Identity" />
                  {errors.name && <p className="text-primary font-bold text-xs uppercase italic">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs">Deployment Location</Label>
                  <Input {...register("location")} className="h-14 md:h-16 text-lg bg-secondary/50 border-white/10 text-white placeholder:text-muted-foreground focus:border-accent transition-all font-bold" placeholder="City // Campus" />
                  {errors.location && <p className="text-primary font-bold text-xs uppercase italic">{errors.location.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold text-accent uppercase tracking-widest text-xs">Academic Tier</Label>
                  <select
                    {...register("level")}
                    className="flex h-14 md:h-16 w-full rounded-md border-white/10 bg-secondary/50 px-3 text-lg text-white outline-none focus:border-accent font-bold"
                  >
                    <option value="" className="bg-background">Select Tier</option>
                    <option value="Primary" className="bg-background">Primary Core</option>
                    <option value="IGCSE" className="bg-background">IGCSE Standard</option>
                    <option value="A Level" className="bg-background">A Level Advanced</option>
                  </select>
                  {errors.level && <p className="text-primary font-bold text-xs uppercase italic">{errors.level.message}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold text-primary uppercase tracking-widest text-xs">Core Module Access Selection</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {SUBJECT_LIST.map((subject) => {
                    const isChecked = watchedSubjects.includes(subject);
                    return (
                      <div key={subject} className={`flex items-center space-x-3 p-4 border rounded-xl transition-all cursor-pointer ${isChecked ? 'bg-primary/20 border-primary shadow-neon-red' : 'bg-secondary/30 border-white/10 hover:border-accent/50'}`}>
                        <Checkbox
                          id={`subject-${subject}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleSubjectChange(subject, !!checked)}
                          className="h-6 w-6"
                        />
                        <Label htmlFor={`subject-${subject}`} className="text-lg font-bold text-white/90 cursor-pointer flex-1 tracking-tight">
                          {subject}
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {errors.subjects && <p className="text-primary font-bold text-xs uppercase italic">{errors.subjects.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full h-16 md:h-20 text-xl md:text-2xl font-black rounded-full bg-accent text-background hover:bg-accent/90 shadow-neon-cyan hover:scale-[1.01] transition-all uppercase tracking-[0.2em]">
                Execute Enrollment Protocol
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}