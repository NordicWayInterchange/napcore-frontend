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
import React, { useState } from "react";

const width = 240;

const pages = [
  { text: "Subscriptions", link: "/subscriptions" },
  { text: "Network Capabilities", link: "/network-capabilities" },
];

const admin = [
  { text: "Profile", link: "/profile" },
  { text: "Certificate", link: "/certificate" },
];

export default function Sidebar() {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        sx={{
          zIndex: (index) => index.zIndex.drawer + 1,
          backgroundColor: theme.palette.navbarBackgroundColor,
        }}
        position="fixed"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Transportportal
          </Typography>
        </Toolbar>
      </AppBar>
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
        /*
        subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Streams
            </ListSubheader>
          }*/
        >
          {pages.map((link, key) => (
            <Link
              href={link.link}
              key={key}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          {admin.map((link, key) => (
            <Link
              href={link.link}
              key={key}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding>
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
