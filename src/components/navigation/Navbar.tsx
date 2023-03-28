import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import logo from "../../../public/nordic-way-logo.png";
import styles from "../../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={logo} alt="Nordic Way logo" width={150} />
      <List>
        <ListItem>
          <Link href="/" className={styles.link}>
            <ListItemButton>
              <ListItemText primary="Capabilities" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/deliveries" className={styles.link}>
            <ListItemButton>
              <ListItemText primary="Deliveries" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/subscriptions" className={styles.link}>
            <ListItemButton>
              <ListItemText primary="Subscriptions" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/network-capabilities" className={styles.link}>
            <ListItemButton>
              <ListItemText primary="Network Capabilities" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Navbar;
