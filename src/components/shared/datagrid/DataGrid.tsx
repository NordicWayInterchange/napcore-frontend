import React from "react";
import { DataGrid as MuiDataGrid, DataGridProps } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { GridSortDirection } from "@mui/x-data-grid/models/gridSortModel";

interface Props extends DataGridProps {
  sort: { field: string; sort: GridSortDirection };
}

export default function DataGrid(props: Props) {
  const { sort } = props;
  return (
    <Box sx={{ width: "100%" }}>
      <StyledDataGrid
        {...props}
        autoHeight
        disableRowSelectionOnClick={true}
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          borderRadius: 1,
          "& .MuiDataGrid-columnHeaderInner": {
            borderBottom: "2px solid #dd7100", // Border on the header
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Bold text in the column header
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [sort],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
}

const StyledDataGrid = styled(MuiDataGrid)(({}) => ({
  "& .MuiDataGrid-columnHeaderInner": {
    borderBottom: "2px solid #dd7100", // Apply border to the inner column header
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold", // Apply bold title style
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },
}));

