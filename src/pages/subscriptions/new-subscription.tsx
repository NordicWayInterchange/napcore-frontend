import Form from "@/components/form/Form";
import { RedirectStatus } from "@/types/napcore/capability";
import { MessageTypes } from "@/types/messageType";
import { Box, Typography } from "@mui/material";
import React from "react";

const NewSubscription = () => {
  let capability = {
    messageType: MessageTypes.DATEX_2,
    protocolVersion: "DATEX:1.1.1",
    originatingCountry: "NO",
    publisherId: "Bouvet-1",
    quadTree: ["1"],
    redirect: RedirectStatus.MANDATORY,
    shardCount: 1,
    infoUrl: "info.url",
  };

  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Form name="name" version="version" />
      <Form capability={capability} name="name" version="version" />
    </Box>
  );
};

export default NewSubscription;
