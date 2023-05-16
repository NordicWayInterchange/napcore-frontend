import { trafficdata } from "./trafficdata";
import { transportportal } from "./transportportal";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
  }

  interface PaletteOptions {
    navbarBackgroundColor: string;
    mainBackgroundColor: string;
  }
}

export { trafficdata, transportportal };
