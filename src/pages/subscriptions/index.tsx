import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import ButtonComponent from "@/components/shared/Button";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/DataGrid";

export default function Subscriptions() {
  const { data, isLoading, isFetching } = useSubscriptions("anna");

  const tableHeaders: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      editable: true,
    },
    {
      field: "consumerCommonName",
      headerName: "Consumer Common Name",
      width: 200,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      editable: true,
    },
    {
      field: "capabilityMatches",
      headerName: "Capability Matches",
      width: 200,
      editable: true,
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Network Capabilities</Typography>
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
