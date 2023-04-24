import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef, GridEventListener, GridRowParams } from "@mui/x-data-grid";
import {
  dataGridTemplate,
  DataGrid,
  ButtonComponent,
} from "@/components/shared/index";
import SubscriptionDetails from "@/components/details/SubscriptionDetails";

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
  const { data, isLoading, isFetching } = useSubscriptions("anna");
  const [extendedSubscription, setExtendedSubscription] = useState();

  const handleEvent: GridEventListener<"rowClick"> = (
    params: GridRowParams<any>
  ) => {
    setExtendedSubscription(params.row);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1, padding: 2 }}>
          <DataGrid
            handleEvent={handleEvent}
            tableHeaders={tableHeaders}
            data={data || []}
          />
        </Box>
        <Box sx={{ flex: 1, padding: 2 }}>
          <SubscriptionDetails extendedSubscription={extendedSubscription} />
        </Box>
      </Box>
    </Box>
  );
}
