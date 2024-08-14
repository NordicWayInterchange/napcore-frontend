import { createTheme } from "@mui/material";
import { TRAFFICDATA_COLORS } from "@/theme/colors";

export const trafficdata = createTheme({
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  palette: {
    ...TRAFFICDATA_COLORS,
  },
});
