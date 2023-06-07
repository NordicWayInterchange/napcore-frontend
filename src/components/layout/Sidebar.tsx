import {
  Box,
  CssBaseline,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import HouseIcon from "@mui/icons-material/House";
import CellTowerIcon from "@mui/icons-material/CellTower";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { signOut, useSession } from "next-auth/react";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled } from "@mui/material/styles";

const pages = [
  { text: "My intersection", url: "/", icon: <HouseIcon /> },
  { text: "Subscriptions", url: "/subscriptions", icon: <SubscriptionsIcon /> },
  {
    text: "Network capabilities",
    url: "/network-capabilities",
    icon: <CellTowerIcon />,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();

  const handleSignOut = () => {
    //TODO: Fix
    signOut();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <StyledDrawer variant="permanent" anchor="left">
        <Toolbar />
        <Divider />
        <List sx={{ padding: 2 }}>
          {pages.map((link, key) => (
            <Link
              href={link.url}
              key={key}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem
                sx={{
                  borderRadius: 100,
                  backgroundColor:
                    router.asPath === link.url
                      ? theme.palette.sidebarActiveColor
                      : null,
                }}
                disablePadding
              >
                <StyledListItemButton>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                </StyledListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>

        <Box sx={{ marginTop: "auto", padding: 2 }}>
          <List>
            <Link
              href={"/profile"}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItem
                sx={{
                  borderRadius: 100,
                  backgroundColor:
                    router.asPath === "/profile"
                      ? theme.palette.sidebarActiveColor
                      : null,
                }}
                disablePadding
              >
                <StyledListItemButton>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Profile settings"} />
                </StyledListItemButton>
              </ListItem>
            </Link>
          </List>
          <Divider sx={{ marginY: 2 }} />
          <StyledSignOutBox>
            <Typography>{session?.user?.name}</Typography>
            <IconButton onClick={handleSignOut}>
              <LogoutIcon />
            </IconButton>
          </StyledSignOutBox>
        </Box>
      </StyledDrawer>
    </Box>
  );
}

const StyledListItemButton = styled(ListItemButton)(({}) => ({
  "&:hover": {
    backgroundColor: "transparent",
    borderRadius: 100,
  },
}));

const StyledDrawer = styled(Drawer)(({}) => ({
  width: 360,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 360,
    boxSizing: "border-box",
  },
}));

const StyledSignOutBox = styled(Box)(({}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
