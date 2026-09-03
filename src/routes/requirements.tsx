import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Globe,
  GraduationCap,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  COUNTRY_REQUIREMENTS,
  POPULAR_UNIVERSITIES,
  type CountryRequirement,
} from "@/shared/data/requirements";
import { listCountryRequirements, listUniversityRequirements } from "@/lib/db";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/requirements")({
  head: () => ({
    meta: [
      { title: "Requirements — IEA" },
      { name: "description", content: "IELTS score requirements by country and university." },
    ],
  }),
  component: RequirementsPage,
});

function RequirementsPage() {
  const { data: dbCountryReqs } = useQuery({ queryKey: ["country-requirements"], queryFn: listCountryRequirements });
  const { data: dbUniReqs } = useQuery({ queryKey: ["university-requirements"], queryFn: listUniversityRequirements });
  const allCountryReqs: CountryRequirement[] = dbCountryReqs?.length ? dbCountryReqs : COUNTRY_REQUIREMENTS;
  const allUniReqs = dbUniReqs?.length ? dbUniReqs : POPULAR_UNIVERSITIES;

  const [activeTab, setActiveTab] = useState<"country" | "university">("country");
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const countries = useMemo(() => {
    const map = new Map<string, CountryRequirement[]>();
    for (const req of allCountryReqs) {
      if (!map.has(req.country)) map.set(req.country, []);
      map.get(req.country)!.push(req);
    }
    return [...map.entries()];
  }, [allCountryReqs]);

  const universityByCountry = useMemo(() => {
    const map = new Map<string, typeof allUniReqs>();
    for (const uni of allUniReqs) {
      if (!map.has(uni.country)) map.set(uni.country, []);
      map.get(uni.country)!.push(uni);
    }
    return [...map.entries()];
  }, [allUniReqs]);

  return (
    <DashboardShell title="Score Requirements" subtitle="IELTS requirements by country and university">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "country" ? "hero" : "soft"}
            size="pill"
            onClick={() => setActiveTab("country")}
          >
            <Globe className="mr-2 h-4 w-4" /> By Country
          </Button>
          <Button
            variant={activeTab === "university" ? "hero" : "soft"}
            size="pill"
            onClick={() => setActiveTab("university")}
          >
            <GraduationCap className="mr-2 h-4 w-4" /> By University
          </Button>
        </div>

        {activeTab === "country" ? (
          <div className="space-y-3">
            {countries.map(([country, reqs]) => (
              <div key={country} className="rounded-3xl bg-card shadow-card overflow-hidden">
                <button
                  onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reqs[0]?.flag}</span>
                      <div>
                        <p className="font-bold text-foreground">{country}</p>
                        <p className="text-xs text-muted-foreground">{reqs.length} visa/purpose types</p>
                      </div>
                    </div>
                    {expandedCountry === country ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedCountry === country && (
                  <div className="border-t border-border p-5 space-y-3">
                    {reqs.map((req, idx) => (
                      <div key={idx} className="rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{req.purpose}</p>
                          <Badge className="bg-primary/10 text-primary">Band {req.overallBand}+</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Min per skill: {req.minPerSkill} • {req.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {universityByCountry.map(([country, unis]) => (
              <div key={country} className="rounded-3xl bg-card shadow-card overflow-hidden">
                <div className="p-5">
                  <p className="text-sm font-bold text-muted-foreground uppercase">{country}</p>
                </div>
                <div className="space-y-2 px-5 pb-5">
                  {unis.map((uni) => (
                    <div key={uni.university} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">{uni.university}</p>
                        <p className="text-xs text-muted-foreground">{uni.program}</p>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="secondary" className="text-[10px]">Overall: {uni.overallBand}</Badge>
                          <Badge variant="secondary" className="text-[10px]">Writing: {uni.minWriting}</Badge>
                          <Badge variant="secondary" className="text-[10px]">Speaking: {uni.minSpeaking}</Badge>
                        </div>
                      </div>
                      <a
                        href={uni.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 shrink-0 rounded-xl border border-border p-2 hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
