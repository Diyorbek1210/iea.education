export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "official" | "video" | "book" | "website" | "app";
  skill: "all" | "listening" | "reading" | "writing" | "speaking";
  isFree: boolean;
}

export const IELTS_RESOURCES: Resource[] = [
  // Official
  {
    id: "r1",
    title: "British Council — IELTS Practice",
    description: "Free practice tests, tips, and preparation materials from the official IELTS test provider.",
    url: "https://www.britishcouncil.org/exam/ielts/practice-tests",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r2",
    title: "IDP IELTS — Free Practice Tests",
    description: "Official IELTS practice tests and preparation resources from IDP.",
    url: "https://www.ielts.idp.com/prepare",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r3",
    title: "IELTS.org — Official Info",
    description: "Official IELTS website with test format, registration, and preparation resources.",
    url: "https://www.ielts.org",
    type: "official",
    skill: "all",
    isFree: true,
  },
  // Websites
  {
    id: "r4",
    title: "IELTS Liz",
    description: "Free lessons, tips, and model answers for all IELTS skills. One of the most popular free resources.",
    url: "https://ieltsliz.com",
    type: "website",
    skill: "all",
    isFree: true,
  },
  {
    id: "r5",
    title: "IELTS Simon",
    description: "Former IELTS examiner providing writing and speaking tips with band 9 model answers.",
    url: "https://ielts-simon.com",
    type: "website",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r6",
    title: "IELTS Advantage",
    description: "Strategies, tips, and free lessons for all IELTS skills.",
    url: "https://ieltsadvantage.com",
    type: "website",
    skill: "all",
    isFree: true,
  },
  {
    id: "r7",
    title: "IELTS Buddy",
    description: "Free IELTS lessons, sample answers, and preparation tips.",
    url: "https://www.ieltsbuddy.com",
    type: "website",
    skill: "all",
    isFree: true,
  },
  {
    id: "r8",
    title: "Road to IELTS (British Council)",
    description: "Free interactive activities and practice tests from British Council.",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/road-to-ielts",
    type: "website",
    skill: "all",
    isFree: true,
  },
  // Listening resources
  {
    id: "r9",
    title: "BBC Learning English",
    description: "Free English listening practice with real-world topics and different accents.",
    url: "https://www.bbc.co.uk/learningenglish",
    type: "website",
    skill: "listening",
    isFree: true,
  },
  {
    id: "r10",
    title: "TED Talks",
    description: "Watch talks on various topics to practice academic listening comprehension.",
    url: "https://www.ted.com",
    type: "website",
    skill: "listening",
    isFree: true,
  },
  {
    id: "r11",
    title: "IELTS Listening Practice (YouTube)",
    description: "YouTube channel with full listening practice tests and answers.",
    url: "https://www.youtube.com/results?search_query=ielts+listening+practice+test",
    type: "video",
    skill: "listening",
    isFree: true,
  },
  // Writing resources
  {
    id: "r12",
    title: "Grammarly",
    description: "Free writing tool that checks grammar, spelling, and punctuation.",
    url: "https://www.grammarly.com",
    type: "app",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r13",
    title: "Academic Word List (AWL)",
    description: "570 essential word families for academic English. Master these for higher band scores.",
    url: "https://www.tandfonline.com/doi/abs/10.1080/0952398042000292170",
    type: "website",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r14",
    title: "IELTS Writing Task 1 — Vocabulary",
    description: "Essential vocabulary for describing graphs, charts, and diagrams.",
    url: "https://ieltsliz.com/ielts-writing-task-1/",
    type: "website",
    skill: "writing",
    isFree: true,
  },
  // Speaking resources
  {
    id: "r15",
    title: "English Speaking Practice (YouTube)",
    description: "YouTube channels for practicing speaking with native speakers.",
    url: "https://www.youtube.com/results?search_query=ielts+speaking+practice",
    type: "video",
    skill: "speaking",
    isFree: true,
  },
  {
    id: "r16",
    title: "Forvo — Pronunciation Dictionary",
    description: "Hear how words are pronounced by native speakers from around the world.",
    url: "https://forvo.com",
    type: "website",
    skill: "speaking",
    isFree: true,
  },
  // Reading resources
  {
    id: "r17",
    title: "The Economist",
    description: "Read articles on global affairs to practice academic reading comprehension.",
    url: "https://www.economist.com",
    type: "website",
    skill: "reading",
    isFree: false,
  },
  {
    id: "r18",
    title: "National Geographic",
    description: "Read science and nature articles to improve reading skills and vocabulary.",
    url: "https://www.nationalgeographic.com",
    type: "website",
    skill: "reading",
    isFree: false,
  },
  {
    id: "r19",
    title: "The Guardian",
    description: "Free news articles to practice reading comprehension on various topics.",
    url: "https://www.theguardian.com",
    type: "website",
    skill: "reading",
    isFree: true,
  },
  // Books
  {
    id: "r20",
    title: "Cambridge IELTS 14–18",
    description: "Official Cambridge practice tests — the gold standard for IELTS preparation.",
    url: "https://www.cambridge.org/gb/cambridgeenglish/catalog/cambridge-ielts-18",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r21",
    title: "Collins IELTS Reading for IELTS",
    description: "Focused reading practice with strategies and authentic texts.",
    url: "https://www.collinsdictionary.com",
    type: "book",
    skill: "reading",
    isFree: false,
  },
  {
    id: "r22",
    title: "Barron's IELTS Superpack",
    description: "Comprehensive preparation with practice tests, audio, and strategies.",
    url: "https://www.barronseduc.com",
    type: "book",
    skill: "all",
    isFree: false,
  },
];

export function getResourcesByType(type: Resource["type"]): Resource[] {
  return IELTS_RESOURCES.filter((r) => r.type === type);
}

export function getResourcesBySkill(skill: Resource["skill"]): Resource[] {
  return IELTS_RESOURCES.filter((r) => r.skill === skill || r.skill === "all");
}

export function getFreeResources(): Resource[] {
  return IELTS_RESOURCES.filter((r) => r.isFree);
}
