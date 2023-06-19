import { useState } from "react";
import SelectorBuilder from "@/components/subscriptions/SelectorBuilder";
import { Chip, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { useSession } from "next-auth/react";
import { messageTypeChips } from "@/lib/statusChips";

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
    renderCell: (cell) => {
      return (
        <Chip
          sx={{ borderRadius: 1 }}
          color={
            messageTypeChips[cell.value as keyof typeof messageTypeChips] as any
          }
          label={cell.value}
        />
      );
    },
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

  const { data, isLoading } = useMatchingCapabilities(
    session?.user?.email as string,
    selector
  );

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };

  return (
    <>
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
            columns={tableHeaders}
            rows={data || []}
            loading={isLoading}
            getRowId={(row) => row.publicationId}
            sortModel={[{ field: "publicationId", sort: "desc" }]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default NewSubscription;
