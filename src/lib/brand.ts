import type { BarrierCategory } from "@/data/dialogues";

/** Reviewer-facing item label: "MIRA-001" -> "Item 001". Display only; data IDs stay unchanged. */
export function displayItemId(id: string): string {
  const m = id.match(/(\d+)$/);
  return m ? `Item ${m[1]}` : id;
}

/** Fixed barrier-category -> soft chip mapping (Warm Sage chip tokens). */
export const BARRIER_CHIP_CLASS: Record<BarrierCategory, string> = {
  "Vaccine effectiveness": "bg-chip-sky text-chip-sky-foreground",
  "Safety or side effects": "bg-chip-rose text-chip-rose-foreground",
  "Sexual activity concern": "bg-chip-lavender text-chip-lavender-foreground",
  "Lack of clinician recommendation": "bg-chip-amber text-chip-amber-foreground",
  "Child is too young": "bg-chip-sage text-chip-sage-foreground",
};
