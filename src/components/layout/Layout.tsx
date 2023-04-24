import Navbar from "./Navbar";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import styles from "@/styles/Layout.module.css";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Box className={styles.flex}>
      <Navbar />
      <Container maxWidth={false}>{children}</Container>
    </Box>
  );
}
