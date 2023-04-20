import { ChangeEvent, useEffect, useState } from "react";
import SelectorBuilder from "@/components/selectorbuilder/SelectorBuilder";
import ButtonComponent from "@/components/ButtonComponent";
/* import InputComponent from "@/components/InputComponent"; */

import { RedirectStatus } from "@/types/napcore/capability";
import { MessageTypes } from "@/types/messageType";
import {
  Box,
  FormControl,
  Grid,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Subscription } from "@/types/napcore/subscription";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import { TableHeaders } from "@/types/tableHeaders";
import TableContainer from "@/components/table/TableContainer";

const tableHeaders: TableHeaders = [
  { property: "publisherId", label: "Publisher ID" },
  { property: "messageType", label: "Message Type" },
  { property: "originatingCountry", label: "Originating Country" },
];
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
  const name = "anna"; // get this from context
  const [selector, setSelector] = useState<string>("");
  const [completedSave, saveCompleted] = useState<boolean>(false);
  const [savedSubscription, setSavedSubscription] = useState<Subscription>();
  const matchingCapabilities = useMatchingCapabilities(name, selector);

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };
  const saveSubscription = async (name: string, selector: string) => {
    const subscriptionsRequest = {
      name,
      subscriptions: [{ selector }],
    };
    const response = await fetch(`/api/napcore/${name}/subscriptions`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionsRequest),
    });
    const data = await response.json();
    setSavedSubscription(data);
    saveCompleted(true);
  };

  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Grid container>
        <Grid item xs={6}>
          <SelectorBuilder
            name="name"
            version="version"
            selectorCallback={handleChange}
          />
          <ButtonComponent
            onClick={() => {
              saveSubscription(name, selector);
            }}
            text={"Save Subscription"}
          />
          <br />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h4">Selector</Typography>
          <p>{selector}</p>
          <TableContainer
            tableHeaders={tableHeaders}
            capabilities={matchingCapabilities.data}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
