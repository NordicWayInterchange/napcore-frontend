import React, { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
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

export default function Subscriptions() {
  const { data: session } = useSession();
  const { data, isLoading } = useSubscriptions(session?.user?.email as string);
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

  return (
    <>
      <Typography variant="h4">Subscriptions</Typography>
      <Divider sx={{ marginY: 3 }} />
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        loading={isLoading}
        slots={{ footer: CustomFooter }}
        sortModel={[{ field: "id", sort: "asc" }]}
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
        actorCommonName={"anna"}
      />
    </>
  );
}
