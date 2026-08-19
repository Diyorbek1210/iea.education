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
  // ── Official Sources ──────────────────────────────────────────────
  {
    id: "r1",
    title: "IELTS.org — Official Test Makers",
    description: "Official IELTS website by Cambridge, British Council & IDP. Free sample questions for all 4 skills, test format info, and preparation resources.",
    url: "https://ielts.org/take-a-test/preparation-resources",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r2",
    title: "Cambridge English — IELTS Preparation",
    description: "Official IELTS preparation hub from Cambridge Assessment English. Free paper-based sample tests, test format guides, and preparation tips.",
    url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r3",
    title: "British Council — Free IELTS Practice Tests",
    description: "Free IELTS Academic and General Training practice tests for all 4 skills from the official British Council. Real past-paper questions with instant marking.",
    url: "https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r4",
    title: "IDP IELTS — Free Practice Tests",
    description: "Official IELTS practice tests and preparation resources from IDP: IELTS Australia. Free sample questions and test-day tips.",
    url: "https://www.ielts.idp.com/prepare",
    type: "official",
    skill: "all",
    isFree: true,
  },

  // ── Cambridge Books ───────────────────────────────────────────────
  {
    id: "r5",
    title: "Cambridge IELTS 21 Practice Tests (2025)",
    description: "The latest official Cambridge IELTS book — 4 authentic past papers for Academic & General Training with answers and digital audio pack. Published 2025.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-20-practice-test",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r6",
    title: "Cambridge IELTS 20 Practice Tests (2025)",
    description: "Official Cambridge practice tests with 4 authentic examination papers, answer keys, listening audio, and sample writing/speaking answers.",
    url: "https://www.cambridge.org/us/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-20-practice-test",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r7",
    title: "The Official Cambridge Guide to IELTS",
    description: "The definitive IELTS guide by Pauline Cullen, Amanda French & Vanessa Jakeman. 8 full practice tests with skills development and test-taking strategies.",
    url: "https://shop.cambridge.org/english/product/2700253333",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r8",
    title: "Cambridge IELTS 18 Academic (2023)",
    description: "Authentic practice papers from Cambridge Assessment. 4 complete Academic tests with answer keys, audio scripts, and downloadable audio.",
    url: "https://www.cambridgebookshop.co.uk/collections/ielts",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r9",
    title: "IELTS Test & Train — Free Mini App",
    description: "Cambridge's official free mini IELTS app. Practice all Academic skills with interactive questions and instant feedback.",
    url: "https://shop.cambridge.org/english/exam/ielts",
    type: "app",
    skill: "all",
    isFree: true,
  },

  // ── Free Websites ────────────────────────────────────────────────
  {
    id: "r10",
    title: "IELTS Liz",
    description: "Free lessons, tips, and model answers for all IELTS skills. Former IELTS examiner. One of the most trusted free IELTS resources online.",
    url: "https://ieltsliz.com",
    type: "website",
    skill: "all",
    isFree: true,
  },
  {
    id: "r11",
    title: "IELTS Simon",
    description: "Band 9 model answers and writing strategies from a former IELTS examiner. Focused on Writing Task 1 and Task 2 with detailed explanations.",
    url: "https://ielts-simon.com",
    type: "website",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r12",
    title: "Road to IELTS — British Council",
    description: "Free interactive activities and practice tests from British Council. Includes video tutorials, practice exercises, and mock tests.",
    url: "https://takeielts.britishcouncil.org/take-ielts/prepare/road-to-ielts",
    type: "website",
    skill: "all",
    isFree: true,
  },
  {
    id: "r13",
    title: "Cambridge Ready — Free Exam Practice",
    description: "Free platform with 1,300+ exercises from real Cambridge past papers. AI-marked writing with band scores and explanations for every question.",
    url: "https://cambridgeready.com",
    type: "website",
    skill: "all",
    isFree: true,
  },

  // ── Listening ─────────────────────────────────────────────────────
  {
    id: "r14",
    title: "BBC Learning English",
    description: "Free English listening practice with real-world topics, different accents, and varying difficulty levels. Great for IELTS Listening Section 4 preparation.",
    url: "https://www.bbc.co.uk/learningenglish",
    type: "website",
    skill: "listening",
    isFree: true,
  },
  {
    id: "r15",
    title: "TED Talks — Academic Listening",
    description: "Watch talks on science, technology, and society to practice academic listening comprehension. Similar to IELTS Listening Sections 3 & 4.",
    url: "https://www.ted.com",
    type: "website",
    skill: "listening",
    isFree: true,
  },
  {
    id: "r16",
    title: "IELTS Listening Practice — YouTube",
    description: "Full-length IELTS listening practice tests with audio, answers, and score conversion tables. Practice under real exam conditions.",
    url: "https://www.youtube.com/results?search_query=ielts+listening+practice+test+full",
    type: "video",
    skill: "listening",
    isFree: true,
  },

  // ── Reading ───────────────────────────────────────────────────────
  {
    id: "r17",
    title: "The Guardian — Free News Articles",
    description: "Free high-quality articles on global topics. Practice reading comprehension with texts similar to IELTS Academic Reading passages.",
    url: "https://www.theguardian.com",
    type: "website",
    skill: "reading",
    isFree: true,
  },
  {
    id: "r18",
    title: "National Geographic — Science Reading",
    description: "Read science, nature, and environment articles to build vocabulary and improve reading comprehension for IELTS topics.",
    url: "https://www.nationalgeographic.com",
    type: "website",
    skill: "reading",
    isFree: false,
  },
  {
    id: "r19",
    title: "IELTSix — Cambridge 20 Reading Tests",
    description: "Free IELTS reading practice tests based on Cambridge IELTS 20 passages. Authentic topics with answers and explanations.",
    url: "https://ieltsix.com/ielts/ielts-reading/the-ultimate-ielts-reading-practice-tests-with-answers/",
    type: "website",
    skill: "reading",
    isFree: true,
  },

  // ── Writing ───────────────────────────────────────────────────────
  {
    id: "r20",
    title: "Grammarly — Writing Checker",
    description: "Free AI writing assistant that checks grammar, spelling, and punctuation. Use it to review your IELTS practice essays before self-marking.",
    url: "https://www.grammarly.com",
    type: "app",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r21",
    title: "IELTS Writing Task 1 Vocabulary — IELTS Liz",
    description: "Essential vocabulary for describing graphs, charts, processes, and maps. Organised by function with example sentences.",
    url: "https://ieltsliz.com/ielts-writing-task-1/",
    type: "website",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r22",
    title: "Cambridge IELTS Writing Resources",
    description: "Official Cambridge self-study courses for IELTS Academic Writing. 6-hour and 4-hour courses available through Cambridge English Shop.",
    url: "https://shop.cambridge.org/english/exam/ielts",
    type: "website",
    skill: "writing",
    isFree: false,
  },

  // ── Speaking ──────────────────────────────────────────────────────
  {
    id: "r23",
    title: "Forvo — Pronunciation Dictionary",
    description: "Hear how words are pronounced by native speakers from around the world. Great for improving pronunciation and confidence for IELTS Speaking.",
    url: "https://forvo.com",
    type: "website",
    skill: "speaking",
    isFree: true,
  },
  {
    id: "r24",
    title: "IELTS Speaking Practice — YouTube",
    description: "Full IELTS Speaking test simulations with examiner feedback. Practice Part 1, 2, and 3 questions under timed conditions.",
    url: "https://www.youtube.com/results?search_query=ielts+speaking+practice+test+full",
    type: "video",
    skill: "speaking",
    isFree: true,
  },

  // ── Apps ──────────────────────────────────────────────────────────
  {
    id: "r25",
    title: "Cambridge IELTS Test & Train",
    description: "Official Cambridge IELTS preparation app. Interactive practice for all skills with progress tracking. Available on iOS and Android.",
    url: "https://shop.cambridge.org/english/exam/ielts",
    type: "app",
    skill: "all",
    isFree: false,
  },
  {
    id: "r26",
    title: "Mindset for IELTS — Cambridge",
    description: "4-level coursebook from Cambridge with print and online content. Develops all skills and strategies needed for IELTS success.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/mindset-ielts-updated-digital-pack",
    type: "book",
    skill: "all",
    isFree: false,
  },

  // ── Cambridge IELTS Books ────────────────────────────────────────
  {
    id: "r27",
    title: "Cambridge IELTS 19 Practice Tests",
    description: "Official Cambridge IELTS 19 — 4 authentic Academic & General Training past papers with answer keys, audio scripts, and downloadable audio pack.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-19",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r28",
    title: "Cambridge IELTS 18 General Training",
    description: "Authentic General Training past papers from Cambridge IELTS 18. Includes Reading & Writing modules for General Training with complete answer keys.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-18",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r29",
    title: "Cambridge IELTS 17 Practice Tests",
    description: "Official practice material from Cambridge Assessment. 4 full Academic tests with detailed answer explanations and listening audio files.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-17",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r30",
    title: "Cambridge IELTS 16 Practice Tests",
    description: "Past examination papers from Cambridge Assessment English. 4 complete Academic tests with answer keys and downloadable audio for Listening.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-16",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r31",
    title: "Cambridge IELTS 15 Practice Tests",
    description: "Authentic IELTS practice tests from Cambridge Assessment. 4 Academic papers with audio scripts, answer keys, and sample Writing answers.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-15",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r32",
    title: "Cambridge IELTS 14 Practice Tests",
    description: "Official past papers for Academic & General Training. Includes Listening, Reading, Writing, and Speaking with model answers and examiner comments.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-14",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r33",
    title: "Cambridge IELTS 13 Practice Tests",
    description: "4 authentic Academic practice tests from Cambridge Assessment. Complete with answer keys, audio scripts, and band score conversion tables.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-13",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r34",
    title: "Cambridge IELTS 12 Practice Tests",
    description: "Official IELTS past papers from Cambridge. Includes 4 Academic tests with listening audio, reading answer keys, and writing model responses.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-12",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r35",
    title: "Cambridge IELTS 11 Practice Tests",
    description: "Authentic practice tests for Academic & General Training. Listening and Reading answer keys with full audio scripts and scoring guidelines.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-11",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r36",
    title: "Cambridge IELTS 10 Practice Tests",
    description: "Official Cambridge past papers with 4 complete Academic tests. Audio for Listening, answer keys, and sample Writing Task 1 & Task 2 responses.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-10",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r37",
    title: "Cambridge IELTS Trainer 2",
    description: "6 full practice tests from Cambridge with guided practice and test-taking tips. Ideal for self-study with detailed answer explanations and audio.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/ielts-trainer-2",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r38",
    title: "Cambridge Grammar for IELTS",
    description: "Comprehensive grammar reference and practice book from Cambridge. Covers all grammar points needed for IELTS with exercises and exam tips.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/cambridge-grammar-ielts",
    type: "book",
    skill: "writing",
    isFree: false,
  },
  {
    id: "r39",
    title: "Cambridge Vocabulary for IELTS",
    description: "Essential vocabulary builder from Cambridge with topic-based units covering all IELTS themes. Includes practice exercises and test strategies.",
    url: "https://www.cambridge.org/cambridgeenglish/catalog/cambridge-english-exams-ielts/cambridge-vocabulary-ielts",
    type: "book",
    skill: "all",
    isFree: false,
  },
  {
    id: "r40",
    title: "Cambridge English Self-Study Online Courses",
    description: "Free self-study online courses from Cambridge Assessment English. Covers all IELTS skills with interactive exercises, videos, and progress tracking.",
    url: "https://www.cambridgeenglish.org/learning-english/",
    type: "official",
    skill: "all",
    isFree: true,
  },

  // ── Cambridge Online Practice ────────────────────────────────────
  {
    id: "r41",
    title: "Cambridge IELTS Prepare — Official Platform",
    description: "Official Cambridge IELTS preparation platform with practice tests, tutorials, and tips for Academic & General Training modules.",
    url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/",
    type: "official",
    skill: "all",
    isFree: true,
  },
  {
    id: "r42",
    title: "Cambridge Test Bank — Reading Practice",
    description: "Cambridge IELTS reading practice passages with true/false/not given, matching headings, and summary completion exercises from official sources.",
    url: "https://cambridgeready.com/ielts-reading-practice",
    type: "website",
    skill: "reading",
    isFree: true,
  },
  {
    id: "r43",
    title: "Cambridge IELTS Listening — Section 1-4 Practice",
    description: "Official Cambridge listening practice covering all 4 sections. Map labelling, form completion, and multiple choice with audio and transcripts.",
    url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/#listening",
    type: "official",
    skill: "listening",
    isFree: true,
  },

  // ── Cambridge YouTube Resources ──────────────────────────────────
  {
    id: "r44",
    title: "Cambridge English Official YouTube — Writing Tips",
    description: "Official Cambridge English YouTube channel with IELTS Writing Task 1 & Task 2 video tutorials, examiner insights, and band score breakdowns.",
    url: "https://www.youtube.com/@CambridgeEnglish",
    type: "video",
    skill: "writing",
    isFree: true,
  },
  {
    id: "r45",
    title: "Cambridge English Official YouTube — Speaking Tips",
    description: "Official Cambridge video guides for IELTS Speaking. Covers Part 1, 2, and 3 strategies, vocabulary building, and fluency improvement techniques.",
    url: "https://www.youtube.com/@CambridgeEnglish",
    type: "video",
    skill: "speaking",
    isFree: true,
  },
  {
    id: "r46",
    title: "Cambridge IELTS Podcast — Listening Resources",
    description: "Cambridge-style listening exercises and academic lectures. Practice with varied accents including British, Australian, and American English.",
    url: "https://www.youtube.com/@CambridgeEnglish",
    type: "video",
    skill: "listening",
    isFree: true,
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
