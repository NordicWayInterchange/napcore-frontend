import React from "react";
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | ExtendedCapability[] | [];
  handleEvent?: GridEventListener<"rowClick">;
  disableRowSelectionOnClick?: boolean;
  loading: boolean;
};

export default function DataGrid(props: Props) {
  const {
    handleEvent,
    data,
    tableHeaders,
    disableRowSelectionOnClick = false,
    loading,
  } = props;

  return (
    <>
      <StyledDataGrid
        onRowClick={handleEvent}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        autoHeight
        rows={data}
        columns={tableHeaders}
        loading={loading}
        // slots={{
        //   loadingOverlay: LinearProgress,
        // }}
        sx={{ backgroundColor: "white" }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
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
