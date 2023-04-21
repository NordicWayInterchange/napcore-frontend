import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";

export default function NetworkCapabilities() {
  const { data, isLoading, isFetching } = useNetworkCapabilities("anna");

  const tableHeaders: GridColDef[] = [
    { ...dataGridTemplate, field: "publisherId", headerName: "Publisher ID" },
    {
      ...dataGridTemplate,
      field: "messageType",
      headerName: "Message Type",
    },
    {
      ...dataGridTemplate,
      field: "protocolVersion",
      headerName: "Protocol Version",
    },
    {
      ...dataGridTemplate,
      field: "originatingCountry",
      headerName: "Originating Country",
    },
    {
      ...dataGridTemplate,
      field: "redirect",
      headerName: "Redirect Status",
      description: "This is a description of Redirect",
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Network Capabilities</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid tableHeaders={tableHeaders} data={data || []} />
      )}
    </Box>
  );
}
