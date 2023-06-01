import { trafficdata } from "./trafficdata";
import { transportportal } from "./transportportal";
import { PaletteColor } from "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
    sidebarActiveColor: PaletteColor;
    depricatedRed: string;
  }

  interface PaletteOptions {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
    sidebarActiveColor: string;
    depricatedRed: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    depricatedRed: true;
  }
}

export { trafficdata, transportportal };
