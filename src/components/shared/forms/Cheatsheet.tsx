import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Box } from "@mui/system";
import Subheading from "@/components/shared/display/typography/Subheading";
import React from "react";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { Divider, Typography } from "@mui/material";

const CheatsheetGrid: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "operator",
    headerName: "SQL operator",
    flex: 1
  },
  {
    ...dataGridTemplate,
    field: "description",
    headerName: "Description",
    flex: 2
  },
  {
    ...dataGridTemplate,
    field: "selector",
    headerName: "Example selector",
    flex: 2,
  },
];

const cheatsheetContent = [
  {
    "id": 1,
    "operator": "=, <>, <, <=, >, >=",
    "description": "",
    "selector": "originatingCountry = 'NO'",
  },
  {
    "id": 2,
    "operator": "BETWEEN",
    "description": "Checks if value is withing range",
    "selector": "NO12345:test111",
  },
  {
    "id": 3,
    "operator": "IS NULL, IS NOT NULL",
    "description": "Checks if value is null/ not null",
    "selector": "causeCode IS NULL, quadtree IS NOT NULL",
  },
  {
    "id": 4,
    "operator": "=, <>, <, <=, >, >=",
    "description": "",
    "selector": "originatingCountry = 'NO'",
  }, {
    "id": 5,
    "operator": "AND, OR, NOT",
    "description": "Combines logical statements",
    "selector": "messageType = 'DENM' and quadTree like '%,1234%' AND originatingCountry = 'NO'",
  },
];

export const Cheatsheet = () => {
  return (
    <Box flex={1}>
      <Subheading>Selector cheat sheet</Subheading>
      <Typography>Need assistance with the selector? Check out our cheat sheet</Typography>
      <Divider sx={{ marginY: 2 }} />

      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        columns={CheatsheetGrid}
        rows={cheatsheetContent || []}
        hideFooterPagination={true}
        sort={{ field: "operator", sort: "desc" }}
        getRowHeight={() => 'auto'}
      />
      </div>
    </Box>
  );
}