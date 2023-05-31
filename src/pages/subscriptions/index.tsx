import React, { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef, GridEventListener, GridRowParams } from "@mui/x-data-grid";
import { ButtonComponent } from "@/components/shared/index";
import SubscriptionDetails from "@/components/details/SubscriptionDetails";
import { useSession } from "next-auth/react";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
import DataGrid from "@/components/datagrid/DataGrid";
import { statusChips } from "@/lib/statusChips";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// TODO: Extract to seperate file
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
    renderCell: (cell) => {
      return (
        <Box>
          <IconButton onClick={() => console.log("clicked trash")}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => console.log("clicked more")}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      );
    },
  },
];

export default function Subscriptions() {
  const { data: session } = useSession();
  const { data, isLoading, isFetching } = useSubscriptions(
    session?.user?.email as string
  );
  const [extendedSubscription, setExtendedSubscription] = useState();

  const handleEvent: GridEventListener<"rowClick"> = (
    params: GridRowParams<any>
  ) => {
    setExtendedSubscription(params.row);
  };

  return (
    <>
      <Typography variant="h4">Subscription</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Link
        style={{
          textDecoration: "none",
          color: "black",
        }}
        href="/subscriptions/new-subscription"
      >
        {/*
        <ButtonComponent text={"Create Subscription"} />
*/}
      </Link>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataGrid
            handleEvent={handleEvent}
            tableHeaders={tableHeaders}
            data={data || []}
            loading={isLoading}
          />
        </Grid>
        {/*        <Grid item xs={6}>
          <SubscriptionDetails extendedSubscription={extendedSubscription} />
        </Grid>*/}
      </Grid>
    </>
  );
}
