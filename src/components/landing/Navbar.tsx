import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/lib/auth";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Founders", href: "#teachers" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" aria-label="IEA home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {user || isAdmin ? (
            <Button asChild variant="hero" size="pill">
              <Link to={isAdmin ? "/admin" : "/dashboard"}>
                {isAdmin ? "Admin Panel" : "My Dashboard"}
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="pill">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild variant="hero" size="pill">
                <Link to="/test">Join Now</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-border p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-card px-5 py-4 lg:hidden">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-muted-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild variant="outline" size="pill">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild variant="hero" size="pill">
              <Link to="/test">Join Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
