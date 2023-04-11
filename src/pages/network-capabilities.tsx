import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import TableContainer from "@/components/table/TableContainer";
import { TableHeaders } from "@/types/tableHeaders";

const NetworkCapabilities = () => {
  const { data, isLoading, isFetching } = useNetworkCapabilities("anna");

  const tableHeaders: TableHeaders = [
    { property: "publisherId", label: "Publisher ID" },
    { property: "messageType", label: "Message Type" },
    { property: "originatingCountry", label: "Originating Country" },
  ];

  return (
    <Box>
      <Typography variant="h4">Network Capabilities</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer tableHeaders={tableHeaders} capabilities={data} />
      )}
    </Box>
  );
};

export default NetworkCapabilities;
