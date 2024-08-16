import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import React from "react";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { useSession } from "next-auth/react";
import { NewSubscriptionDatagrid } from "@/components/shared/datagrid/GridColumns/NewSubscriptionDatagrid";
import { Box } from "@mui/system";
import { CustomEmptyOverlayMatching } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Subheading from "@/components/shared/display/typography/Subheading";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import { useMatchingDeliveries } from "@/hooks/useMatchingDeliveries";
import SelectorBuilder from "@/components/shared/forms/SelectorBuilder";

const NewDelivery = () => {
  const { data: session } = useSession();
  const [selector, setSelector] = useState<string>(" ");

  const { data, isLoading, remove } = useMatchingDeliveries(
    session?.user.commonName as string,
    selector
  );

  const handleChange = (selector: string) => {
    setSelector(selector);
    remove();
  };

  return (
    <Box flex={1}>
      <Mainheading>Create Delivery</Mainheading>
      <Subheading>
        Create a delivery with the form, or specify your own selector in
        advanced mode.
      </Subheading>
      <Divider sx={{ marginY: 1 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <SelectorBuilder
            matchingElements={data || []}
            selectorCallback={handleChange}
            label="Delivery"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <DataGrid
            columns={NewSubscriptionDatagrid}
            rows={data || []}
            loading={isLoading}
            getRowId={(row) => row.publicationId}
            sort={{ field: "publicationId", sort: "desc" }}
            slots={{
              noRowsOverlay: CustomEmptyOverlayMatching,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewDelivery;
