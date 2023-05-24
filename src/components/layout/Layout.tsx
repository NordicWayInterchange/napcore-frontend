import Box from "@mui/material/Box";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";
import { CssBaseline, Toolbar, useTheme } from "@mui/material";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { status: authStatus } = useSession();
  const theme = useTheme();

  if (authStatus != "authenticated") {
    return (
      <Box
        component="main"
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.mainBackgroundColor,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.mainBackgroundColor,
          p: 3,
          height: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
