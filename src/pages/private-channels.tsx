import React, { useEffect, useState } from "react";
import { Box, Divider, IconButton} from "@mui/material";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { useSession } from "next-auth/react";
import { PrivateChannel, PrivateChannelPeers } from "@/types/napcore/privateChannel";
import { usePrivateChannels } from "@/hooks/usePrivateChannels";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import {
  CustomEmptyOverlayPrivateChannels
} from "@/components/shared/datagrid/CustomEmptyOverlay";
import AddButton from "@/components/shared/actions/AddButton";
import PrivateChannelsDrawer from "@/components/privateChannels/PrivateChannelsDrawer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { performRefetch } from "@/lib/performRefetch";
import PeersDrawer from "@/components/privateChannels/PeersDrawer";
import { usePeers } from "@/hooks/usePeers";
import { timeConverter } from "@/lib/timeConverter";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";

export default function PrivateChannels() {

  const { data: session } = useSession();
  const { data, isLoading, remove, refetch  } = usePrivateChannels(
    session?.user.commonName as string
  );

  const {
    data: peersData,
    isLoading: isPeersLoading,
  } = usePeers(session?.user.commonName as string);

  const [privateChannelRow, setPrivateChannelRow] = useState<PrivateChannel>();
  const [peersRow, setPeersRow] = useState<PrivateChannelPeers>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [peersDrawerOpen, setPeersDrawerOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [shouldRefreshAfterDelete, setShouldRefreshAfterDelete] = useState<boolean>(false);

  const hasPeersData =  peersData && peersData.length > 0;

  useEffect(() => {
    if (isDeleted) {
      performRefetch(refetch);
      setIsDeleted(false);
      setShouldRefreshAfterDelete(true);
    }
  }, [isDeleted, refetch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      performRefetch(refetch);
    }, 30000);
    setShouldRefreshAfterDelete(false);
    return () => {
      clearTimeout(timeout);
    }
  }, [shouldRefreshAfterDelete, refetch]);

  const handleMore = (privateChannel: PrivateChannel) => {
    setPrivateChannelRow(privateChannel);
    setDrawerOpen(true);
  };

  const peersHandleMore = (peers: PrivateChannelPeers) => {
    setPeersRow(peers);
    setPeersDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
  };

  const handlePeersMoreClose = () => {
    setPeersDrawerOpen(false);
  };

  const handleDelete = (privateChannel: PrivateChannel) => {
    setPrivateChannelRow(privateChannel);
    setOpen(true);
  };
  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };

  const handleOnPeersRowClick = (params: any) => {
    peersHandleMore(params.row);
  };

  const handleDeletedItem = (deleted: boolean) => {
    setIsDeleted(deleted);
  };


  const tableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      field: "id",
      headerName: "ID",
      valueGetter: ({value}) => value.substring(0, 8)
    },
    {
      ...dataGridTemplate,
      field: "status",
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
      field: "description",
      headerName: "Description",
      flex: 3,
    },
    {
      ...dataGridTemplate,
      field: "lastUpdated",
      headerName: "Last updated",
      valueGetter: ({ value }) => value && timeConverter(value),
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

  const peerTableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      field: "id",
      headerName: "ID",
      valueGetter: ({value}) => value.substring(0, 8)
    },
    {
      ...dataGridTemplate,
      field: "status",
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
      field: "owner",
      headerName: "Owner",
      flex: 3,
    },
    {
      ...dataGridTemplate,
      field: "lastUpdated",
      headerName: "Last updated",
      valueGetter: ({ value }) => value && timeConverter(value),
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
            <IconButton onClick={() => peersHandleMore(params.row)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box flex={1}>
      <Mainheading>Private channels</Mainheading>
      <Subheading>
        These are all of private channels in the network. You can click a private channel or a subscribed private channel
        to view more information and remove.
      </Subheading>
      <Divider sx={{ marginY: 2 }} />
      <AddButton text="Create private channel" labelUrl="privateChannel"></AddButton>

      <Divider style={{ margin: '5px 0', visibility: 'hidden' }} />
      <Subheading>My private channels</Subheading>
      <Divider style={{ margin: '5px 0', visibility: 'hidden' }} />

      <Box
        sx={{
          maxHeight: hasPeersData ? "400px": "hidden",
          overflowY: hasPeersData ? "auto" : "hidden",
        }}
      >
        <DataGrid
          columns={tableHeaders}
          rows={data || []}
          onRowClick={handleOnRowClick}
          loading={isLoading}
          getRowId={(row) => row.id}
          sort={{ field: "lastUpdated", sort: "desc" }}
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
        <DeleteSubDialog
          itemId={privateChannelRow?.id as string}
          handleDialog={handleClickClose}
          open={open}
          actorCommonName={session?.user.commonName as string}
          handleDeletedItem={handleDeletedItem}
          text="Private channel"
        />
      </Box>

      <Divider style={{ margin: '20px 0', visibility: 'hidden' }} />
      {hasPeersData && (
        <Box>
          <Subheading>My subscribed private channels</Subheading>
          <Divider style={{ margin: '5px 0', visibility: 'hidden' }} />
          <Box
            sx={{
              maxHeight: hasPeersData ? "400px": "hidden",
              overflowY: hasPeersData ? "auto" : "hidden",
            }}
          >
            <DataGrid
              columns={peerTableHeaders}
              rows={peersData || []}
              onRowClick={handleOnPeersRowClick}
              loading={isPeersLoading}
              getRowId={(row) => row.id}
              sort={{ field: "lastUpdated", sort: "desc" }}
              slots={{
                noRowsOverlay: CustomEmptyOverlayPrivateChannels
              }}
            />
            {peersRow && (
              <PeersDrawer
                handleMoreClose={handlePeersMoreClose}
                open={peersDrawerOpen}
                peers={peersRow as PrivateChannelPeers}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}