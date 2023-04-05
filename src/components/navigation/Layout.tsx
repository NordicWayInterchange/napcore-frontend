import Navbar from "./Navbar";
import Box from "@mui/material/Box";
import styles from "@/styles/Layout.module.css"
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Box className={styles.flex}>
        <Navbar />
      <Box className={styles.main}>{children}</Box>
    </Box>
  );
}
