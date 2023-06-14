import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import Subscriptions from "./subscriptions";
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { Box } from "@mui/system";
import Link from "next/link";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function Home() {
  const { data: session } = useSession();
  const theme = useTheme();
  const { data, isLoading } = useSubscriptions(session?.user?.email as string);

  const shortcuts = [
    {
      header: "Subscriptions",
      description: "View subscriptions",
      url: "/subscriptions",
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

  const tableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      /*flex: 0,*/
      field: "id",
      headerName: "ID",
    },
    {
      ...dataGridTemplate,
      field: "status",
      headerName: "Status",
      renderCell: (cell) => {
        return <Chip color={statusChips[cell.value]} label={cell.value} />;
      },
    },
    {
      ...dataGridTemplate,
      field: "capabilityMatches",
      headerName: "Capability Matches",
    },
    {
      ...dataGridTemplate,
      field: "lastUpdatedTimeStamp",
      headerName: "Last updated",
    },
    {
      ...dataGridTemplate,
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "right",
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
                  bgcolor: theme.palette.sidebarActiveColor,
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
      <Typography variant="h5">Your latest subscriptions</Typography>
      <DataGrid
        columns={tableHeaders}
        rows={data?.slice(0, 4) || []}
        loading={isLoading}
        hideFooterPagination={true}
      />
    </>
  );
}
