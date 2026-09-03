export type SkillType = "listening" | "reading" | "writing" | "speaking";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface StudyTask {
  id: string;
  skill: SkillType;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
}

export interface DailySchedule {
  day: DayOfWeek;
  tasks: StudyTask[];
  totalMinutes: number;
  focusSkill: SkillType | "mixed";
}

export interface StudyPlanConfig {
  targetBand: number;
  examDate: string;
  currentBand: number;
  weakSkills: SkillType[];
  studyHoursPerDay: number;
}

export interface StudyPlan {
  id: string;
  config: StudyPlanConfig;
  createdAt: string;
  weekSchedule: DailySchedule[];
  weekNumber: number;
}

export const DAYS: DayOfWeek[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const TASK_LIBRARY: StudyTask[] = [
  // Listening tasks
  { id: "l-1", skill: "listening", title: "Section 1 Practice", description: "Practice note completion questions with a conversation between two speakers.", durationMinutes: 15, difficulty: "easy", xpReward: 10 },
  { id: "l-2", skill: "listening", title: "Section 2 Practice", description: "Listen to a monologue and answer matching and multiple choice questions.", durationMinutes: 20, difficulty: "medium", xpReward: 15 },
  { id: "l-3", skill: "listening", title: "Section 3 Practice", description: "Academic discussion practice with form completion and MCQs.", durationMinutes: 20, difficulty: "medium", xpReward: 15 },
  { id: "l-4", skill: "listening", title: "Section 4 Practice", description: "Academic lecture with sentence completion and summary tasks.", durationMinutes: 25, difficulty: "hard", xpReward: 20 },
  { id: "l-5", skill: "listening", title: "Dictation Exercise", description: "Listen to short passages and write down exactly what you hear.", durationMinutes: 10, difficulty: "easy", xpReward: 10 },
  { id: "l-6", skill: "listening", title: "Speed Listening", description: "Listen to podcasts at 1.25x speed and answer comprehension questions.", durationMinutes: 20, difficulty: "hard", xpReward: 20 },

  // Reading tasks
  { id: "r-1", skill: "reading", title: "True/False/Not Given Drill", description: "Practice identifying true, false, and not given statements in academic texts.", durationMinutes: 15, difficulty: "easy", xpReward: 10 },
  { id: "r-2", skill: "reading", title: "Matching Headings", description: "Match paragraph headings to the correct paragraphs in a passage.", durationMinutes: 20, difficulty: "medium", xpReward: 15 },
  { id: "r-3", skill: "reading", title: "Summary Completion", description: "Complete a summary of a reading passage using words from the text.", durationMinutes: 15, difficulty: "medium", xpReward: 15 },
  { id: "r-4", skill: "reading", title: "Skimming & Scanning", description: "Quickly find specific information in a long passage under time pressure.", durationMinutes: 10, difficulty: "easy", xpReward: 10 },
  { id: "r-5", skill: "reading", title: "Passage 3 (Hardest)", description: "Tackle the most challenging reading passage with complex questions.", durationMinutes: 25, difficulty: "hard", xpReward: 20 },
  { id: "r-6", skill: "reading", title: "Speed Reading", description: "Read passages quickly and answer questions within strict time limits.", durationMinutes: 15, difficulty: "hard", xpReward: 20 },

  // Writing tasks
  { id: "w-1", skill: "writing", title: "Task 1 Report Practice", description: "Write a report describing a graph, chart, or diagram in at least 150 words.", durationMinutes: 20, difficulty: "medium", xpReward: 15 },
  { id: "w-2", skill: "writing", title: "Task 2 Essay Practice", description: "Write a full essay responding to a prompt in at least 250 words.", durationMinutes: 40, difficulty: "hard", xpReward: 25 },
  { id: "w-3", skill: "writing", title: "Introduction Writing", description: "Practice writing strong introductions for different essay types.", durationMinutes: 10, difficulty: "easy", xpReward: 10 },
  { id: "w-4", skill: "writing", title: "Body Paragraph Practice", description: "Write well-structured body paragraphs with clear topic sentences.", durationMinutes: 15, difficulty: "medium", xpReward: 15 },
  { id: "w-5", skill: "writing", title: "Vocabulary Expansion", description: "Learn and practice using advanced vocabulary in writing context.", durationMinutes: 15, difficulty: "medium", xpReward: 15 },
  { id: "w-6", skill: "writing", title: "Grammar Focus", description: "Practice complex sentence structures and error correction.", durationMinutes: 15, difficulty: "medium", xpReward: 15 },

  // Speaking tasks
  { id: "s-1", skill: "speaking", title: "Part 1 Practice", description: "Answer personal questions about familiar topics naturally.", durationMinutes: 10, difficulty: "easy", xpReward: 10 },
  { id: "s-2", skill: "speaking", title: "Part 2 Cue Card", description: "Prepare and deliver a 2-minute talk on a given topic.", durationMinutes: 15, difficulty: "medium", xpReward: 15 },
  { id: "s-3", skill: "speaking", title: "Part 3 Discussion", description: "Discuss abstract ideas and give opinions on complex topics.", durationMinutes: 15, difficulty: "hard", xpReward: 15 },
  { id: "s-4", skill: "speaking", title: "Pronunciation Drill", description: "Practice difficult sounds and word stress patterns.", durationMinutes: 10, difficulty: "easy", xpReward: 10 },
  { id: "s-5", skill: "speaking", title: "Fluency Practice", description: "Speak for 2 minutes on random topics without hesitation.", durationMinutes: 10, difficulty: "medium", xpReward: 15 },
  { id: "s-6", skill: "speaking", title: "Full Speaking Mock", description: "Complete a full speaking test with all three parts.", durationMinutes: 15, difficulty: "hard", xpReward: 20 },
];

export function generateStudyPlan(config: StudyPlanConfig): StudyPlan {
  const targetMinutes = config.studyHoursPerDay * 60;
  const weakSkills = new Set(config.weakSkills);

  const prioritizeWeak = (tasks: StudyTask[]): StudyTask[] => {
    return [...tasks].sort((a, b) => {
      const aWeak = weakSkills.has(a.skill) ? 0 : 1;
      const bWeak = weakSkills.has(b.skill) ? 0 : 1;
      return aWeak - bWeak;
    });
  };

  const selectTasks = (available: StudyTask[], maxMinutes: number): StudyTask[] => {
    const selected: StudyTask[] = [];
    let total = 0;
    for (const task of available) {
      if (total + task.durationMinutes <= maxMinutes) {
        selected.push(task);
        total += task.durationMinutes;
      }
    }
    return selected;
  };

  const skillDistribution: Array<SkillType | "mixed"> = [
    "listening", "reading", "writing", "speaking",
    "mixed", "listening", "reading",
  ];

  const weekSchedule: DailySchedule[] = DAYS.map((day, index) => {
    const focusSkill = skillDistribution[index % skillDistribution.length]!;
    let available = focusSkill === "mixed"
      ? prioritizeWeak([...TASK_LIBRARY])
      : prioritizeWeak(TASK_LIBRARY.filter((t) => t.skill === focusSkill));

    const tasks = selectTasks(available, targetMinutes);

    return {
      day,
      tasks,
      totalMinutes: tasks.reduce((sum, t) => sum + t.durationMinutes, 0),
      focusSkill,
    };
  });

  return {
    id: crypto.randomUUID(),
    config,
    createdAt: new Date().toISOString(),
    weekSchedule,
    weekNumber: 1,
  };
}

export function getTaskLibrary(): StudyTask[] {
  return [...TASK_LIBRARY];
}

export function getTasksBySkill(skill: SkillType): StudyTask[] {
  return TASK_LIBRARY.filter((t) => t.skill === skill);
}

export function daysUntilExam(examDate: string): number {
  const exam = new Date(examDate);
  const now = new Date();
  const diff = exam.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function weeksUntilExam(examDate: string): number {
  return Math.ceil(daysUntilExam(examDate) / 7);
}
