import React from "react";
import { Box, Typography } from "@mui/material";
import TableContainer from "@/components/table/TableContainer";

const subscriptions = () => {
  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <TableContainer />
    </Box>
  );
};

export default subscriptions;
