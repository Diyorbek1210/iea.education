import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Users,
  PenLine,
  Clock,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — IEA" },
      { name: "description", content: "Discuss IELTS tips, share experiences, and help other learners." },
    ],
  }),
  component: CommunityPage,
});

interface Thread {
  id: string;
  title: string;
  author: string;
  category: "tips" | "question" | "experience" | "resource";
  content: string;
  replies: Reply[];
  likes: number;
  createdAt: string;
  liked?: boolean;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

const SEED_THREADS: Thread[] = [
  {
    id: "t1",
    title: "How I improved from Band 6 to 7.5 in Writing",
    author: "Sarah M.",
    category: "experience",
    content: "I focused on Task Response and Coherence. Here are my top 3 tips:\n\n1. Always spend 5 minutes planning before writing\n2. Use discourse markers to connect paragraphs\n3. Write a clear thesis statement in your introduction\n\nThe biggest game changer was timing - I practiced writing 250 words in exactly 40 minutes until it became natural.",
    replies: [
      { id: "r1", author: "Ahmed K.", content: "Great tips! The planning phase is so underrated. I always rush into writing and it shows.", createdAt: new Date(Date.now() - 86400000).toISOString(), likes: 5 },
      { id: "r2", author: "Li Wei", content: "Can you share more about discourse markers? I struggle with cohesion.", createdAt: new Date(Date.now() - 43200000).toISOString(), likes: 3 },
    ],
    likes: 24,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "t2",
    title: "Best resources for Listening Section 4?",
    author: "Raj P.",
    category: "question",
    content: "I keep losing marks in Section 4 because the academic vocabulary is so dense. Does anyone have tips or resources specifically for this section? I'm currently scoring 6.5 in Listening overall but Section 4 brings me down.",
    replies: [
      { id: "r3", author: "Emma T.", content: "Try the BBC podcasts - they have similar academic content. Also, practice note-taking while listening to TED talks.", createdAt: new Date(Date.now() - 7200000).toISOString(), likes: 8 },
    ],
    likes: 12,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "t3",
    title: "Speaking Part 2 - Use the full 1 minute preparation",
    author: "Yuki H.",
    category: "tips",
    content: "Many candidates waste the 1-minute preparation time. Here's my method:\n\n- 20 seconds: Read all bullet points carefully\n- 20 seconds: Jot down keywords for each bullet\n- 20 seconds: Plan your opening sentence\n\nThis gives you a clear structure and prevents you from going off-topic during the 2-minute speech.",
    replies: [],
    likes: 18,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

const CATEGORY_INFO = {
  tips: { label: "Tips & Strategies", color: "bg-blue-500/10 text-blue-500" },
  question: { label: "Questions", color: "bg-purple-500/10 text-purple-500" },
  experience: { label: "Experiences", color: "bg-green-500/10 text-green-500" },
  resource: { label: "Resources", color: "bg-orange-500/10 text-orange-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CommunityPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS);
  const [activeTab, setActiveTab] = useState<"all" | "tips" | "question" | "experience">("all");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState<"tips" | "question" | "experience">("tips");
  const [showNewThread, setShowNewThread] = useState(false);
  const [replyText, setReplyText] = useState("");

  const filteredThreads = activeTab === "all" ? threads : threads.filter((t) => t.category === activeTab);

  const handleNewThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    const thread: Thread = {
      id: crypto.randomUUID(),
      title: newThreadTitle,
      author: user?.name ?? "Anonymous",
      category: newThreadCategory,
      content: newThreadContent,
      replies: [],
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) => [thread, ...prev]);
    setNewThreadTitle("");
    setNewThreadContent("");
    setShowNewThread(false);
  };

  const handleReply = () => {
    if (!selectedThread || !replyText.trim()) return;
    const reply: Reply = {
      id: crypto.randomUUID(),
      author: user?.name ?? "Anonymous",
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id ? { ...t, replies: [...t.replies, reply] } : t,
      ),
    );
    setSelectedThread((prev) =>
      prev ? { ...prev, replies: [...prev.replies, reply] } : prev,
    );
    setReplyText("");
  };

  const toggleLike = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, likes: t.liked ? t.likes - 1 : t.likes + 1, liked: !t.liked } : t,
      ),
    );
  };

  if (selectedThread) {
    const thread = threads.find((t) => t.id === selectedThread.id) ?? selectedThread;
    const catInfo = CATEGORY_INFO[thread.category];
    return (
      <DashboardShell title="Community" subtitle="Discussion">
        <div className="space-y-4">
          <Button variant="ghost" size="pill" onClick={() => setSelectedThread(null)}>
            ← Back to discussions
          </Button>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              <Badge className={catInfo.color}>{catInfo.label}</Badge>
              <span className="text-xs text-muted-foreground">by {thread.author} • {timeAgo(thread.createdAt)}</span>
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-foreground">{thread.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground leading-relaxed">{thread.content}</p>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={() => toggleLike(thread.id)}
                className={cn("flex items-center gap-1 text-sm", thread.liked ? "text-primary font-semibold" : "text-muted-foreground")}
              >
                <ThumbsUp className="h-4 w-4" /> {thread.likes}
              </button>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" /> {thread.replies.length} replies
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-foreground">Replies ({thread.replies.length})</h3>
          {thread.replies.map((reply) => (
            <div key={reply.id} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{reply.author}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-foreground">{reply.content}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="h-3 w-3" /> {reply.likes}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-card p-4 shadow-card">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
            />
            <div className="mt-2 flex justify-end">
              <Button onClick={handleReply} disabled={!replyText.trim()} variant="hero" size="pill">
                <Send className="mr-2 h-4 w-4" /> Reply
              </Button>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Community" subtitle="Discuss, share, and learn together">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {([
              { id: "all" as const, label: "All", icon: Users },
              { id: "tips" as const, label: "Tips", icon: PenLine },
              { id: "question" as const, label: "Questions", icon: MessageSquare },
              { id: "experience" as const, label: "Experiences", icon: Clock },
            ]).map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "hero" : "soft"}
                size="pill"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="mr-1 h-4 w-4" /> {tab.label}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowNewThread(true)} variant="hero" size="pill">
            + New Thread
          </Button>
        </div>

        {showNewThread && (
          <div className="rounded-3xl bg-card p-6 shadow-card space-y-4">
            <h3 className="font-bold text-foreground">Start a Discussion</h3>
            <select
              value={newThreadCategory}
              onChange={(e) => setNewThreadCategory(e.target.value as typeof newThreadCategory)}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
            >
              <option value="tips">Tips & Strategies</option>
              <option value="question">Question</option>
              <option value="experience">Experience</option>
            </select>
            <input
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Thread title..."
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold"
            />
            <textarea
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleNewThread} disabled={!newThreadTitle.trim() || !newThreadContent.trim()} variant="hero" size="pill">
                Post Thread
              </Button>
              <Button onClick={() => setShowNewThread(false)} variant="ghost" size="pill">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredThreads.map((thread) => {
            const catInfo = CATEGORY_INFO[thread.category];
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className="w-full rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <Badge className={catInfo.color}>{catInfo.label}</Badge>
                  <span className="text-xs text-muted-foreground">by {thread.author}</span>
                  <span className="text-xs text-muted-foreground">• {timeAgo(thread.createdAt)}</span>
                </div>
                <h3 className="mt-2 font-bold text-foreground">{thread.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{thread.content}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {thread.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {thread.replies.length} replies
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
