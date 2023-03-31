import React from "react";
import { Box, Typography } from "@mui/material";
import { useDeliveries } from "../hooks/useDeliveries";

const deliveries = () => {
  const { data, isLoading, isFetching } = useDeliveries("anna");
  return (
    <Box>
      <Typography variant="h4">Deliveries</Typography>
    </Box>
  );
};

export default deliveries;
