import Box from "@mui/material/Box";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";
import { CircularProgress, CssBaseline, Toolbar } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import TabMenu from "@/components/layout/TabMenu";
import Container from '@mui/material/Container';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { status: authStatus } = useSession();

  if (authStatus == "authenticated") {
    return (
      <Box >
      <Navbar></Navbar>
        <CssBaseline />
        <TabMenu></TabMenu>
        <Container  maxWidth="xl" sx={{
          flexGrow: 1,
          bgcolor: "mainBackgroundColor",
          p: 5,
          height: "100vh",
        }}>

          <Toolbar />
          {children}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        bgcolor: "mainBackgroundColor",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <CssBaseline />
      <Navbar />
      {authStatus == "unauthenticated" ? children : <CircularProgress />}
    </Box>
  );
}
