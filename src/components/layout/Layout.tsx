import Navbar from "./Navbar";
import { Container, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "@/styles/Layout.module.css";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}
