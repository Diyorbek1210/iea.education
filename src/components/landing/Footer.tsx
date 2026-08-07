import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            IEA gives free, structured access to IELTS preparation and general English for
            learners at every level.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">Platform</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/test" className="hover:text-primary">
                Placement test
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-primary">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Log in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#courses" className="hover:text-primary">
                Courses
              </a>
            </li>
            <li>
              <a href="#teachers" className="hover:text-primary">
                Teachers
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IEA — IELTS &amp; English Access. Learning Today, Leading
        Tomorrow.
      </div>
    </footer>
  );
}
