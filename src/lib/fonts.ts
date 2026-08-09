export const FONT_OPTIONS = [
  {
    name: "CMU Serif",
    value: "Computer Modern Serif Roman",
    preview: "The classic academic LaTeX font, highly professional and precise",
  },
  {
    name: "Arial",
    value: "Arial",
    preview: "Classic sans-serif font, widely used in professional documents",
  },
  {
    name: "Helvetica",
    value: "Helvetica",
    preview: "Clean and neutral, perfect for professional resumes",
  },
  {
    name: "Times New Roman",
    value: "Times New Roman",
    preview: "Traditional serif font, standard for formal documents",
  },
  {
    name: "Verdana",
    value: "Verdana",
    preview: "Clear sans-serif font, designed for screen legibility",
  },
  {
    name: "Inter",
    value: "Inter",
    preview: "Modern and professional, optimized for screen readability",
  },
] as const;

export type FontOption = (typeof FONT_OPTIONS)[number]["value"];
