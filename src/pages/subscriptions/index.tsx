import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import ButtonComponent from "@/components/shared/Button";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";
import { ExtendedSubscription } from "@/types/subscription";
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
  const [extendedSubscription, setExtendedSubscription] =
    useState<ExtendedSubscription>();

  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <DataGrid
              setState={setExtendedSubscription}
              tableHeaders={tableHeaders}
              data={data || []}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <SubscriptionDetails extendedSubscription={extendedSubscription} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
