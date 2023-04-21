import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import ButtonComponent from "@/components/shared/Button";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";

export default function Subscriptions() {
  const { data, isLoading, isFetching } = useSubscriptions("anna");

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

  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid tableHeaders={tableHeaders} data={data || []} />
      )}
    </Box>
  );
}
