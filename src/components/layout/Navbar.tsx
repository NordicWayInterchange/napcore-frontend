import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import logo from "@/../public/nordic-way-logo.png";
import styles from "@/styles/Navbar.module.css";
import { useRouter } from "next/router";

export default function Navbar() {
  const theme = useTheme();

  const StyledListItem = styled(ListItem)(({}) => ({
    // "&": {
    //   backgroundColor:
    //     router.pathname == "/subscriptions" ? theme.palette.navbarListItem : "",
    // },
    "&:hover": {
      backgroundColor: theme.palette.navbarListItem,
    },
  }));

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.navbarBackground,
        width: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={logo} alt="Nordic Way logo" width={150} />
      <List sx={{ width: "100%" }}>
        <Link href="/subscriptions" className={styles.link}>
          <StyledListItem>
            <ListItemText primary="Subscriptions" />
          </StyledListItem>
        </Link>
        <Link href="/network-capabilities" className={styles.link}>
          <StyledListItem>
            <ListItemText primary="Capabilities" />
          </StyledListItem>
        </Link>
      </List>
    </Box>
  );
}
