import { useState } from "react";
import SelectorBuilder from "@/components/selectorbuilder/SelectorBuilder";
import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import DataGrid from "@/components/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
import { useSession } from "next-auth/react";

const tableHeaders: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "publisherId",
    headerName: "Publisher ID",
  },
  {
    ...dataGridTemplate,
    field: "publicationId",
    headerName: "Publication ID",
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
];

const NewSubscription = () => {
  const { data: session } = useSession();
  const [selector, setSelector] = useState<string>("");

  const matchingCapabilities = useMatchingCapabilities(
    session?.user?.email || "",
    selector
  );

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };

  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <SelectorBuilder
            name="anna"
            version="version"
            selectorCallback={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <DataGrid
            disableRowSelectionOnClick={true}
            tableHeaders={tableHeaders}
            data={matchingCapabilities.data || []}
            loading={matchingCapabilities.isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
