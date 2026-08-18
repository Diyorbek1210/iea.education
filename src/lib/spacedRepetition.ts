import type { VocabWord } from "@/data/vocabulary";

export interface SrsCard {
  word: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
  correctCount: number;
  incorrectCount: number;
}

const SRS_KEY = "iea_srs_cards";

function loadSrsCards(): Map<string, SrsCard> {
  if (typeof window === "undefined") return new Map();
  try {
    const raw = localStorage.getItem(SRS_KEY);
    if (!raw) return new Map();
    const arr = JSON.parse(raw) as SrsCard[];
    return new Map(arr.map((c) => [c.word, c]));
  } catch {
    return new Map();
  }
}

function saveSrsCards(cards: Map<string, SrsCard>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SRS_KEY, JSON.stringify([...cards.values()]));
}

export function getSrsCard(word: string): SrsCard {
  const cards = loadSrsCards();
  if (cards.has(word)) return cards.get(word)!;
  const card: SrsCard = {
    word,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: new Date().toISOString(),
    correctCount: 0,
    incorrectCount: 0,
  };
  cards.set(word, card);
  saveSrsCards(cards);
  return card;
}

export function updateSrsCard(word: string, quality: 0 | 1 | 2 | 3): SrsCard {
  const cards = loadSrsCards();
  const card = cards.get(word) ?? {
    word,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: new Date().toISOString(),
    correctCount: 0,
    incorrectCount: 0,
  };

  if (quality >= 2) {
    card.correctCount += 1;
    if (card.repetitions === 0) {
      card.interval = 1;
    } else if (card.repetitions === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }
    card.repetitions += 1;
  } else {
    card.incorrectCount += 1;
    card.repetitions = 0;
    card.interval = 0;
  }

  card.easeFactor = Math.max(
    1.3,
    card.easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)),
  );

  const next = new Date();
  next.setDate(next.getDate() + (card.interval || 0));
  card.nextReview = next.toISOString();
  card.lastReview = new Date().toISOString();

  cards.set(word, card);
  saveSrsCards(cards);
  return card;
}

export function getDueCards(): SrsCard[] {
  const cards = loadSrsCards();
  const now = new Date();
  return [...cards.values()]
    .filter((c) => new Date(c.nextReview) <= now)
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
}

export function getAllSrsCards(): SrsCard[] {
  return [...loadSrsCards().values()];
}

export function getWordsForReview(words: VocabWord[], mode: "recognition" | "production" | "mixed"): VocabWord[] {
  const dueCards = getDueCards();
  const dueWords = new Set(dueCards.map((c) => c.word));

  const due = words.filter((w) => dueWords.has(w.word));
  const notYetSeen = words.filter((w) => !dueCards.some((c) => c.word === w.word));
  const newCards = notYetSeen.slice(0, 10);

  if (mode === "mixed") {
    return [...due, ...newCards].sort(() => Math.random() - 0.5);
  }
  return [...due, ...newCards];
}

export function getSrsStats() {
  const cards = loadSrsCards();
  const all = [...cards.values()];
  const now = new Date();
  const due = all.filter((c) => new Date(c.nextReview) <= now);
  const mastered = all.filter((c) => c.repetitions >= 5 && c.easeFactor >= 2.3);
  const learning = all.filter((c) => c.repetitions > 0 && c.repetitions < 5);
  const newCount = all.filter((c) => c.repetitions === 0);

  return {
    total: all.length,
    due: due.length,
    mastered: mastered.length,
    learning: learning.length,
    newCards: newCount.length,
    accuracy:
      all.length > 0
        ? Math.round(
            (all.reduce((sum, c) => sum + c.correctCount, 0) /
              Math.max(1, all.reduce((sum, c) => sum + c.correctCount + c.incorrectCount, 0))) *
              100,
          )
        : 0,
  };
}
