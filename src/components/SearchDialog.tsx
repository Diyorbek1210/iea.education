import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  BookOpen,
  PenLine,
  Globe,
  Calculator,
  Target,
  Trophy,
  BarChart3,
  FileText,
  ClipboardCheck,
  GraduationCap,
  Bot,
  X,
} from "lucide-react";
import { VOCABULARY } from "@/data/vocabulary";
import { ESSAY_TOPICS } from "@/data/essayTopics";
import { IELTS_RESOURCES } from "@/data/resources";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: "navigation" | "vocabulary" | "essay" | "resource";
  icon: typeof Search;
  action: string;
  keywords: string[];
}

const NAV_ITEMS: { to: string; label: string; icon: typeof Search }[] = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/vocabulary", label: "Vocabulary Builder", icon: BookOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/task-practice", label: "Task Practice", icon: Target },
  { to: "/model-answers", label: "Model Answers", icon: FileText },
  { to: "/band-calculator", label: "Band Calculator", icon: Calculator },
  { to: "/resources", label: "Resources", icon: Globe },
  { to: "/requirements", label: "Requirements", icon: GraduationCap },
  { to: "/mock-test", label: "Mock Test", icon: ClipboardCheck },
  { to: "/practice", label: "AI Speaking Practice", icon: Bot },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const allItems = useMemo<SearchItem[]>(() => {
    const nav: SearchItem[] = NAV_ITEMS.map((n) => ({
      id: `nav-${n.to}`,
      title: n.label,
      description: `Navigate to ${n.label}`,
      category: "navigation" as const,
      icon: n.icon,
      action: n.to,
      keywords: [n.label.toLowerCase()],
    }));

    const vocab: SearchItem[] = VOCABULARY.slice(0, 200).map((w) => ({
      id: `vocab-${w.word}`,
      title: w.word,
      description: w.definition,
      category: "vocabulary" as const,
      icon: BookOpen,
      action: "/vocabulary",
      keywords: [w.word.toLowerCase(), w.definition.toLowerCase(), w.topic, w.synonym?.toLowerCase() ?? ""],
    }));

    const essays: SearchItem[] = ESSAY_TOPICS.map((t) => ({
      id: `essay-${t.id}`,
      title: t.title,
      description: t.prompt.slice(0, 100) + "...",
      category: "essay" as const,
      icon: PenLine,
      action: "/task-practice",
      keywords: [t.title.toLowerCase(), t.category, t.type.replace(/_/g, " ")],
    }));

    const resources: SearchItem[] = IELTS_RESOURCES.map((r) => ({
      id: `res-${r.id}`,
      title: r.title,
      description: r.description,
      category: "resource" as const,
      icon: Globe,
      action: "/resources",
      keywords: [r.title.toLowerCase(), r.description.toLowerCase(), r.type, r.skill],
    }));

    return [...nav, ...vocab, ...essays, ...resources];
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 20);
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => item.keywords.some((kw) => kw.includes(q)) || item.title.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query, allItems]);

  const groupedResults = useMemo(() => {
    const groups: { category: string; items: SearchItem[] }[] = [];
    const map = new Map<string, SearchItem[]>();
    for (const item of results) {
      const key = item.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    const order = ["navigation", "vocabulary", "essay", "resource"];
    for (const cat of order) {
      const items = map.get(cat);
      if (items?.length) groups.push({ category: cat, items });
    }
    return groups;
  }, [results]);

  const flatResults = useMemo(() => groupedResults.flatMap((g) => g.items), [groupedResults]);

  const CATEGORY_LABELS: Record<string, string> = {
    navigation: "Navigation",
    vocabulary: "Vocabulary",
    essay: "Essay Topics",
    resource: "Resources",
  };

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      setQuery("");
      navigate({ to: item.action });
    },
    [navigate],
  );

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flatResults, selectedIndex, handleSelect]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
        title="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono sm:inline">
          Ctrl+K
        </kbd>
      </button>
    );
  }

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => { setOpen(false); setQuery(""); }} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vocabulary, topics, pages..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => { setOpen(false); setQuery(""); }}
            className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
          >
            ESC
          </button>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {flatResults.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No results found.</p>
          )}
          {groupedResults.map((group) => (
            <div key={group.category}>
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[group.category] ?? group.category}
              </p>
              {group.items.map((item) => {
                const idx = flatIndex++;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      idx === selectedIndex ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/50",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
