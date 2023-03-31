import React from "react";
import { Box, Typography } from "@mui/material";
import { useNetworkCapabilities } from "../hooks/useNetworkCapabilities";

const networkCapabilities = () => {
  const { data, isLoading, isFetching } = useNetworkCapabilities("anna");
  return (
    <Box>
      <Typography variant="h4">Network Capabilities</Typography>
    </Box>
  );
};

export default networkCapabilities;
