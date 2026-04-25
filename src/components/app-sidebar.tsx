import React from "react";
import { GraduationCap, Users, Calendar, LayoutDashboard, UserPlus, ClipboardList, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, color: "text-accent" },
  { label: "Register Student", path: "/students/register", icon: UserPlus, color: "text-accent" },
  { label: "Student Details", path: "/students/details", icon: GraduationCap, color: "text-accent" },
  { label: "Register Tutor", path: "/tutors/register", icon: Users, color: "text-primary" },
  { label: "Tutor Details", path: "/tutors/details", icon: ClipboardList, color: "text-primary" },
  { label: "Schedules", path: "/schedules/student", icon: Calendar, color: "text-accent" },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar className="border-r border-accent/20 bg-background/95 backdrop-blur-xl">
      <SidebarHeader className="p-8">
        <div className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-all">
            <GraduationCap className="text-white h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold tracking-tighter text-white">PyroX <span className="text-primary">-iTutor</span></span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarMenu className="gap-3">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.path}
                  className={`h-14 text-xl font-bold transition-all hover:translate-x-2 ${pathname === item.path ? 'bg-white/5 border-l-4 border-primary shadow-inner' : ''}`}
                >
                  <Link to={item.path} className="flex items-center gap-4">
                    <item.icon className={`${item.color} h-6 w-6`} />
                    <span className="text-white/90">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-8 border-t border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Ignite Knowledge.</span>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">© 2024 PYROX SYSTEMS V2.0</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}