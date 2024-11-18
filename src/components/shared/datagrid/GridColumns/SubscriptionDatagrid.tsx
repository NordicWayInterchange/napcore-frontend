import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import React from "react";
import { timeConverter } from "@/lib/timeConverter";

export const SubscriptionDatagrid: GridColDef[] = [
  {
    ...dataGridTemplate,
    field: "id",
    headerName: "ID",
    renderCell: (params) => {
      const value = params.row.id;
      return value ? value.substring(0, 8) : '';
    },
  },
  {
    ...dataGridTemplate,
    field: "status",
    headerName: "Status",
    renderCell: (cell) => {
      return (
        <Chip
          color={statusChips[cell.value as keyof typeof statusChips] as any}
          label={cell.value}
        />
      );
    },
  },
  {
    ...dataGridTemplate,
    field: "capabilityMatches",
    headerName: "Capability matches",
  },
  {
    ...dataGridTemplate,
    field: "description",
    headerName: "Description"
  },
  {
    ...dataGridTemplate,
    field: "lastUpdatedTimestamp",
    headerName: "Last updated",
    renderCell: (params) => {
      const value = params.row.lastUpdatedTimestamp;
      return value && timeConverter(value);
    },
  }
];
