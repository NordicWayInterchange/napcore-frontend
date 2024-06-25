import React, { useState } from "react";
import { Box, Divider, IconButton } from "@mui/material";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { statusChips } from "@/lib/statusChips";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteSubDialog from "@/components/subscriptions/DeleteSubDialog";
import { ExtendedSubscription } from "@/types/subscription";
import SubscriptionsDrawer from "@/components/subscriptions/SubscriptionsDrawer";
import { CustomFooter } from "@/components/shared/datagrid/CustomFooter";
import { Chip } from "@/components/shared/display/Chip";
import { timeConverter } from "@/lib/timeConverter";
import { CustomEmptyOverlaySubscription } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";

export default function Subscriptions() {
  const { data: session } = useSession();
  const { data, isLoading, remove } = useSubscriptions(
    session?.user?.commonName as string
  );
  const [open, setOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [subscriptionRow, setSubscriptionRow] =
    useState<ExtendedSubscription>();

  const handleDelete = (subscription: ExtendedSubscription) => {
    setSubscriptionRow(subscription);
    setOpen(true);
  };

  const handleMore = (subscription: ExtendedSubscription) => {
    setSubscriptionRow(subscription);
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
      field: "capabilityMatches",
      headerName: "Capability matches",
    },
    {
      ...dataGridTemplate,
      field: "lastUpdatedTimestamp",
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

  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };

  return (
    <Box flex={1}>
      <Mainheading>Subscriptions</Mainheading>
      <Subheading>
        These are all of your subscriptions. You can click a subscription to
        view more information or unsubscribe.
      </Subheading>
      <Divider sx={{ marginY: 3 }} />
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        onRowClick={handleOnRowClick}
        loading={isLoading}
        slots={{
          footer: CustomFooter,
          noRowsOverlay: CustomEmptyOverlaySubscription,
        }}
        sort={{ field: "id", sort: "desc" }}
      />
      {subscriptionRow && (
        <SubscriptionsDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          subscription={subscriptionRow as ExtendedSubscription}
        />
      )}
      <DeleteSubDialog
        subscriptionId={subscriptionRow?.id as string}
        handleDialog={handleClickClose}
        open={open}
        actorCommonName={session?.user.commonName as string}
      />
    </Box>
  );
}
