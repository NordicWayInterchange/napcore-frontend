import { ChangeEvent, useEffect, useState } from "react";
import SelectorBuilder from "@/components/selectorbuilder/SelectorBuilder";
import { RedirectStatus } from "@/types/napcore/capability";
import { MessageTypes } from "@/types/messageType";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { Subscription } from "@/types/napcore/subscription";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import { createSubscription } from "@/lib/fetchers";
import ButtonComponent from "@/components/shared/Button";
import DataGrid from "@/components/shared/DataGrid";

const tableHeaders: GridColDef[] = [
  {
    field: "publisherId",
    headerName: "Publisher ID",
    width: 200,
    editable: true,
  },
  {
    field: "messageType",
    headerName: "Message Type",
    width: 200,
    editable: true,
  },
  {
    field: "protocolVersion",
    headerName: "Protocol Version",
    width: 200,
    editable: true,
  },
  {
    field: "originatingCountry",
    headerName: "Originating Country",
    width: 200,
    editable: true,
  },
  {
    field: "redirect",
    headerName: "Redirect Status",
    width: 200,
    editable: true,
  },
];

const NewSubscription = () => {
  const name = "anna"; // get this from context
  const [selector, setSelector] = useState<string>("");
  const [completedSave, setCompletedSave] = useState<boolean>(false);
  const [savedSubscription, setSavedSubscription] = useState<Subscription>();
  const matchingCapabilities = useMatchingCapabilities(name, selector);

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    setSavedSubscription(data);
    setCompletedSave(true);
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
          <DataGrid
            tableHeaders={tableHeaders}
            data={matchingCapabilities.data || []}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
