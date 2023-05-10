import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/../public/nordic-way-logo.png";

const width = 240;

const links = [
  { text: "Subscriptions", link: "/subscriptions" },
  { text: "Network Capabilities", link: "/network-capabilities" },
];

export default function Sidebar() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
        <Image
          src={logo}
          alt="Nordic Way logo"
          width={width / 1.2}
          style={{ alignSelf: "center", padding: 3 }}
        />
        <Divider />
        <List>
          {links.map((link, key) => (
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
