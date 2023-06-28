import { useState } from "react";
import SelectorBuilder from "@/components/subscriptions/SelectorBuilder";
import { Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { useSession } from "next-auth/react";
import { NewSubscriptionDatagrid } from "@/components/shared/datagrid/GridColumns/NewSubscriptionDatagrid";
import { Box } from "@mui/system";

const NewSubscription = () => {
  const { data: session } = useSession();
  const [selector, setSelector] = useState<string>(" ");

  const { data, isLoading, remove } = useMatchingCapabilities(
    session?.user?.email as string,
    selector
  );

  const handleChange = (selector: string) => {
    setSelector(selector);
    remove();
  };

  return (
    <Box flex={1}>
      <Typography variant="h4">Create subscription</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <SelectorBuilder version="version" selectorCallback={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <DataGrid
            columns={NewSubscriptionDatagrid}
            rows={data || []}
            loading={isLoading}
            getRowId={(row) => row.publicationId}
            sortModel={[{ field: "publicationId", sort: "desc" }]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
