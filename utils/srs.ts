/**
 * KanjiVibe — SM-2 Spaced Repetition Algorithm
 * Implements a simplified SM-2 for flashcard intervals
 */

import { SRSCard } from '../data/curriculum';

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = Complete blackout
// 1 = Incorrect; remembered after seeing answer
// 2 = Incorrect; serious difficulty
// 3 = Correct; significant difficulty
// 4 = Correct; hesitation
// 5 = Perfect response

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;

/**
 * Create a new SRS card for a word
 */
export function createSRSCard(wordId: string): SRSCard {
  return {
    wordId,
    interval: 0,
    easeFactor: DEFAULT_EASE,
    repetitions: 0,
    dueDate: new Date().toISOString(),
  };
}

/**
 * Process a review using SM-2 algorithm
 */
export function processReview(card: SRSCard, quality: ReviewQuality): SRSCard {
  const now = new Date();
  let { interval, easeFactor, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE) {
    easeFactor = MIN_EASE;
  }

  // Calculate next due date
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    wordId: card.wordId,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReview: now.toISOString(),
  };
}

/**
 * Check if a card is due for review
 */
export function isDue(card: SRSCard): boolean {
  return new Date(card.dueDate) <= new Date();
}

/**
 * Get cards sorted by due date (most overdue first)
 */
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const now = new Date();
  return cards
    .filter(c => new Date(c.dueDate) <= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/**
 * Simple binary review — "Know" or "Don't Know"
 * Maps to SM-2 quality scores
 */
export function reviewKnown(card: SRSCard): SRSCard {
  return processReview(card, 4);
}

export function reviewUnknown(card: SRSCard): SRSCard {
  return processReview(card, 1);
}

/**
 * Get a human-readable interval string
 */
export function intervalToString(days: number): string {
  if (days === 0) return 'New';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  return `${Math.round(days / 365)} years`;
}
