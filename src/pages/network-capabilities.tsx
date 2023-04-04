import React from "react";
import { Box, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import TableContainer from "@/components/table/TableContainer";

const NetworkCapabilities = () => {
  const { data, isLoading, isFetching } = useNetworkCapabilities("anna");

  const headers = [
    { property: "publisherId", label: "Publisher ID" },
    { property: "messageType", label: "Message Type" },
    { property: "originatingCountry", label: "Originating Country" },
  ];

  return (
    <Box>
      <Typography variant="h4">Network Capabilities</Typography>
      <TableContainer headers={headers} capabilities={data} />
    </Box>
  );
};

export default NetworkCapabilities;
