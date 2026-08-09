export type BadgeCriteria =
  | { type: "streak"; days: number }
  | { type: "videosWatched"; count: number }
  | { type: "mockTestsTaken"; count: number }
  | { type: "gamesPlayed"; count: number }
  | { type: "xp"; amount: number }
  | { type: "placementCompleted" };

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  criteria: BadgeCriteria;
}

export const BADGES: BadgeDef[] = [
  {
    id: "placement-done",
    name: "Level Found",
    description: "Completed the placement test",
    icon: "CheckCircle2",
    criteria: { type: "placementCompleted" },
  },
  {
    id: "streak-3",
    name: "Warming Up",
    description: "3-day streak",
    icon: "Flame",
    criteria: { type: "streak", days: 3 },
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "7-day streak",
    icon: "Flame",
    criteria: { type: "streak", days: 7 },
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "30-day streak",
    icon: "Flame",
    criteria: { type: "streak", days: 30 },
  },
  {
    id: "videos-5",
    name: "Bonus Unlocked",
    description: "Watched 5 video lessons",
    icon: "Gift",
    criteria: { type: "videosWatched", count: 5 },
  },
  {
    id: "videos-15",
    name: "Video Scholar",
    description: "Watched 15 video lessons",
    icon: "PlayCircle",
    criteria: { type: "videosWatched", count: 15 },
  },
  {
    id: "mock-1",
    name: "First Mock",
    description: "Completed your first mock test",
    icon: "ClipboardCheck",
    criteria: { type: "mockTestsTaken", count: 1 },
  },
  {
    id: "mock-5",
    name: "Mock Marathoner",
    description: "Completed 5 mock tests",
    icon: "ClipboardCheck",
    criteria: { type: "mockTestsTaken", count: 5 },
  },
  {
    id: "mock-10",
    name: "IELTS Ready",
    description: "Completed all 10 mock tests",
    icon: "Trophy",
    criteria: { type: "mockTestsTaken", count: 10 },
  },
  {
    id: "games-10",
    name: "Game On",
    description: "Played 10 games",
    icon: "Gamepad2",
    criteria: { type: "gamesPlayed", count: 10 },
  },
  {
    id: "xp-100",
    name: "Rising Star",
    description: "Earned 100 XP",
    icon: "Star",
    criteria: { type: "xp", amount: 100 },
  },
  {
    id: "xp-500",
    name: "XP Champion",
    description: "Earned 500 XP",
    icon: "Trophy",
    criteria: { type: "xp", amount: 500 },
  },
];
