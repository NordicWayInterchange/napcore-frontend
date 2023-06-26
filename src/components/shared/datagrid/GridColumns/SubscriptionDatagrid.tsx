import { GridColDef } from "@mui/x-data-grid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import React from "react";

export const SubscriptionDatagrid: GridColDef[] = [
  {
    ...dataGridTemplate,
    /*flex: 0,*/
    field: "id",
    headerName: "ID",
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
    headerName: "Capability Matches",
  },
  {
    ...dataGridTemplate,
    field: "lastUpdatedTimestamp",
    headerName: "Last updated",
  },
  {
    ...dataGridTemplate,
    field: "actions",
    headerName: "",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: "right",
  },
];
