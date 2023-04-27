import { trafficdata } from "./trafficdata";
import { transportportal } from "./transportportal";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    navbarBackground: string;
    navbarListItem: string;
  }

  interface PaletteOptions {
    navbarBackground: string;
    navbarListItem: string;
  }
}

export { trafficdata, transportportal };
