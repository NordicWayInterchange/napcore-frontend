import React, { Dispatch, SetStateAction } from "react";
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridEventListener,
  GridRowParams,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | ExtendedCapability[] | [];
  setState?: Dispatch<
    SetStateAction<ExtendedCapability | ExtendedSubscription | undefined>
  >;
};

export default function DataGrid(props: Props) {
  const { setState, data, tableHeaders } = props;

  const handleEvent: GridEventListener<"rowClick"> = (
    params: GridRowParams<any>
  ) => {
    setState(params.row);
  };

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
