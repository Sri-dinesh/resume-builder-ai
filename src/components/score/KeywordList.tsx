import type { ScoreKeywordAnalysis } from "@/lib/score";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface KeywordListProps {
  keywords: ScoreKeywordAnalysis;
}

export function KeywordList({ keywords }: KeywordListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Keyword Coverage
          </p>
          <h3 className="mt-1 text-xl font-semibold text-foreground">
            {keywords.coverage}% match
          </h3>
        </div>
        <p className="max-w-xl text-[11px] leading-relaxed text-muted-foreground">
          Coverage reflects how well your resume mirrors role-relevant terms from the job description or industry standards.
        </p>
      </div>

      <Progress value={keywords.coverage} className="h-1.5 bg-muted/50" />

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
                  className="bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-200 text-[10px] py-0 px-2"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-[11px] text-muted-foreground">
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
                  className="bg-rose-600/10 text-rose-700 hover:bg-rose-600/10 dark:text-rose-200 text-[10px] py-0 px-2"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-[11px] text-muted-foreground">
                No major gaps detected.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm dark:border-border/40 dark:bg-muted/20">
          <p className="text-xs font-semibold text-foreground">
            Role Signals
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {keywords.titleMatch.length > 0 ? (
              keywords.titleMatch.map((term) => (
                <Badge key={term} variant="secondary" className="text-[10px] py-0 px-2">
                  {term}
                </Badge>
              ))
            ) : keywords.suggested.length > 0 ? (
              keywords.suggested.map((term) => (
                <Badge key={term} variant="outline" className="text-[10px] py-0 px-2">
                  {term}
                </Badge>
              ))
            ) : (
              <p className="text-[11px] text-muted-foreground">
                No role signals detected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
