import { getScaleItem } from "@/lib/culture-data";

export default function ScoreBadge({ score, showLabel = false }: { score: number; showLabel?: boolean }) {
  const item = getScaleItem(score);
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: item.bg, color: item.color }}
    >
      {score} {showLabel && `- ${item.label}`}
    </span>
  );
}
