import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { LucideIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
}

export function DashboardLayout({ children, title, navItems }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="container-main py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border bg-card p-4 card-shadow">{sidebar}</div>
          </aside>
          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-64 bg-card p-5 overflow-y-auto">
                <div className="flex justify-end mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X size={18} /></Button>
                </div>
                {sidebar}
              </div>
            </div>
          )}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
