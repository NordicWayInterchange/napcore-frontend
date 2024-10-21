import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { useSession } from "next-auth/react";
import { PrivateChannel } from "@/types/napcore/privateChannel";
import { usePrivateChannels } from "@/hooks/usePrivateChannels";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import {
  CustomEmptyOverlayPrivateChannels
} from "@/components/shared/datagrid/CustomEmptyOverlay";
import AddButton from "@/components/shared/actions/AddButton";
import PrivateChannelsDrawer from "@/components/privateChannels/PrivateChannelsDrawer";

export default function PrivateChannels() {

  const { data: session } = useSession();
  const { data, isLoading } = usePrivateChannels(
    session?.user.commonName as string
  );
  const [privateChannelRow, setPrivateChannelRow] = useState<PrivateChannel>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const handleMore = (privateChannel: PrivateChannel) => {
    setPrivateChannelRow(privateChannel);
    setDrawerOpen(true);
  };
  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };

  const handleDeletedItem = (deleted: boolean) => {
    setIsDeleted(deleted);
  };


  const tableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      field: "id",
      headerName: "ID",
    },
    {
      ...dataGridTemplate,
      field: "privateChannelStatus",
      headerName: "Status",
      renderCell: (cell) => {
        return (
          <Chip
            color={statusChips[cell.value as keyof typeof statusChips] as any}
            label={cell.value}
          />
        );
      },
    },
    {
      ...dataGridTemplate,
      field: "serviceProviderName",
      headerName: "Service provider name",
    },
    {
      ...dataGridTemplate,
      field: "description",
      headerName: "Description",
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
    <Box flex={1}>
      <Mainheading>Private channels</Mainheading>
      <Subheading>
        These are private channels.....
      </Subheading>
      <Divider sx={{ marginY: 3 }} />
      <AddButton text="Create private channel" labelUrl="privateChannel"></AddButton>
      <Divider style={{ margin: '5px 0', visibility: 'hidden' }}/>
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        onRowClick={handleOnRowClick}
        loading={isLoading}
        getRowId={(row) => row.publicationId}
        sort={{ field: "lastUpdatedTimestamp", sort: "desc" }}
        slots={{
          noRowsOverlay: CustomEmptyOverlayPrivateChannels,
        }}
      />
      {privateChannelRow && (
        <PrivateChannelsDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          privateChannel={privateChannelRow as PrivateChannel}
          handleDeletedItem={handleDeletedItem}
        />
      )}
    </Box>
  );
}