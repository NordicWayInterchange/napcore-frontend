import React, { useState } from "react";
import { Box, Divider, IconButton } from "@mui/material";
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
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";

export default function NetworkCapabilities() {
  const { data: session } = useSession();
  const { data, isLoading } = useNetworkCapabilities(
    session?.user.commonName as string
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
      headerName: "Message type",
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
      headerName: "Protocol version",
    },
    {
      ...dataGridTemplate,
      field: "originatingCountry",
      headerName: "Originating country",
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

  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };

  return (
    <Box flex={1}>
      <Mainheading>Network Capabilities</Mainheading>
      <Subheading>
        These are all of the capabilites in the network. You can click a
        capability to view more information and subscribe.
      </Subheading>
      <Divider sx={{ marginY: 3 }} />
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        onRowClick={handleOnRowClick}
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
