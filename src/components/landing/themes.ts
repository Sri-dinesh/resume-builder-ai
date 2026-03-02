import { Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    type: "light",
    colors: {
      bg: "249 249 248",
      surface: "255 255 255",
      primary: "217 119 87",
      textMain: "29 29 27",
      textMuted: "115 115 115",
      border: "230 230 225",
    },
  },
  {
    id: "dark-default",
    name: "Default Dark",
    type: "dark",
    colors: {
      bg: "33 33 33",
      surface: "23 23 23",
      primary: "217 119 87",
      textMain: "232 232 227",
      textMuted: "160 160 155",
      border: "50 50 50",
    },
  },
];
