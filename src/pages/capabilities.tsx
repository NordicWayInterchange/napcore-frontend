import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCapabilities } from "@/hooks/useCapabilities";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";

export default function NetworkCapabilities() {
  const { data, isLoading, isFetching } = useCapabilities("anna");

  const tableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      field: "publisherId",
      headerName: "Publisher ID",
    },
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
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Capabilities</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid tableHeaders={tableHeaders} data={data || []} />
      )}
    </Box>
  );
}
