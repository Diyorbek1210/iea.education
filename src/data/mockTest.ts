export interface McQuestion {
  q: string;
  options: string[];
  answer: number;
}

export const listeningQuestions: McQuestion[] = [
  {
    q: "Transcript: 'The library closes at half past eight on weekdays.' — When does the library close?",
    options: ["7:30", "8:00", "8:30", "9:30"],
    answer: 2,
  },
  {
    q: "Transcript: 'Book the room online; phone bookings cost £5 extra.' — What is cheaper?",
    options: ["Phone booking", "Online booking", "Both the same", "Walk-in"],
    answer: 1,
  },
  {
    q: "Transcript: 'Meet at platform nine, not platform five.' — Which platform?",
    options: ["Five", "Nine", "Nineteen", "Fifteen"],
    answer: 1,
  },
  {
    q: "Transcript: 'The tour lasts about two and a half hours.' — Duration?",
    options: ["2 hours", "2.5 hours", "3 hours", "1.5 hours"],
    answer: 1,
  },
  {
    q: "Transcript: 'Bring photo ID; the membership card is optional.' — What is required?",
    options: ["Membership card", "Photo ID", "Passport photo", "Nothing"],
    answer: 1,
  },
];

export const readingQuestions: McQuestion[] = [
  {
    q: "Passage: 'Urban beekeeping has grown rapidly, though city hives yield less honey than rural ones.' — City hives produce…",
    options: ["More honey", "Less honey", "The same", "No honey"],
    answer: 1,
  },
  {
    q: "The word 'yield' in the passage is closest in meaning to:",
    options: ["Produce", "Refuse", "Store", "Waste"],
    answer: 0,
  },
  {
    q: "Passage: 'Researchers suspect, but have not proven, a link to pesticide use.' — The link is:",
    options: ["Proven", "Disproven", "Suspected", "Irrelevant"],
    answer: 2,
  },
  {
    q: "Passage: 'Few councils fund the scheme; most rely on volunteers.' — Funding mainly comes from:",
    options: ["Councils", "Volunteers", "Government", "Companies"],
    answer: 1,
  },
  {
    q: "The best title for the passage would be:",
    options: [
      "The economics of rural farming",
      "Bees in the city: growth and limits",
      "A history of pesticides",
      "How to make honey at home",
    ],
    answer: 1,
  },
];

export const writingPrompt =
  "Some people believe that studying online is as effective as attending classes in person. To what extent do you agree or disagree? Write at least 250 words.";

export const speakingPrompt =
  "Describe a skill you would like to learn. You should say: what it is, why you want to learn it, how you would learn it, and explain how it would change your life. Speak for 1–2 minutes (type your response).";

/** Very simple heuristic band estimate for typed responses. */
export function estimateWritten(text: string, target: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  const ratio = Math.min(words / target, 1);
  const unique = new Set(text.toLowerCase().match(/[a-z']+/g) ?? []).size;
  const variety = Math.min(unique / Math.max(words * 0.45, 1), 1);
  return Math.round((3 + ratio * 4 + variety * 2) * 2) / 2;
}

export function bandFromCorrect(correct: number, total: number): number {
  const pct = correct / total;
  return Math.round((3 + pct * 6) * 2) / 2;
}
