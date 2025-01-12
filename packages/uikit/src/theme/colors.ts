import { Colors } from "./types";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#41A65B",
  primaryBright: "#7BCC8F",
  primaryDark: "#338448",
  secondary: "#503811",
  success: "#0267C1",
  warning: "#EFA00B",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#452a7a",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
};

export const lightColors: Colors = {
  ...baseColors,
  ...additionalColors,
  background: "#FFFCF1",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  cardBorder: "#ffe0b5",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#f0f9f3",
  inputSecondary: "#89d19d",
  tertiary: "#EFF4F5",
  text: "#002C00",
  textDisabled: "#BDC2C4",
  textSubtle: "#002c00",
  disabled: "#E9EAEB",
  gradients: {
    bubblegum:
      "linear-gradient(360deg, rgba(239, 160, 11, 0.2) 0%, rgba(239, 160, 11, 0.113903) 30.4%, rgba(239, 160, 11, 0) 100%), #FFFCF1;",
    inverseBubblegum:
      "gradient(360deg, rgba(239, 160, 11, 0.2) 0%, rgba(239, 160, 11, 0.113903) 30.4%, rgba(239, 160, 11, 0) 100%), #FFFCF1;",
    cardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #dbeefb 100%)",
    blue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
    violet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
    violetAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};

export const darkColors: Colors = {
  ...baseColors,
  ...additionalColors,
  secondary: "#4fba6a",
  background: "#08060B",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "#202205",
  backgroundAlt2: "rgba(39, 38, 44, 0.7)",
  cardBorder: "#383241",
  contrast: "#FFFFFF",
  dropdown: "#1E1D20",
  dropdownDeep: "#100C18",
  invertedContrast: "#191326",
  input: "#1c3a13",
  inputSecondary: "#262130",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#FFF8DD",
  textDisabled: "#666171",
  textSubtle: "#FFF8DD",
  disabled: "#524B63",
  gradients: {
    bubblegum: "linear-gradient(360deg, rgba(123, 204, 143, 0.2) 0%, rgba(51, 132, 72, 0) 100%), #08060B",
    inverseBubblegum: "linear-gradient(360deg, rgba(123, 204, 143, 0.3) 0%, rgba(51, 132, 72, 0) 100%), #08060B",
    cardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
    blue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
    violet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
    violetAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
    gold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
  },
};
