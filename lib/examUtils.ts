/**
 * Filters an exam to 36 questions for adult (18+) test-takers
 * by removing questions flagged as driver-education specific.
 * The real CA DMV test is 36 questions for adults, 46 for minors.
 */
export function getAdultExamQuestions<T extends { id: string; driverEd?: boolean }>(
  questions: T[]
): T[] {
  const filtered = questions.filter((q) => !q.driverEd);
  return filtered.slice(0, 36);
}

/**
 * Returns the pass threshold for a given number of questions.
 * CA DMV requires ~83% to pass.
 * Adults: 31/36, Minors: 38/46
 */
export function getPassThreshold(totalQuestions: number): number {
  if (totalQuestions === 36) return 31;
  if (totalQuestions === 46) return 38;
  return Math.ceil(totalQuestions * 0.83);
}
