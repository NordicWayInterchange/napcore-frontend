import { createTheme } from "@mui/material";
import { TRANSPORTPORTAL_COLORS } from "@/theme/colors";

export const transportportal = createTheme({
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  palette: {
    ...TRANSPORTPORTAL_COLORS,
    text: {
      primary: '#444f55',
      secondary: '#444f55'
    }
  },
});
