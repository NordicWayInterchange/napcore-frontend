import { createTheme } from "@mui/material";
import { openSans } from "@/theme/fonts";
import { TRAFFICDATA_COLORS } from "@/theme/colors";

export const trafficdata = createTheme({
  typography: {
    fontFamily: `${openSans.style.fontFamily}, sans-serif`,
  },
  palette: {
    ...TRAFFICDATA_COLORS,
    text: {
      primary: '#444f55',
      secondary: '#444f55'
    }
  },
});
