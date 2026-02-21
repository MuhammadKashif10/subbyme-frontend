import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Find Contractors", path: "/contractors" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const dashboardPath = user?.role === "admin" ? "/admin" : `/dashboard/${user?.role}`;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container-main flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">S</div>
          <span className="text-xl font-bold text-foreground">SubbyMe</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === l.path ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={dashboardPath}><User size={16} className="mr-1" /> Dashboard</Link>
              </Button>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut size={16} className="mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Log In</Link></Button>
              <Button asChild size="sm"><Link to="/register">Sign Up</Link></Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === l.path ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="text-sm font-medium px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary">Dashboard</Link>
                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>Logout</Button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link></Button>
                <Button asChild size="sm" className="flex-1"><Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
