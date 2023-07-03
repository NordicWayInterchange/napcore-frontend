import Box from "@mui/material/Box";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";
import {
  CircularProgress,
  CssBaseline,
  Toolbar,
  useTheme,
} from "@mui/material";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { status: authStatus } = useSession();
  const theme = useTheme();

  if (authStatus == "authenticated") {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: theme.palette.mainBackgroundColor,
            p: 5,
            height: "100vh",
            width: "100vw",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        bgcolor: theme.palette.mainBackgroundColor,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <CssBaseline />
      {authStatus == "unauthenticated" ? children : <CircularProgress />}
    </Box>
  );
}
