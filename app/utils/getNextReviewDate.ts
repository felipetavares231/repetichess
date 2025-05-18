import {addDays, addHours} from "date-fns";

export type Difficulty = "Easy" | "Medium" | "Hard";

export function getNextReviewInfo({
  currentInterval,
  easeFactor = 2.5,
  difficulty,
  lastReviewDate = new Date(),
}: {
  currentInterval: number;
  easeFactor: number;
  difficulty: Difficulty;
  lastReviewDate: Date;
}) {
  const easyBonus = 1.3;
  const hardFactor = 1.2;
  const minEaseFactor = 1.3;

  let nextInterval;
  let newEaseFactor = easeFactor;

  switch (difficulty.toLowerCase()) {
    case "hard":
      nextInterval = Math.max(1, Math.round(currentInterval * hardFactor));
      newEaseFactor = Math.max(minEaseFactor, easeFactor - 0.15);
      break;
    case "medium":
      nextInterval = Math.round(currentInterval * easeFactor);
      // easeFactor stays the same
      break;
    case "easy":
      nextInterval = Math.round(currentInterval * easeFactor * easyBonus);
      newEaseFactor = easeFactor + 0.15;
      break;
    default:
      throw new Error(
        "Invalid rating. Use 'again', 'hard', 'good', or 'easy'.",
      );
  }

  const nextReviewDate = addDays(lastReviewDate, nextInterval);

  return {
    nextInterval,
    nextReviewDate,
    newEaseFactor,
  };
}
