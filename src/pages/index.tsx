import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import Subscriptions from "./subscriptions";
import {
  Avatar,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Box } from "@mui/system";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const theme = useTheme();

  const shortcuts = [
    {
      header: "Subscriptions",
      description: "View subscriptions",
      url: "/subscriptions",
      avatar: "S",
    },
    {
      header: "Add subscription",
      description: "Create and add new subscription",
      url: "/subscriptions/new-subscription",
      avatar: "S",
    },
    {
      header: "Network capabilities",
      description: "View network capabilities",
      url: "network-capabilities",
      avatar: "C",
    },
    {
      header: "Profile settings",
      description: "View your details and generate certificate",
      url: "/profile",
      avatar: "P",
    },
    {
      header: "Help & support",
      description: "Do you need assistance with anything?",
      // TODO: Add link
      url: "",
      avatar: "?",
    },
  ];

  return (
    <>
      <Typography variant="h4">Welcome, {session?.user?.name}!</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Typography variant="h5">Shortcuts</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {shortcuts.map((shortcut, key) => (
          <Link
            key={key}
            href={shortcut.url}
            style={{ textDecoration: "none", marginRight: 10, marginTop: 10 }}
          >
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 2,
                width: 400,
                ":hover": {
                  bgcolor: theme.palette.sidebarActiveColor, // theme.shadows[20]
                },
              }}
            >
              <Avatar sx={{ bgcolor: "green", marginRight: 3 }}>
                {shortcut.avatar}
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>{shortcut.header}</Typography>
                <Typography>{shortcut.description}</Typography>
              </Box>
            </Card>
          </Link>
        ))}
      </Box>
    </>
  );
}
