import React, { useState } from "react";
import { Box, Divider, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { useSession } from "next-auth/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ExtendedCapability } from "@/types/capability";
import { messageTypeChips } from "@/lib/statusChips";
import { Chip } from "@/components/shared/display/Chip";
import { CustomEmptyOverlayUserCapabilites } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import {useUserCapabilities } from "@/hooks/useCapabilities";
import UserCapabilitiesDrawer from "@/components/userCapabilities/UserCapabilitiesDrawer";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomFooter } from "@/components/shared/datagrid/CustomFooter";
import AddButton from "@/components/shared/actions/AddButton";

export default function Capabilities() {
  const { data: session } = useSession();
  const { data, isLoading, remove } = useUserCapabilities(
    session?.user.commonName as string
  );

  const [userCapabilityRow, setUserCapabilityRow] = useState<ExtendedCapability>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = (capability: ExtendedCapability) => {
    setUserCapabilityRow(capability);
    setOpen(true);
  };

  const handleMore = (capability: ExtendedCapability) => {
    setUserCapabilityRow(capability);
    setDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
    remove();
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
            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
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
      <Mainheading>My Capabilities</Mainheading>
      <Subheading>
        These are all of user capabilites in the network. You can click a
        capability to view more information and remove.
      </Subheading>
      <Divider sx={{ marginY: 2 }} />
      <AddButton text="Add capability"></AddButton>
      <Divider style={{ margin: '5px 0', visibility: 'hidden' }}/>
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        onRowClick={handleOnRowClick}
        loading={isLoading}
        getRowId={(row) => row.publicationId}
        sort={{ field: "publicationId", sort: "desc" }}
        slots={{
          footer: CustomFooter,
          noRowsOverlay: CustomEmptyOverlayUserCapabilites,
        }}
      />
      {userCapabilityRow && (
        <UserCapabilitiesDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          capability={userCapabilityRow as ExtendedCapability}
        />
      )}
      <DeleteSubDialog
        itemId={userCapabilityRow?.id as string}
        handleDialog={handleClickClose}
        open={open}
        actorCommonName={session?.user.commonName as string}
        text="Capability"
      />
    </Box>
  );
}