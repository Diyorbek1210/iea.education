import { createServerFn } from "@tanstack/react-start";

import {
  assertSameOrigin,
  enforceRateLimit,
  loadServiceAccountEnv,
  readCollectionWithAdmin,
} from "./firebaseAdmin";

/**
 * Cross-user leaderboard.
 *
 * The rankings span every student, but the underlying mock results also hold
 * each student's essays and speaking transcripts. Serving those through a
 * client query would expose them to any signed-in user, so the aggregate is
 * computed here and only the three display fields leave the server.
 */

export interface LeaderboardEntry {
  userId: string;
  name: string;
  band: number;
  attempts: number;
}

export const fetchLeaderboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ entries: LeaderboardEntry[] }> => {
    assertSameOrigin();
    enforceRateLimit("leaderboard", 60, 60_000);

    const { clientEmail, privateKey } = await loadServiceAccountEnv();
    if (!clientEmail || !privateKey) {
      // Degrades to the empty state rather than leaking raw documents through
      // a looser client-side query path.
      console.warn("[leaderboard] service account env missing; returning an empty leaderboard");
      return { entries: [] };
    }

    try {
      const rows = await readCollectionWithAdmin("mockResults", [
        "userId",
        "userName",
        "overall",
        "date",
      ]);

      const best = new Map<string, LeaderboardEntry>();
      for (const row of rows) {
        const userId = typeof row["userId"] === "string" ? row["userId"] : "";
        if (!userId) continue;
        const overall = typeof row["overall"] === "number" ? row["overall"] : 0;
        const name = typeof row["userName"] === "string" ? row["userName"] : "Learner";
        const current = best.get(userId);
        best.set(userId, {
          userId,
          name: current?.name || name,
          band: Math.max(current?.band ?? 0, overall),
          attempts: (current?.attempts ?? 0) + 1,
        });
      }

      return { entries: [...best.values()].sort((a, b) => b.band - a.band).slice(0, 100) };
    } catch (error) {
      console.error("[leaderboard] read failed", error);
      return { entries: [] };
    }
  },
);
