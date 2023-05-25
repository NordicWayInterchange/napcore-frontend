import {
  Box,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  ListSubheader,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const width = 240;

const pages = [
  { text: "Subscriptions", url: "/subscriptions" },
  { text: "Network Capabilities", url: "/network-capabilities" },
];

const admin = [
  { text: "Profile", url: "/profile" },
  { text: "Certificate", url: "/certificate" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Drawer
        sx={{
          width: width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: width,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Subheader
            </ListSubheader>
          }
        >
          {pages.map((link, key) => (
            <Link
              href={link.url}
              key={key}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  backgroundColor:
                    router.asPath === link.url ? "#e5e5e5" : null,
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Subheader
            </ListSubheader>
          }
        >
          {admin.map((link, key) => (
            <Link
              href={link.url}
              key={key}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  backgroundColor:
                    router.asPath === link.url ? "#e5e5e5" : null,
                }}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
