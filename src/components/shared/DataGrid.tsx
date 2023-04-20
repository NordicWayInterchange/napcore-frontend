import React from "react";
import { DataGrid as MuiDataGrid, GridColDef } from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { Capability } from "@/types/capability";
import { Box } from "@mui/material";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | Capability[] | [];
};

export default function DataGrid(props: Props) {
  const { data, tableHeaders } = props;

  return (
    <Box sx={{ width: "100%" }}>
      {!data.length ? (
        <p>No data to display</p>
      ) : (
        <MuiDataGrid
          autoHeight
          rows={data}
          columns={tableHeaders}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
        />
      )}
    </Box>
  );
}
