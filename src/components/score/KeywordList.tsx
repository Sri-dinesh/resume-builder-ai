import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ScoreKeywordAnalysis } from "@/lib/resume/score";

interface KeywordListProps {
  keywords: ScoreKeywordAnalysis;
}

export function KeywordList({ keywords }: KeywordListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Keyword Coverage
          </p>
          <h3 className="text-foreground mt-1 text-xl font-semibold">
            {keywords.coverage}% match
          </h3>
        </div>
        <p className="text-muted-foreground max-w-xl text-[11px] leading-relaxed">
          Coverage reflects how well your resume mirrors role-relevant terms
          from the job description or industry standards.
        </p>
      </div>

      <Progress value={keywords.coverage} className="bg-muted/50 h-1.5" />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 dark:bg-emerald-500/5">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Keywords Present
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {keywords.present.length > 0 ? (
              keywords.present.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="bg-emerald-600/10 px-2 py-0 text-[10px] text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-200"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-[11px]">
                No keywords detected.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 dark:bg-rose-500/5">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
            Missing / Weak
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {keywords.missing.length > 0 ? (
              keywords.missing.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="bg-rose-600/10 px-2 py-0 text-[10px] text-rose-700 hover:bg-rose-600/10 dark:text-rose-200"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-[11px]">
                No major gaps detected.
              </p>
            )}
          </div>
        </div>

        <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-4 backdrop-blur-sm">
          <p className="text-foreground text-xs font-semibold">Role Signals</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {keywords.titleMatch.length > 0 ? (
              keywords.titleMatch.map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="px-2 py-0 text-[10px]"
                >
                  {term}
                </Badge>
              ))
            ) : keywords.suggested.length > 0 ? (
              keywords.suggested.map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="px-2 py-0 text-[10px]"
                >
                  {term}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-[11px]">
                No role signals detected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
