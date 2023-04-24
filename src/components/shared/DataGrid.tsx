import React from "react";
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | ExtendedCapability[] | [];
  handleEvent?: GridEventListener<"rowClick">;
};

export default function DataGrid(props: Props) {
  const { handleEvent, data, tableHeaders } = props;

  return (
    <>
      <MuiDataGrid
        onRowClick={handleEvent}
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
