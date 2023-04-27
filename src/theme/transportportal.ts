import { createTheme } from "@mui/material";

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

export const transportportal = createTheme({
  palette: {
    navbarBackground: "#444f55",
    navbarListItem: "#2d3539",
  },
});
