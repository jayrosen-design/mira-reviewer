import type { BarrierCategory } from "@/data/dialogues";
import { BARRIER_CHIP_CLASS } from "@/lib/brand";

export function BarrierChip({ category, className = "" }: { category: BarrierCategory; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${BARRIER_CHIP_CLASS[category] ?? "bg-muted text-muted-foreground"} ${className}`}
    >
      {category}
    </span>
  );
}
