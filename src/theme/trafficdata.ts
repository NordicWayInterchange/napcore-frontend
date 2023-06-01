import { createTheme } from "@mui/material";
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
  },
});
