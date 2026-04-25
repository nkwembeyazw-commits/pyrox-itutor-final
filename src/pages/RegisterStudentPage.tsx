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
      toast.success("Student registered successfully!");
      navigate("/students/details");
    } catch (error) {
      toast.error("Failed to register student.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-primary p-8 rounded-t-lg">
            <CardTitle className="text-3xl text-white">Student Registration</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xl font-bold">Full Name</Label>
                  <Input {...register("name")} className="h-14 text-lg border-2" placeholder="e.g. John Doe" />
                  {errors.name && <p className="text-accent font-semibold">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold">Location</Label>
                  <Input {...register("location")} className="h-14 text-lg border-2" placeholder="e.g. Harare, Main Campus" />
                  {errors.location && <p className="text-accent font-semibold">{errors.location.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label className="text-xl font-bold">Academic Level</Label>
                  <select 
                    {...register("level")} 
                    className="flex h-14 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Level</option>
                    <option value="Primary">Primary</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="A Level">A Level</option>
                  </select>
                  {errors.level && <p className="text-accent font-semibold">{errors.level.message}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-xl font-bold">Enrolled Subjects</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SUBJECTS.map((subject) => (
                    <div key={subject} className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                      const current = selectedSubjects;
                      const next = current.includes(subject) 
                        ? current.filter(s => s !== subject) 
                        : [...current, subject];
                      setValue("subjects", next);
                    }}>
                      <Checkbox 
                        checked={selectedSubjects.includes(subject)} 
                        onCheckedChange={() => {}} // Handled by div click for easier targeting
                        className="h-6 w-6"
                      />
                      <span className="text-lg font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-accent font-semibold">{errors.subjects.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full h-16 text-xl font-bold rounded-full shadow-lg hover:scale-[1.01] transition-transform">
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}