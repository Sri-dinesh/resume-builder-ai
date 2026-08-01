import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeywordList } from "./KeywordList";
import { ScoreGauge } from "./ScoreGauge";
import { SectionAnalysis } from "./SectionAnalysis";
import type { ScoreAnalysisResult } from "@/lib/resume/score";

interface ScoreDashboardProps {
  analysis: ScoreAnalysisResult;
}

const PRIORITY_STYLES = {
  high: "bg-rose-600/10 text-rose-700 dark:text-rose-300",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
} as const;

export function ScoreDashboard({ analysis }: ScoreDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid gap-4 xl:grid-cols-[280px,1fr]">
        <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
          <CardContent className="flex h-full flex-col items-center justify-center p-6">
            <ScoreGauge score={analysis.score} verdict={analysis.verdict} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
          <CardHeader className="p-5 pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="text-[10px] tracking-wider uppercase"
              >
                {analysis.verdict}
              </Badge>
              {analysis.metrics.hasJobDescription ? (
                <Badge variant="outline" className="text-[10px]">
                  JD Tailored Scan
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  General ATS Scan
                </Badge>
              )}
            </div>
            <CardTitle className="mt-1 text-xl">ATS Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {analysis.summary}
            </p>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3 backdrop-blur-sm">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                  <Target className="h-3.5 w-3.5" />
                  Match
                </div>
                <p className="text-foreground mt-1 text-lg font-semibold">
                  {analysis.keywords.coverage}%
                </p>
              </div>
              <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3 backdrop-blur-sm">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                  <FileText className="h-3.5 w-3.5" />
                  Words
                </div>
                <p className="text-foreground mt-1 text-lg font-semibold">
                  {analysis.metrics.wordCount}
                </p>
              </div>
              <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3 backdrop-blur-sm">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Bullets
                </div>
                <p className="text-foreground mt-1 text-lg font-semibold">
                  {analysis.metrics.measurableBulletCount}
                </p>
              </div>
              <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3 backdrop-blur-sm">
                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Missing
                </div>
                <p className="text-foreground mt-1 text-lg font-semibold">
                  {analysis.metrics.sectionsMissing.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
          <CardHeader className="p-5 pb-0">
            <CardTitle className="text-base">Priority Fixes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((item) => (
                <div
                  key={item.title}
                  className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3.5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-foreground text-sm font-semibold">
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${PRIORITY_STYLES[item.priority]}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                No major fixes surfaced in the current analysis.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
          <CardHeader className="p-5 pb-0">
            <CardTitle className="text-base">What Is Working</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {analysis.strengths.length > 0 ? (
              analysis.strengths.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-200"
                >
                  {item}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                Add more measurable results and standard sections to surface
                clearer strengths.
              </p>
            )}

            <div className="border-border/50 bg-background/50 dark:border-border/40 dark:bg-muted/20 rounded-xl border p-3.5 backdrop-blur-sm">
              <p className="text-foreground text-xs font-medium">
                Sections Found
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {analysis.metrics.sectionsFound.map((section) => (
                  <Badge
                    key={section}
                    variant="secondary"
                    className="py-0 text-[10px]"
                  >
                    {section}
                  </Badge>
                ))}
              </div>
            </div>

            {analysis.metrics.sectionsMissing.length > 0 && (
              <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-3.5">
                <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                  Missing Sections
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {analysis.metrics.sectionsMissing.map((section) => (
                    <Badge
                      key={section}
                      variant="outline"
                      className="border-rose-500/20 text-[10px] text-rose-700 dark:text-rose-300"
                    >
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-base">Section Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <SectionAnalysis sections={analysis.sections} />
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 dark:bg-card/40 shadow-md backdrop-blur-xl">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-base">Keyword Alignment</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <KeywordList keywords={analysis.keywords} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
