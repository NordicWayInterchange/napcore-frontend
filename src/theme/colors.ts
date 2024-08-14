import { createTheme } from "@mui/material";
const { palette } = createTheme();

const { augmentColor } = palette;
const createColor = (mainColor: any) =>
  augmentColor({ color: { main: mainColor } });

export const SHARED_COLORS = {
  depricatedRed: createColor("#F8DEDE"),
  grayDark: createColor("#2E3539"),
  grayLight: createColor("#E5E5E5"),
  depricatedDark: createColor("#7E1010"),
  depricatedLight: createColor("#F8DEDE"),
  greenDark: createColor("#1D7721"),
  greenLight: createColor("#E8F3E9"),
  blueDark: createColor("#006C9A"),
  blueLight: createColor("#D4F7FF"),
  yellowDark: createColor("#A17E00"),
  yellowLight: createColor("#FFF5C8"),
  pinkDark: createColor("#9C176F"),
  pinkLight: createColor("#EDCEF5"),
  orangeDark: createColor("#FF9600"),
  orangeLight: createColor("#ffbf7d"),
  purpleDark: createColor("#7255c0"),
  purpleLight: createColor("#c1aaff"),
  redLight: createColor("#B63434")
};

export const TRAFFICDATA_COLORS = {
  navbarBackgroundColor: "#d12e2c",
  mainBackgroundColor: "#f0f1f1",
  sidebarActiveColor: "#E5E5E5",
  sidebarBorderColor: "#2E3539",
  avatarBackgroundColor: "#d12e2c",
  cardBackgroundColor: "#E5E5E5",
  globalFontColor: "#363F44",
  buttonThemeColor: createColor("#d12e2c"),
  ...SHARED_COLORS,
};

export const TRANSPORTPORTAL_COLORS = {
  navbarBackgroundColor: "#444F55",
  mainBackgroundColor: "#f0f1f1",
  sidebarActiveColor: "#EBF5E6",
  sidebarBorderColor: "#1D7721",
  avatarBackgroundColor: "#444F55",
  cardBackgroundColor: "#EBF5E6",
  globalFontColor: "#363F44",
  buttonThemeColor: createColor("#1D7721"),
  ...SHARED_COLORS,
};
