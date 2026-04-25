import React from "react";
import { GraduationCap, Users, Calendar, LayoutDashboard, UserPlus, ClipboardList, Sparkles, BookOpen, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
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
  { label: "Student Schedule", path: "/schedules/student", icon: Calendar, color: "text-accent" },
  { label: "Tutor Schedule", path: "/schedules/tutor", icon: BookOpen, color: "text-primary" },
  { label: "Payments & Dues", path: "/payments/dues", icon: DollarSign, color: "text-primary" },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar className="border-r border-accent/20 bg-background/95 backdrop-blur-xl">
      <SidebarHeader className="p-8">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <BrandLogo variant="full" size={52} />
          <p className="mt-4 text-[10px] text-muted-foreground font-medium italic">
            Ignite Knowledge. Inspire Futures.
          </p>
        </Link>
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
            <span className="text-xs font-bold uppercase tracking-wider">Active Protocol V2.1</span>
          </div>
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">© 2024 PYROX SYSTEMS | ADMIN PORTAL</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}