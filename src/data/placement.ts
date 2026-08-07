import type { Level } from "@/lib/types";

export interface Question {
  q: string;
  options: string[];
  answer: number;
}

export const placementQuestions: Question[] = [
  { q: "___ name is Ali.", options: ["My", "Me", "I", "Mine"], answer: 0 },
  { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
  { q: "There ___ two books on the table.", options: ["is", "am", "are", "be"], answer: 2 },
  { q: "I ___ coffee at the moment.", options: ["drink", "drinks", "am drinking", "drank"], answer: 2 },
  { q: "He is taller ___ his brother.", options: ["then", "than", "as", "of"], answer: 1 },
  { q: "We ___ to Paris last summer.", options: ["go", "went", "gone", "have go"], answer: 1 },
  { q: "I have lived here ___ 2015.", options: ["for", "since", "from", "during"], answer: 1 },
  { q: "If it rains, we ___ at home.", options: ["stay", "stayed", "will stay", "would stay"], answer: 2 },
  { q: "The letter ___ yesterday.", options: ["sent", "was sent", "is sent", "sends"], answer: 1 },
  { q: "She asked me where I ___ from.", options: ["come", "came", "coming", "comes"], answer: 1 },
  { q: "Choose the correct word: an ___ decision.", options: ["economic", "economical", "economy", "economically"], answer: 0 },
  { q: "I'd rather you ___ smoke here.", options: ["don't", "didn't", "not", "won't"], answer: 1 },
  { q: "By next June, he ___ his degree.", options: ["finishes", "will finish", "will have finished", "finished"], answer: 2 },
  { q: "It's high time we ___ something about it.", options: ["do", "did", "have done", "will do"], answer: 1 },
  { q: "Hardly ___ the door when the phone rang.", options: ["I had opened", "had I opened", "I opened", "did I open"], answer: 1 },
  { q: "The report is ___ with errors.", options: ["riddled", "filled up", "packed on", "loaded in"], answer: 0 },
  { q: "His argument doesn't ___ water.", options: ["carry", "hold", "keep", "take"], answer: 1 },
  { q: "She takes everything he says with a ___ of salt.", options: ["pinch", "spoon", "bag", "drop"], answer: 0 },
  { q: "Not only ___ late, but he also forgot the files.", options: ["he was", "was he", "he is", "is he"], answer: 1 },
  { q: "The proposal was rejected out of ___.", options: ["hand", "reach", "order", "place"], answer: 0 },
];

export function levelFromScore(score: number): Level {
  if (score <= 5) return "Beginner";
  if (score <= 10) return "Elementary";
  if (score <= 14) return "Intermediate";
  if (score <= 17) return "Upper-Intermediate";
  return "Advanced";
}

export const levelDescription: Record<Level, string> = {
  Beginner: "You're starting from the basics — we'll build your foundation step by step.",
  Elementary: "You know the essentials. Time to grow vocabulary and confidence.",
  Intermediate: "Solid ground. Focus now on accuracy and IELTS exam strategy.",
  "Upper-Intermediate": "Strong English. Targeted practice will push you toward band 7+.",
  Advanced: "Excellent command. Polish precision and exam timing for band 8+.",
};
