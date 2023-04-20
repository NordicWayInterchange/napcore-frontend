import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useCapabilities } from "@/hooks/useCapabilities";
import DataGrid from "@/components/shared/DataGrid";

export default function NetworkCapabilities() {
  const { data, isLoading, isFetching } = useCapabilities("anna");

  const tableHeaders: GridColDef[] = [
    {
      field: "publisherId",
      headerName: "Publisher ID",
      width: 200,
      editable: true,
    },
    {
      field: "messageType",
      headerName: "Message Type",
      width: 200,
      editable: true,
    },
    {
      field: "protocolVersion",
      headerName: "Protocol Version",
      width: 200,
      editable: true,
    },
    {
      field: "originatingCountry",
      headerName: "Originating Country",
      width: 200,
      editable: true,
    },
    {
      field: "redirect",
      headerName: "Redirect Status",
      width: 200,
      editable: true,
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Capabilities</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid tableHeaders={tableHeaders} data={data} />
      )}
    </Box>
  );
}
