import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Box } from "@mui/system";
import Subheading from "@/components/shared/display/typography/Subheading";
import React from "react";
import DataGrid from "@/components/shared/datagrid/DataGrid";

const CheatsheetGrid: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "operator",
    headerName: "Operator",
  },
  {
    ...dataGridTemplate,
    field: "description",
    headerName: "Description",
  },
  {
    ...dataGridTemplate,
    field: "selector",
    headerName: "Example selector",
  },
];

const cheatsheetContent = null;

export const Cheatsheet = () => {
  return (
    <Box flex={1}>
      <Subheading>Cheatsheet content</Subheading>
      <DataGrid
        columns={CheatsheetGrid}
        rows={cheatsheetContent || []}
        hideFooterPagination={true}
        sort={{ field: "lastStatusChange", sort: "desc" }}
      />
    </Box>
  );
}