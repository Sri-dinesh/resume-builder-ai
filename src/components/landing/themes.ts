import { Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "default",
    name: "Claude Light",
    type: "light",
    colors: {
      bg: "250 249 245",
      surface: "255 255 255",
      primary: "217 119 87",
      textMain: "20 20 19",
      textMuted: "102 101 95",
      border: "232 230 220",
    },
  },
  {
    id: "dark-default",
    name: "Claude Dark",
    type: "dark",
    colors: {
      bg: "20 20 19",
      surface: "30 30 30",
      primary: "217 119 87", 
      textMain: "250 249 245",
      textMuted: "176 174 165",
      border: "51 51 51",
    },
  },
];
