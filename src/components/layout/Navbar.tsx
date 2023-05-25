import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import React from "react";

export default function Navbar() {
  const theme = useTheme();

  return (
    <AppBar
      elevation={0}
      sx={{
        zIndex: (index) => index.zIndex.drawer + 1,
        backgroundColor: theme.palette.navbarBackgroundColor,
      }}
      position="fixed"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Transportportal
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
