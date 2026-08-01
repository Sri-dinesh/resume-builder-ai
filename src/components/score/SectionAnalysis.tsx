import { Progress } from "@/components/ui/progress";
import type { ScoreCategoryData, ScoreCategoryKey } from "@/lib/resume/score";

interface SectionAnalysisProps {
  sections: Record<ScoreCategoryKey, ScoreCategoryData>;
}

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(sections).map(([key, data]) => (
        <div
          key={key}
          className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-4 backdrop-blur-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-foreground text-sm font-semibold">
                {data.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-xs">
                {data.summary}
              </p>
            </div>
            <div className="text-right">
              <p className="text-foreground text-lg font-bold">{data.score}</p>
              <p className="text-muted-foreground text-[9px] tracking-wider uppercase">
                / 100
              </p>
            </div>
          </div>

          <Progress value={data.score} className="bg-muted/60 mt-3 h-1.5" />

          <ul className="mt-3 space-y-1.5">
            {data.feedback.map((item) => (
              <li
                key={item}
                className="text-muted-foreground ml-3 list-disc text-[11px] leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
