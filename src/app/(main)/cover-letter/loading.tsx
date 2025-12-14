import { Loader2 } from "lucide-react";

export default function CoverLetterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Loading Cover Letter Generator...
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Preparing your personalized experience
        </p>
      </div>
    </div>
  );
}
