import type { ScoreCategoryData, ScoreCategoryKey } from "@/lib/score";
import { Progress } from "@/components/ui/progress";

interface SectionAnalysisProps {
  sections: Record<ScoreCategoryKey, ScoreCategoryData>;
}

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(sections).map(([key, data]) => (
        <div
          key={key}
          className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm dark:border-border/40 dark:bg-muted/20"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {data.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.summary}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{data.score}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                / 100
              </p>
            </div>
          </div>

          <Progress value={data.score} className="mt-3 h-1.5 bg-muted/60" />

          <ul className="mt-3 space-y-1.5">
            {data.feedback.map((item) => (
              <li key={item} className="text-[11px] leading-relaxed text-muted-foreground list-disc ml-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
