import SubscriptionTable from "@/components/table/SubscriptionTable";
import React from "react";
import { Box, Typography } from "@mui/material";

const subscriptions = () => {
  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <SubscriptionTable />
    </Box>
  );
};

export default subscriptions;
