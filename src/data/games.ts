export const gameWords: { word: string; hint: string }[] = [
  { word: "ambitious", hint: "Having a strong desire to succeed" },
  { word: "reluctant", hint: "Unwilling and hesitant" },
  { word: "sustainable", hint: "Able to continue over time without harm" },
  { word: "vocabulary", hint: "All the words a person knows" },
  { word: "deadline", hint: "The latest time to finish something" },
  { word: "confident", hint: "Sure of yourself" },
  { word: "opportunity", hint: "A chance to do something" },
  { word: "improve", hint: "To make better" },
  { word: "fluency", hint: "Speaking smoothly and easily" },
  { word: "challenge", hint: "Something difficult that tests you" },
  { word: "knowledge", hint: "Information and understanding" },
  { word: "persuade", hint: "To convince someone" },
];

export interface QuizItem {
  q: string;
  options: string[];
  answer: number;
}

export const vocabularyQuiz: QuizItem[] = [
  { q: "Synonym of 'enormous'", options: ["Tiny", "Huge", "Quick", "Quiet"], answer: 1 },
  { q: "Opposite of 'scarce'", options: ["Rare", "Abundant", "Limited", "Empty"], answer: 1 },
  { q: "'To postpone' means to…", options: ["Cancel", "Delay", "Finish", "Begin"], answer: 1 },
  { q: "A 'meticulous' person is…", options: ["Careless", "Very careful", "Loud", "Lazy"], answer: 1 },
  { q: "Synonym of 'crucial'", options: ["Essential", "Optional", "Boring", "Cheap"], answer: 0 },
  { q: "'Weary' means…", options: ["Excited", "Tired", "Angry", "Curious"], answer: 1 },
  { q: "Opposite of 'temporary'", options: ["Brief", "Permanent", "Short", "Fast"], answer: 1 },
  { q: "'To acquire' means to…", options: ["Lose", "Obtain", "Break", "Sell"], answer: 1 },
  { q: "A 'vivid' description is…", options: ["Vague", "Clear and detailed", "Short", "False"], answer: 1 },
  { q: "Synonym of 'reveal'", options: ["Hide", "Disclose", "Deny", "Repeat"], answer: 1 },
  { q: "'Diligent' means…", options: ["Hardworking", "Rude", "Sleepy", "Wealthy"], answer: 0 },
  { q: "Opposite of 'ancient'", options: ["Old", "Modern", "Historic", "Classic"], answer: 1 },
];

export const scrambleWords = [
  "listening",
  "grammar",
  "practice",
  "speaking",
  "reading",
  "writing",
  "student",
  "teacher",
  "english",
  "success",
];
