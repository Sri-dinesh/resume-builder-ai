import { Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "default",
    name: "Default Indigo",
    type: "light",
    colors: {
      bg: "244 244 240",
      surface: "255 255 255",
      primary: "99 102 241",
      textMain: "28 28 28",
      textMuted: "140 140 140",
      border: "0 0 0",
    },
  },
  {
    id: "dark-default",
    name: "Dark Indigo",
    type: "dark",
    colors: {
      bg: "10 10 10",
      surface: "20 20 20",
      primary: "129 140 248", 
      textMain: "224 224 224",
      textMuted: "82 82 82",
      border: "255 255 255",
    },
  },
];
