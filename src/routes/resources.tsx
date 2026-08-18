import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ExternalLink,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  Eye,
  Video,
  Star,
  Filter,
  GraduationCap,
  Globe,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IELTS_RESOURCES, type Resource } from "@/data/resources";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — IEA" },
      { name: "description", content: "Curated IELTS preparation resources, links, and materials." },
    ],
  }),
  component: ResourcesPage,
});

const TYPE_ICONS: Record<Resource["type"], typeof BookOpen> = {
  official: Star,
  video: Video,
  book: BookOpen,
  website: ExternalLink,
  app: ExternalLink,
};

const TYPE_COLORS: Record<Resource["type"], string> = {
  official: "text-yellow-500",
  video: "text-red-500",
  book: "text-blue-500",
  website: "text-green-500",
  app: "text-purple-500",
};

const SKILL_FILTERS = ["all", "listening", "reading", "writing", "speaking"] as const;

function ResourcesPage() {
  const [typeFilter, setTypeFilter] = useState<Resource["type"] | "all">("all");
  const [skillFilter, setSkillFilter] = useState<"all" | Resource["skill"]>("all");

  const filtered = useMemo(() => {
    let resources = [...IELTS_RESOURCES];
    if (typeFilter !== "all") resources = resources.filter((r) => r.type === typeFilter);
    if (skillFilter !== "all") resources = resources.filter((r) => r.skill === skillFilter || r.skill === "all");
    return resources;
  }, [typeFilter, skillFilter]);

  const freeCount = filtered.filter((r) => r.isFree).length;

  return (
    <DashboardShell title="Resource Library" subtitle="IELTS preparation materials and links">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Total Resources</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{IELTS_RESOURCES.length}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Free Resources</p>
            <p className="mt-1 text-2xl font-extrabold text-success">{freeCount}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Showing</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{filtered.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "official", "website", "video", "book", "app"] as const).map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? "hero" : "soft"}
                size="pill"
                onClick={() => setTypeFilter(type)}
                className="text-xs"
              >
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-wrap gap-1.5">
            {SKILL_FILTERS.map((skill) => (
              <Button
                key={skill}
                variant={skillFilter === skill ? "hero" : "soft"}
                size="pill"
                onClick={() => setSkillFilter(skill)}
                className="text-xs"
              >
                {skill === "all" ? "All Skills" : skill.charAt(0).toUpperCase() + skill.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => {
            const Icon = TYPE_ICONS[resource.type];
            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl bg-card p-5 shadow-card transition-all hover:shadow-soft group"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5", TYPE_COLORS[resource.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-[10px] capitalize">{resource.type}</Badge>
                      <Badge variant="secondary" className="text-[10px] capitalize">{resource.skill}</Badge>
                      {resource.isFree ? (
                        <Badge className="bg-success/10 text-success text-[10px]">Free</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Paid</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-bold text-foreground">No resources match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try changing the type or skill filter.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
