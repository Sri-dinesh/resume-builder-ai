export const FONT_OPTIONS = [
  {
    name: "Arial",
    value: "Arial",
    preview: "Classic sans-serif font, widely used in professional documents",
  },
  {
    name: "Calibri",
    value: "Calibri",
    preview: "Modern sans-serif, Microsoft's default font since 2007",
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
    name: "Georgia",
    value: "Georgia",
    preview: "Elegant serif font, excellent readability on screens",
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
