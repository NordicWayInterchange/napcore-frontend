import React from "react";
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";
import { styled } from "@mui/material/styles";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | ExtendedCapability[] | [];
  handleEvent?: GridEventListener<"rowClick">;
  disableRowSelectionOnClick?: boolean;
};

export default function DataGrid(props: Props) {
  const {
    handleEvent,
    data,
    tableHeaders,
    disableRowSelectionOnClick = false,
  } = props;

  return (
    <>
      <StyledDataGrid
        onRowClick={handleEvent}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        autoHeight
        rows={data}
        columns={tableHeaders}
        sx={{ backgroundColor: "white" }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
      />
    </>
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
