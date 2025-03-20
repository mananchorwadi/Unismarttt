import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

const facultyNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "Classes", href: "/classes" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const studentNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: GraduationCap, label: "Grades", href: "/grades" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  if (!user) return null;
  
  const isFaculty = user.role === ROLES.FACULTY;
  const navItems = isFaculty ? facultyNavItems : studentNavItems;
  
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          <span>UniPortal</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => {
            const isActive = location === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  isActive 
                    ? "bg-muted text-primary font-medium" 
                    : "text-muted-foreground"
                )}
              >
                {<item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-4">
          <div>
            <p className="text-xs font-medium text-primary">
              {isFaculty ? "Faculty Portal" : "Student Portal"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.universityId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
