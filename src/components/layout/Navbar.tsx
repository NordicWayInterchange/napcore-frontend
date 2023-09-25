import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function Navbar() {
  return (
    <AppBar
      elevation={0}
      sx={{
        zIndex: (index) => index.zIndex.drawer + 1,
        bgcolor: "navbarBackgroundColor",
      }}
      position="fixed"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {process.env.NEXT_PUBLIC_THEME_PROVIDER == "trafficdata"
            ? "Trafficdata"
            : "Transportportal"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
