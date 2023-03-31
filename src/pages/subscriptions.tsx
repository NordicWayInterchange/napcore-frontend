import React from "react";
import { Box, Typography } from "@mui/material";
import TableContainer from "@/components/table/TableContainer";
import { useSubscriptions } from "../hooks/useSubscriptions";

const subscriptions = () => {
  const { data, isLoading, isFetching } = useSubscriptions("anna");
  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <TableContainer />
    </Box>
  );
};

export default subscriptions;
