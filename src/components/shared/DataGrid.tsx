import React from "react";
import { DataGrid as MuiDataGrid, GridColDef } from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { Capability } from "@/types/capability";
import { Box } from "@mui/material";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | Capability[];
};

export default function DataGrid(props: Props) {
  const { data, tableHeaders } = props;

  const rows = data?.map((row, ix) => ({ ...row, id: ix }));

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {!data.length ? (
        <p>No data to display</p>
      ) : (
        <MuiDataGrid
          rows={rows}
          columns={tableHeaders}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      )}
    </Box>
  );
}
