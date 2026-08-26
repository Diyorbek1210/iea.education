import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  Users,
  PenLine,
  Clock,
  Shield,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/firebaseConfig";
import {
  listCommunityThreads,
  createCommunityThread,
  addCommunityReply,
  toggleCommunityThreadLike,
  toggleCommunityReplyLike,
  deleteCommunityThread,
  deleteCommunityReply,
} from "@/lib/db";
import type { CommunityThread, CommunityReply, ThreadCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — IEA" },
      {
        name: "description",
        content: "Discuss IELTS tips, share experiences, and help other learners.",
      },
    ],
  }),
  component: CommunityPage,
});

const CATEGORY_INFO: Record<ThreadCategory, { label: string; color: string }> = {
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

function AuthorName({ name, email }: { name: string; email: string | undefined }) {
  const isAdmin = email === ADMIN_EMAIL || name === "Admin";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-sm font-bold text-foreground">{isAdmin ? "Admin" : name}</span>
      {isAdmin && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
          <Shield className="h-2.5 w-2.5" /> Admin
        </span>
      )}
    </span>
  );
}

function ThreadDetail({
  thread,
  onBack,
  user,
  isAdmin,
  queryClient,
}: {
  thread: CommunityThread;
  onBack: () => void;
  user: { uid: string; name: string; email: string } | null;
  isAdmin: boolean;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canDeleteThread = isAdmin || thread.authorEmail === user?.email;

  function canDeleteReply(reply: CommunityReply): boolean {
    return isAdmin || reply.authorEmail === user?.email;
  }

  async function handleReply() {
    if (!replyText.trim() || !user) return;
    setSubmitting(true);
    try {
      await addCommunityReply(thread.id, {
        author: user.name,
        authorEmail: user.email,
        content: replyText.trim(),
      });
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["community-threads"] });
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteThread() {
    if (!canDeleteThread) return;
    if (!confirm("Delete this thread?")) return;
    try {
      await deleteCommunityThread(thread.id);
      queryClient.invalidateQueries({ queryKey: ["community-threads"] });
      onBack();
      toast.success("Thread deleted.");
    } catch {
      toast.error("Failed to delete thread.");
    }
  }

  async function handleDeleteReply(replyId: string) {
    if (!confirm("Delete this reply?")) return;
    try {
      await deleteCommunityReply(thread.id, replyId);
      queryClient.invalidateQueries({ queryKey: ["community-threads"] });
      toast.success("Reply deleted.");
    } catch {
      toast.error("Failed to delete reply.");
    }
  }

  async function handleToggleLike() {
    if (!user) {
      toast.error("Login to like posts.");
      return;
    }
    try {
      await toggleCommunityThreadLike(thread.id);
      queryClient.invalidateQueries({ queryKey: ["community-threads"] });
    } catch {
      toast.error("Failed to like.");
    }
  }

  const catInfo = CATEGORY_INFO[thread.category];

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="pill" onClick={onBack}>
        ← Back to discussions
      </Button>
      <div className="rounded-3xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Badge className={catInfo.color}>{catInfo.label}</Badge>
          <AuthorName name={thread.author} email={thread.authorEmail} />
          <span className="text-xs text-muted-foreground">• {timeAgo(thread.createdAt)}</span>
        </div>
        <h2 className="mt-2 text-lg font-extrabold text-foreground">{thread.title}</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
          {thread.content}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleToggleLike}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ThumbsUp className="h-4 w-4" /> {thread.likes}
          </button>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" /> {thread.replies.length} replies
          </span>
          {canDeleteThread && (
            <button
              onClick={handleDeleteThread}
              className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
      </div>

      <h3 className="text-sm font-bold text-foreground">Replies ({thread.replies.length})</h3>
      {thread.replies.map((reply) => (
        <div key={reply.id} className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center gap-2">
            <AuthorName name={reply.author} email={reply.authorEmail} />
            <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
            {canDeleteReply(reply) && (
              <button
                onClick={() => handleDeleteReply(reply.id)}
                className="ml-auto text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-foreground">{reply.content}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="h-3 w-3" /> {reply.likes}
          </div>
        </div>
      ))}

      {user ? (
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
          />
          <div className="mt-2 flex justify-end">
            <Button
              onClick={handleReply}
              disabled={!replyText.trim() || submitting}
              variant="hero"
              size="pill"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}{" "}
              Reply
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </a>{" "}
            to reply.
          </p>
        </div>
      )}
    </div>
  );
}

function CommunityPage() {
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const queryClient = useQueryClient();

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["community-threads"],
    queryFn: listCommunityThreads,
  });

  const [activeTab, setActiveTab] = useState<"all" | ThreadCategory>("all");
  const [selectedThread, setSelectedThread] = useState<CommunityThread | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState<ThreadCategory>("tips");
  const [showNewThread, setShowNewThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredThreads =
    activeTab === "all" ? threads : threads.filter((t) => t.category === activeTab);

  async function handleNewThread() {
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !user) return;
    setSubmitting(true);
    try {
      await createCommunityThread({
        title: newThreadTitle.trim(),
        author: isAdmin ? "Admin" : user.name,
        authorEmail: user.email,
        category: newThreadCategory,
        content: newThreadContent.trim(),
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      setShowNewThread(false);
      queryClient.invalidateQueries({ queryKey: ["community-threads"] });
      toast.success("Thread posted!");
    } catch {
      toast.error("Failed to post thread.");
    } finally {
      setSubmitting(false);
    }
  }

  if (selectedThread) {
    const latest = threads.find((t) => t.id === selectedThread.id) ?? selectedThread;
    return (
      <DashboardShell title="Community" subtitle="Discussion">
        <ThreadDetail
          thread={latest}
          onBack={() => setSelectedThread(null)}
          user={user}
          isAdmin={isAdmin}
          queryClient={queryClient}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Community" subtitle="Discuss, share, and learn together">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: "All", icon: Users },
              { id: "tips" as const, label: "Tips", icon: PenLine },
              { id: "question" as const, label: "Questions", icon: MessageSquare },
              { id: "experience" as const, label: "Experiences", icon: Clock },
            ].map((tab) => (
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
          {user ? (
            <Button onClick={() => setShowNewThread(true)} variant="hero" size="pill">
              + New Thread
            </Button>
          ) : (
            <a href="/login">
              <Button variant="soft" size="pill">
                Log in to post
              </Button>
            </a>
          )}
        </div>

        {showNewThread && (
          <div className="rounded-3xl bg-card p-6 shadow-card space-y-4">
            <h3 className="font-bold text-foreground">Start a Discussion</h3>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge className="bg-primary/10 text-primary">
                  <Shield className="mr-1 h-3 w-3" /> Posting as Admin
                </Badge>
              )}
            </div>
            <select
              value={newThreadCategory}
              onChange={(e) => setNewThreadCategory(e.target.value as ThreadCategory)}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
            >
              <option value="tips">Tips & Strategies</option>
              <option value="question">Question</option>
              <option value="experience">Experience</option>
              <option value="resource">Resource</option>
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
              <Button
                onClick={handleNewThread}
                disabled={!newThreadTitle.trim() || !newThreadContent.trim() || submitting}
                variant="hero"
                size="pill"
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post Thread
              </Button>
              <Button onClick={() => setShowNewThread(false)} variant="ghost" size="pill">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredThreads.map((thread) => {
              const catInfo = CATEGORY_INFO[thread.category];
              const canDelete = isAdmin || thread.authorEmail === user?.email;
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className="w-full rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={catInfo.color}>{catInfo.label}</Badge>
                    <AuthorName name={thread.author} email={thread.authorEmail} />
                    <span className="text-xs text-muted-foreground">
                      • {timeAgo(thread.createdAt)}
                    </span>
                    {canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this thread?")) {
                            deleteCommunityThread(thread.id).then(() =>
                              queryClient.invalidateQueries({ queryKey: ["community-threads"] }),
                            );
                          }
                        }}
                        className="ml-auto text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="mt-2 font-bold text-foreground">{thread.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {thread.content}
                  </p>
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
        )}
      </div>
    </DashboardShell>
  );
}
