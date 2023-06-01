import { createTheme } from "@mui/material";
const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: any) =>
  augmentColor({ color: { main: mainColor } });

export const transportportal = createTheme({
  palette: {
    navbarBackgroundColor: "rgb(68, 79, 85)",
    mainBackgroundColor: "#f0f1f1",
    sidebarActiveColor: "#EBF5E6",

    // buttons and fonts
    depricatedRed: createColor("#F8DEDE"),
  },
});
