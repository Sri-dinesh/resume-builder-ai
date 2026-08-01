import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  verdict: string;
}

export function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getTone = (value: number) => {
    if (value >= 85) {
      return {
        stroke: "text-emerald-500",
        label: "text-emerald-600 dark:text-emerald-400",
      };
    }
    if (value >= 70) {
      return {
        stroke: "text-amber-500",
        label: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      stroke: "text-rose-500",
      label: "text-rose-600 dark:text-rose-400",
    };
  };

  const tone = getTone(score);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <svg
          className="h-full w-full -rotate-90 transform overflow-visible"
          viewBox="0 0 120 120"
        >
          <circle
            className="text-muted/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="60"
            cy="60"
          />
          <motion.circle
            className={tone.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="60"
            cy="60"
            style={{ filter: "drop-shadow(0px 0px 6px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-foreground text-4xl font-bold">{score}</span>
          <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            out of 100
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-3 text-[10px] font-medium tracking-[0.2em] uppercase">
        ATS Score
      </p>
      <p className={`mt-1 text-sm font-semibold ${tone.label}`}>{verdict}</p>
    </div>
  );
}
