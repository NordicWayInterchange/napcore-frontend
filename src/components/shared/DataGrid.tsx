import React from "react";
import {
  DataGrid as MuiDataGrid,
  DataGridProps,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";

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
      <MuiDataGrid
        onRowClick={handleEvent}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
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
    </>
  );
}
