import Form from "@/components/form/Form";
import { Box, Typography } from "@mui/material";
import React from "react";

const NewSubscription = () => {
  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Form name="name" version="version" />
    </Box>
  );
};

export default NewSubscription;
