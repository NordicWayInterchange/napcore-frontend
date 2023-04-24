import React, { Dispatch, SetStateAction } from "react";
import {
  DataGrid as MuiDataGrid,
  GridColDef,
  GridColumnHeaderSeparator,
  GridEventListener,
} from "@mui/x-data-grid";
import { ExtendedSubscription } from "@/types/subscription";
import { ExtendedCapability } from "@/types/capability";
import { Box } from "@mui/material";

type Props = {
  tableHeaders: GridColDef[];
  data: ExtendedSubscription[] | ExtendedCapability[] | [];
  setState?: Dispatch<SetStateAction<ExtendedCapability | undefined>>;
};

export default function DataGrid(props: Props) {
  const { setState, data, tableHeaders } = props;

  const handleEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
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
