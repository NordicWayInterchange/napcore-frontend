import { useState } from "react";
import SelectorBuilder from "@/components/selectorbuilder/SelectorBuilder";
import { Box, FormControl, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Subscription } from "@/types/napcore/subscription";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import ButtonComponent from "@/components/shared/Button";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";
import TextArea from "@/components/selectorbuilder/TextArea";

const tableHeaders: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "publisherId",
    headerName: "Publisher ID",
  },
  {
    ...dataGridTemplate,
    field: "messageType",
    headerName: "Message Type",
  },
  {
    ...dataGridTemplate,
    field: "protocolVersion",
    headerName: "Protocol Version",
  },
  {
    ...dataGridTemplate,
    field: "originatingCountry",
    headerName: "Originating Country",
  },
  {
    ...dataGridTemplate,
    field: "redirect",
    headerName: "Redirect Status",
  },
];

const NewSubscription = () => {
  const name = "anna"; // get this from context
  const [selector, setSelector] = useState<string>("");
  const matchingCapabilities = useMatchingCapabilities(name, selector);

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };

  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <SelectorBuilder
            name="name"
            version="version"
            selectorCallback={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">Matching Capabilities</Typography>
          <DataGrid
            disableRowSelectionOnClick={true}
            tableHeaders={tableHeaders}
            data={matchingCapabilities.data || []}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
