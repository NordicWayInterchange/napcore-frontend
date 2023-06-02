import React from "react";
import { DataGrid as MuiDataGrid, DataGridProps } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

interface Props extends DataGridProps {}

export default function DataGrid(props: Props) {
  return (
    <Box sx={{ height: "70vh" }}>
      <StyledDataGrid
        {...props}
        disableRowSelectionOnClick={true}
        sx={{ backgroundColor: "white" }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            /* TODO:
             *   - sub does not have pub. id, so we need to sort on id
             * */
            sortModel: [{ field: "publicationId", sort: "desc" }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
}

const StyledDataGrid = styled(MuiDataGrid)(({}) => ({
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
}));
