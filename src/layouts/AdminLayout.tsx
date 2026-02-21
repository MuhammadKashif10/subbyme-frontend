import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface NavItem { label: string; path: string; icon: LucideIcon; }

export function AdminLayout({ children, navItems }: { children: ReactNode; navItems: NavItem[] }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const sidebar = (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
            <item.icon size={18} />{item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Shield size={20} className="text-sidebar-primary" />
          <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
        </div>
        <div className="flex-1 p-4">{sidebar}</div>
        <div className="border-t border-sidebar-border p-4">
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground">
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-sidebar p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-sidebar-foreground">Admin</span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground"><X size={18} /></Button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={18} /></Button>
          <h1 className="text-lg font-semibold text-foreground">SubbyMe Admin</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
