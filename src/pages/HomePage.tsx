import { GraduationCap, Users, Calendar, UserPlus, ClipboardList, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../components/SignInForm";
import { SignOutButton } from "../components/SignOutButton";
const actions = [
  { title: "Register Student", path: "/students/register", icon: UserPlus, color: "bg-blue-600", desc: "Enroll new students into the system" },
  { title: "Student Details", path: "/students/details", icon: GraduationCap, color: "bg-blue-700", desc: "View and export student information" },
  { title: "Register Tutor", path: "/tutors/register", icon: Users, color: "bg-red-500", desc: "Add new tutors to the roster" },
  { title: "Tutor Details", path: "/tutors/details", icon: ClipboardList, color: "bg-red-600", desc: "Manage tutor rates and assignments" },
  { title: "Student Schedule", path: "/schedules/student", icon: Calendar, color: "bg-blue-500", desc: "Set weekly timetables for students" },
  { title: "Tutor Schedule", path: "/schedules/tutor", icon: BookOpen, color: "bg-red-700", desc: "Assign specific time slots to tutors" },
];
export function HomePage() {
  const user = useQuery(api.auth.loggedInUser);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-primary">
              Welcome to <span className="text-accent">PiroX iTutor</span>
            </h1>
            <p className="text-xl text-muted-foreground">Comprehensive Management for Tutoring Excellence.</p>
          </div>
          <Authenticated>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-lg">{user?.email}</span>
              <SignOutButton />
            </div>
          </Authenticated>
        </div>
        <Unauthenticated>
          <div className="max-w-md mx-auto">
            <Card className="p-8 shadow-xl border-2">
              <SignInForm />
            </Card>
          </div>
        </Unauthenticated>
        <Authenticated>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className={`${action.color} p-5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold">{action.title}</h3>
                    <p className="text-muted-foreground text-lg">{action.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Authenticated>
      </div>
    </div>
  );
}