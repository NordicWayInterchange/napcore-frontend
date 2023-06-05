import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import {
  GridColDef,
  GridEventListener,
  GridPagination,
  GridRowParams,
} from "@mui/x-data-grid";
import { ButtonComponent } from "@/components/shared/index";
import SubscriptionDetails from "@/components/details/SubscriptionDetails";
import { useSession } from "next-auth/react";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
import DataGrid from "@/components/datagrid/DataGrid";
import { statusChips } from "@/lib/statusChips";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DeleteSubDialog } from "@/components/details";
import { SubscriptionsSubscription } from "@/types/napcore/subscription";
import { ExtendedSubscription } from "@/types/subscription";
import SubscriptionsDrawer from "@/components/subscriptions/SubscriptionsDrawer";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { CustomFooter } from "@/components/datagrid/CustomFooter";

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
            sx={{ borderRadius: 1 }}
            // TODO: Fix
            color={statusChips[cell.value]}
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
      <Link
        style={{
          textDecoration: "none",
          color: "black",
        }}
        href="/subscriptions/new-subscription"
      ></Link>
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        loading={isLoading}
        slots={{ footer: CustomFooter }}
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
