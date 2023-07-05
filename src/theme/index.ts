import { trafficdata } from "./trafficdata";
import { transportportal } from "./transportportal";
import { PaletteColor } from "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
    sidebarActiveColor: string;
    cardBackgroundColor: string;
    avatarBackgroundColor: string;
    buttonThemeColor: string;
    depricatedRed: string;
    grayDark: string;
    grayLight: string;
    depricatedDark: string;
    depricatedLight: string;
    greenDark: string;
    greenLight: string;
    blueDark: string;
    blueLight: string;
    yellowDark: string;
    yellowLight: string;
    pinkDark: string;
    pinkLight: string;
  }

  interface PaletteOptions {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
    sidebarActiveColor: string;
    avatarBackgroundColor: string;
    cardBackgroundColor: string;
    buttonThemeColor: PaletteColor;
    depricatedRed: PaletteColor;
    grayDark: PaletteColor;
    grayLight: PaletteColor;
    depricatedDark: PaletteColor;
    depricatedLight: PaletteColor;
    greenDark: PaletteColor;
    greenLight: PaletteColor;
    blueDark: PaletteColor;
    blueLight: PaletteColor;
    yellowDark: PaletteColor;
    yellowLight: PaletteColor;
    pinkDark: PaletteColor;
    pinkLight: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    buttonThemeColor: true;
    depricatedRed: true;
    grayDark: true;
    grayLight: true;
    depricatedDark: true;
    depricatedLight: true;
    greenDark: true;
    greenLight: true;
    blueDark: true;
    blueLight: true;
    yellowDark: true;
    yellowLight: true;
    pinkDark: true;
    pinkLight: true;
  }
}

export { trafficdata, transportportal };
