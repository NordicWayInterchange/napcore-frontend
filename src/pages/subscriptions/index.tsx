import React, { useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef, GridEventListener, GridRowParams } from "@mui/x-data-grid";
import { ButtonComponent } from "@/components/shared/index";
import SubscriptionDetails from "@/components/details/SubscriptionDetails";
import { useSession } from "next-auth/react";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
import DataGrid from "@/components/datagrid/DataGrid";

const tableHeaders: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "id",
    headerName: "ID",
  },
  {
    ...dataGridTemplate,
    field: "consumerCommonName",
    headerName: "Consumer Common Name",
  },
  {
    ...dataGridTemplate,
    field: "status",
    headerName: "Status",
  },
  {
    ...dataGridTemplate,
    field: "capabilityMatches",
    headerName: "Capability Matches",
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

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.url} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <DataGrid
            handleEvent={handleEvent}
            tableHeaders={tableHeaders}
            data={data || []}
          />
        </Grid>
        <Grid item xs={6}>
          <SubscriptionDetails extendedSubscription={extendedSubscription} />
        </Grid>
      </Grid>
    </>
  );
}
