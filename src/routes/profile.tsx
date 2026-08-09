import { createFileRoute, redirect } from "@tanstack/react-router";

// The dashboard used to live at /profile for a while; keep the old URL working.
export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
