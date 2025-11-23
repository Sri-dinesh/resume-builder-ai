import React from "react";
import { Check, X } from "lucide-react";

interface KeywordListProps {
  present: string[];
  missing: string[];
}

export function KeywordList({ present, missing }: KeywordListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Present Keywords */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-900/20">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Keywords Found
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {present.length > 0 ? (
            present.map((keyword, idx) => (
              <span
                key={idx}
                className="rounded-full bg-white px-3 py-1 text-sm font-medium text-green-700 shadow-sm dark:bg-green-950 dark:text-green-300"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-sm text-green-700 dark:text-green-400">
              No specific keywords detected.
            </p>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/20">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
            Missing Keywords
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.length > 0 ? (
            missing.map((keyword, idx) => (
              <span
                key={idx}
                className="rounded-full bg-white px-3 py-1 text-sm font-medium text-red-700 shadow-sm dark:bg-red-950 dark:text-red-300"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-sm text-red-700 dark:text-red-400">
              Great job! No critical keywords missing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
