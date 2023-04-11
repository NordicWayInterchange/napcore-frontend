import React from "react";
import { Box, Typography } from "@mui/material";
import { useCapabilities } from "@/hooks/useCapabilities";

const Capabilities = () => {
  const { data, isLoading, isFetching } = useCapabilities("anna");

  return (
    <Box>
      <Typography variant="h4">Capabilities</Typography>
    </Box>
  );
};

export default Capabilities;
