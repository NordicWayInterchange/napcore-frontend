import { createTheme, PaletteColor } from "@mui/material";
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) =>
  augmentColor({ color: { main: mainColor } });

export const trafficdata = createTheme({
  palette: {
    navbarBackgroundColor: "#d12e2c",
    mainBackgroundColor: "#f0f1f1",
    sidebarActiveColor: "#EBF5E6",

    // buttons and fonts
    depricatedRed: createColor("#F8DEDE"),

    // chip colors
    grayDark: createColor("#2E3539"),
    grayLight: createColor("#E5E5E5"),
    depricatedDark: createColor("#7E1010"),
    depricatedLight: createColor("#F8DEDE"),
    greenDark: createColor("#3E7B1F"),
    greenLight: createColor("#EBF5E6"),
    blueDark: createColor("#006C9A"),
    blueLight: createColor("#D4F7FF"),
    yellowDark: createColor("#A17E00"),
    yellowLight: createColor("#FFF5C8"),
    pinkDark: createColor("#9C176F"),
    pinkLight: createColor("#EDCEF5"),
  },
});
