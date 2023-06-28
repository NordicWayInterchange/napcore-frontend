import React, { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { useSession } from "next-auth/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ExtendedCapability } from "@/types/capability";
import CapabilitiesDrawer from "@/components/capabilities/CapabilitiesDrawer";
import { messageTypeChips } from "@/lib/statusChips";
import { Chip } from "@/components/shared/display/Chip";
import { CustomEmptyOverlayCapabilites } from "@/components/shared/datagrid/CustomEmptyOverlay";

export default function NetworkCapabilities() {
  const { data: session } = useSession();
  // TODO: Common name needs a prefix
  const { data, isLoading } = useNetworkCapabilities(
    session?.user?.email as string
  );
  const [capabilityRow, setCapabilityRow] = useState<ExtendedCapability>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleMore = (capability: ExtendedCapability) => {
    setCapabilityRow(capability);
    setDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  // TODO: Extract
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
      renderCell: (cell) => {
        return (
          <Chip
            color={
              messageTypeChips[
                cell.value as keyof typeof messageTypeChips
              ] as any
            }
            label={cell.value}
          />
        );
      },
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
    <Box flex={1}>
      <Typography variant="h4">Network Capabilities</Typography>
      <Divider sx={{ marginY: 3 }} />
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        loading={isLoading}
        getRowId={(row) => row.publicationId}
        sort={{ field: "publicationId", sort: "desc" }}
        slots={{
          noRowsOverlay: CustomEmptyOverlayCapabilites,
        }}
      />
      {capabilityRow && (
        <CapabilitiesDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          capability={capabilityRow as ExtendedCapability}
        />
      )}
    </Box>
  );
}
