import React, { useState } from "react";
import { Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import { GridColDef, GridEventListener, GridRowParams } from "@mui/x-data-grid";
import DataGrid from "@/components/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
import { CapabilityDetails } from "@/components/details";
import { useSession } from "next-auth/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";
import SubscriptionsDrawer from "@/components/subscriptions/SubscriptionsDrawer";
import CapabilitiesDrawer from "@/components/capabilities/CapabilitiesDrawer";
import { messageTypeChips, statusChips } from "@/lib/statusChips";

export default function NetworkCapabilities() {
  const { data: session } = useSession();
  // TODO: Common name needs a prefix
  const { data, isLoading } = useNetworkCapabilities(
    session?.user?.email as string
  );
  const [capabilityRow, setCapabilityRow] = useState<ExtendedCapability>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [extendedCapability, setExtendedCapability] = useState();

  const handleMore = (subscription: ExtendedSubscription) => {
    setCapabilityRow(subscription);
    setDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const tableHeaders: GridColDef[] = [
    { ...dataGridTemplate, field: "publisherId", headerName: "Publisher ID" },
    {
      ...dataGridTemplate,
      field: "publicationId",
      headerName: "Publication ID",
    },
    {
      ...dataGridTemplate,
      field: "messageType",
      headerName: "Message Type",
      // TODO: Add colors (currently flickering when rerender)
      /*renderCell: (cell) => {
        return (
          <Chip
            sx={{ borderRadius: 1 }}
            // TODO: Fix
            color={messageTypeChips[cell.value]}
            label={cell.value}
          />
        );
      },*/
    },
    {
      ...dataGridTemplate,
      field: "protocolVersion",
      headerName: "Protocol Version",
    },
    {
      ...dataGridTemplate,
      field: "originatingCountry",
      headerName: "Originating Country",
    },
    {
      ...dataGridTemplate,
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "right",
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={() => handleMore(params.row)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Typography variant="h4">Network Capabilities</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}>
          <DataGrid
            tableHeaders={tableHeaders}
            data={data || []}
            loading={isLoading}
          />
        </Box>
        {capabilityRow && (
          <CapabilitiesDrawer
            handleMoreClose={handleMoreClose}
            open={drawerOpen}
            capability={capabilityRow as ExtendedCapability}
          />
        )}
      </Box>
    </>
  );
}
