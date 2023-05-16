import React, { useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useNetworkCapabilities } from "@/hooks/useNetworkCapabilities";
import { GridColDef, GridEventListener, GridRowParams } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/DataGrid";
import { dataGridTemplate } from "@/components/shared/DataGridTemplate";
import { CapabilityDetails } from "@/components/details";
import { useSession } from "next-auth/react";

const tableHeaders: GridColDef[] = [
  { ...dataGridTemplate, field: "publisherId", headerName: "Publisher ID" },
  {
    ...dataGridTemplate,
    field: "messageType",
    headerName: "Message Type",
  },
  {
    ...dataGridTemplate,
    field: "protocolVersion",
    headerName: "Protocol Version",
  },
  {
    ...dataGridTemplate,
    field: "originatingCountry",
    headerName: "Originating Country",
  },
];

export default function NetworkCapabilities() {
  const { data: session } = useSession();

  // TODO: Common name needs a prefix
  const { data, isLoading, isFetching } = useNetworkCapabilities(
    session?.user?.email as string
  );

  const [extendedCapability, setExtendedCapability] = useState();

  const handleEvent: GridEventListener<"rowClick"> = (
    params: GridRowParams<any>
  ) => {
    setExtendedCapability(params.row);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4">Network Capabilities</Typography>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}>
          <DataGrid
            handleEvent={handleEvent}
            tableHeaders={tableHeaders}
            data={data || []}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <CapabilityDetails extendedCapability={extendedCapability} />
        </Box>
      </Box>
    </>
  );
}
