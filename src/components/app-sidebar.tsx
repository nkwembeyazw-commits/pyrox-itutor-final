import React from "react";
import { GraduationCap, Users, Calendar, LayoutDashboard, UserPlus, ClipboardList } from "lucide-react";
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
  { label: "Dashboard", path: "/", icon: LayoutDashboard, color: "text-primary" },
  { label: "Register Student", path: "/students/register", icon: UserPlus, color: "text-primary" },
  { label: "Student Details", path: "/students/details", icon: GraduationCap, color: "text-primary" },
  { label: "Register Tutor", path: "/tutors/register", icon: Users, color: "text-accent" },
  { label: "Tutor Details", path: "/tutors/details", icon: ClipboardList, color: "text-accent" },
  { label: "Schedules", path: "/schedules/student", icon: Calendar, color: "text-primary" },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar className="border-r-2 border-primary/10">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">PiroX iTutor</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  className={`h-12 text-lg font-semibold transition-all hover:scale-[1.02] ${pathname === item.path ? 'bg-primary/10' : ''}`}
                >
                  <Link to={item.path}>
                    <item.icon className={`${item.color} h-5 w-5`} /> 
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6">
        <div className="text-sm font-medium text-muted-foreground">© 2024 PiroX Systems</div>
      </SidebarFooter>
    </Sidebar>
  );
}