// Mirrors backend/src/utils/transition.ts. Older records may still hold
// "A"/"B" or "Track A", so they are shown with the current names.
export const TRANSITIONS = ["Transition One", "Transition Two"];

const ONE = /^(a|1|one|t1|track ?a|track ?1|transition ?(one|1|a))$/;
const TWO = /^(b|2|two|t2|track ?b|track ?2|transition ?(two|2|b))$/;

export const transitionLabel = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const v = value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!v) return "";
  if (ONE.test(v)) return TRANSITIONS[0];
  if (TWO.test(v)) return TRANSITIONS[1];
  return value.trim();
};
