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
  ListItemIcon,
  IconButton,
  Button,
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
import AddIcon from "@mui/icons-material/Add";
import { IPages } from "@/interface/IPages";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

const MAIN_PAGES: Array<IPages> = [
  { text: "Home", url: "/", icon: <HouseIcon /> },
  { text: "Subscriptions", url: "/subscriptions", icon: <SubscriptionsIcon /> },
  {
    text: "Network capabilities",
    url: "/network-capabilities",
    icon: <CellTowerIcon />,
  },
  {
    text: "Deliveries",
    url: "/deliveries",
    icon: <LocalPostOfficeIcon />,
  },
];

const SECONDARY_PAGES: Array<IPages> = [
  {
    text: "Certificate",
    url: "/certificate",
    icon: <SettingsIcon />,
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const mapPages = (pages: Array<IPages>) => {
    return pages.map((page: IPages, key: number) => (
      <Link
        href={page.url}
        key={key}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <ListItem
          sx={{
            borderRadius: 100,
            my: 2,
            backgroundColor:
              router.asPath === page.url ? "sidebarActiveColor" : null,
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: "sidebarActiveColor",
              border: "1px solid",
              borderColor: "sidebarBorderColor",
            },
          }}
          disablePadding
        >
          <StyledListItemButton disableRipple>
            <ListItemIcon>{page.icon}</ListItemIcon>
            <ListItemText primary={page.text} />
          </StyledListItemButton>
        </ListItem>
      </Link>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <StyledDrawer
        sx={{ display: { xs: "none", sm: "block" } }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />

        <Box sx={{ padding: 2 }}>
          <Link
            href={"/subscriptions/new-subscription"}
            style={{ textDecoration: "none" }}
          >
            <StyledButton
              sx={{ my: 1 }}
              startIcon={<AddIcon />}
              variant="contained"
              color="buttonThemeColor"
              disableElevation
              fullWidth
            >
              Add subscription
            </StyledButton>
          </Link>

          <Divider sx={{ marginY: 1 }} />

          <List>{mapPages(MAIN_PAGES)}</List>
        </Box>

        <Box sx={{ marginTop: "auto", padding: 2 }}>
          <List>{mapPages(SECONDARY_PAGES)}</List>
          <Divider sx={{ marginY: 1 }} />
          <StyledSignOutBox>
            <Typography>{session?.user?.name}</Typography>
            <IconButton onClick={() => signOut()}>
              <LogoutIcon />
            </IconButton>
          </StyledSignOutBox>
        </Box>
      </StyledDrawer>
    </Box>
  );
}

const StyledButton = styled(Button)(({}) => ({
  borderRadius: 100,
  textTransform: "none",
  height: 56,
}));

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
