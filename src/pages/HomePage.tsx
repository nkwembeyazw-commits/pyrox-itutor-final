import { GraduationCap, Users, Calendar, UserPlus, ClipboardList, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../components/SignInForm";
import { SignOutButton } from "../components/SignOutButton";
import { BrandLogo } from "@/components/BrandLogo";
const actions = [
  { title: "Register Student", path: "/students/register", icon: UserPlus, color: "bg-accent", border: "neon-border-cyan", desc: "Enroll new futuristic learners" },
  { title: "Student Details", path: "/students/details", icon: GraduationCap, color: "bg-accent", border: "neon-border-cyan", desc: "Monitor student growth & data" },
  { title: "Register Tutor", path: "/tutors/register", icon: Users, color: "bg-primary", border: "neon-border-red", desc: "Onboard expert knowledge leaders" },
  { title: "Tutor Details", path: "/tutors/details", icon: ClipboardList, color: "bg-primary", border: "neon-border-red", desc: "Review expert rates & rosters" },
  { title: "Student Schedule", path: "/schedules/student", icon: Calendar, color: "bg-accent", border: "neon-border-cyan", desc: "Map out the journey of success" },
  { title: "Tutor Schedule", path: "/schedules/tutor", icon: BookOpen, color: "bg-primary", border: "neon-border-red", desc: "Allocate expert time-slots" },
];
export function HomePage() {
  const user = useQuery(api.auth.loggedInUser);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary animate-bounce">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Ignite Knowledge. Inspire Futures.</span>
            </div>
            <div className="flex items-center gap-5">
              <BrandLogo variant="icon" size={64} />
              <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-white">
                PyroX <span className="text-primary text-glow-red">iTutor</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl">The elite command center for educational excellence and professional scheduling.</p>
          </div>
          <Authenticated>
            <div className="glass-metallic p-6 rounded-2xl flex items-center gap-6 border-accent/20 shadow-neon-cyan">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Operator</span>
                <span className="font-bold text-xl text-accent">{user?.email?.split('@')[0]}</span>
              </div>
              <SignOutButton />
            </div>
          </Authenticated>
        </div>
        <Unauthenticated>
          <div className="max-w-md mx-auto">
            <Card className="glass-metallic neon-border-red p-10 shadow-2xl">
              <div className="text-center space-y-2 mb-8">
                <BrandLogo variant="icon" size={48} className="mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Access Portal</h2>
                <p className="text-muted-foreground font-medium">Authorized personnel only.</p>
              </div>
              <SignInForm />
            </Card>
          </div>
        </Unauthenticated>
        <Authenticated>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {actions.map((action) => (
              <Link key={action.path} to={action.path} className="group">
                <Card className={`h-full glass-metallic ${action.border} border-2 hover:scale-[1.03] transition-all duration-500 overflow-hidden`}>
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className={`${action.color} p-6 rounded-3xl text-white shadow-2xl transform group-hover:rotate-[360deg] transition-transform duration-700`}>
                      <action.icon className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-display font-bold text-white group-hover:text-accent transition-colors uppercase tracking-tight">{action.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{action.desc}</p>
                    </div>
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