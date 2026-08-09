export interface McQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface FillQuestion {
  /** Completion-style sentence containing a blank written as "___". */
  q: string;
  /** Accepted correct forms (matched case-insensitively, punctuation-stripped). */
  accepted: string[];
}

export interface ReadingPassage {
  title: string;
  passage: string;
  questions: McQuestion[];
}

export interface ListeningSection {
  title: string;
  transcript: string;
  questions: FillQuestion[];
}

export interface WritingTasks {
  /** Academic Task 1: describe a graph/table/chart. Minimum 150 words. */
  task1: string;
  /** Task 2: essay. Minimum 250 words. */
  task2: string;
}

export interface SpeakingQuestion {
  part: 1 | 2 | 3;
  prompt: string;
  prepSeconds: number;
  answerSeconds: number;
}

export interface MockTestSet {
  id: string;
  order: number;
  title: string;
  reading: { passages: ReadingPassage[] };
  listening: { sections: ListeningSection[] };
  writing: WritingTasks;
  speaking: SpeakingQuestion[];
}

export function speakingPart1(prompts: string[]): SpeakingQuestion[] {
  return prompts.map((prompt) => ({
    part: 1,
    prompt,
    prepSeconds: 0,
    answerSeconds: 30,
  }));
}

export function speakingPart2(prompt: string): SpeakingQuestion {
  return { part: 2, prompt, prepSeconds: 60, answerSeconds: 120 };
}

export function speakingPart3(prompts: string[]): SpeakingQuestion[] {
  return prompts.map((prompt) => ({
    part: 3,
    prompt,
    prepSeconds: 0,
    answerSeconds: 40,
  }));
}
