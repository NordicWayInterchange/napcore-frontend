import { useState } from "react";
import SelectorBuilder from "@/components/selectorbuilder/SelectorBuilder";
import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import DataGrid from "@/components/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/datagrid/DataGridTemplate";
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
          // TODO: Fix
          color={messageTypeChips[cell.value]}
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

  const handleChange = (selector: string) => {
    setSelector(selector);
    matchingCapabilities.remove();
  };

  return (
    <Box>
      <Typography variant="h4">Create subscription</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <Box sx={{ flexGrow: 1, flexBasis: "50%" }}>
          <SelectorBuilder
            name="anna"
            version="version"
            selectorCallback={handleChange}
          />
        </Box>
        <Box sx={{ flexGrow: 1, flexBasis: "50%" }}>
          <DataGrid
            columns={tableHeaders}
            rows={matchingCapabilities.data || []}
            loading={matchingCapabilities.isLoading}
            getRowId={(row) => row.publicationId}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NewSubscription;
