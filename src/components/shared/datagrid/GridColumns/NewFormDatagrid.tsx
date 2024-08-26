import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { messageTypeChips } from "@/lib/statusChips";
import React from "react";
import { Chip } from "@/components/shared/display/Chip";

export const NewFormDataGrid: GridColDef[] = [
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
    headerName: "Message type",
    renderCell: (cell) => {
      return (
        <Chip
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
    headerName: "Protocol version",
  },
  {
    ...dataGridTemplate,
    field: "originatingCountry",
    headerName: "Originating country",
  },
];
