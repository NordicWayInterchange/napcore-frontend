import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import React from "react";
import { useMatchingCapabilities } from "@/hooks/useMatchingCapabilities";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { useSession } from "next-auth/react";
import { Box } from "@mui/system";
import { CustomEmptyOverlayMatching } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Subheading from "@/components/shared/display/typography/Subheading";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import SelectorBuilder from "@/components/shared/forms/SelectorBuilder";
import { GridEventListener } from "@mui/x-data-grid";
import { BreadcrumbNavigation } from "@/components/shared/actions/BreadcrumbNavigation";
import { NewFormDataGrid } from "@/components/shared/datagrid/GridColumns/NewFormDatagrid";

const NewSubscription = () => {
  const { data: session } = useSession();
  const [selector, setSelector] = useState<string>(" ");
  const [publicationIdRow, setPublicationIdRow] = useState<string>("");
  const [messageTypeRow, setMessageTypeRow] = useState<string[]>([]);
  const [originatingCountryRow, setOriginatingCountryRow] = useState<string[]>([]);
  const [quadTreeRow, setQuadTreeRow] = useState<string[]>([]);

  const { data, isLoading, remove } = useMatchingCapabilities(
    session?.user.commonName as string,
    selector
  );

  const handleChange = (selector: string) => {
    setSelector(selector);
    remove();
  };

  const handleOnRowClick: GridEventListener<'rowClick'> = (params) => {
    setPublicationIdRow(params.row.publicationId);
    setMessageTypeRow([params.row.messageType]);
    setOriginatingCountryRow([params.row.originatingCountry]);
    setQuadTreeRow(params.row.quadTree);
  };

  return (
    <Box flex={1}>
      <Mainheading>Create subscription</Mainheading>
      <Subheading>
        Create a subscription with the form, or specify your own selector in
        advanced mode.
      </Subheading>
      <Divider sx={{ marginY: 1 }} />
      <BreadcrumbNavigation text="Subscriptions" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <SelectorBuilder
            matchingElements={data || []}
            selectorCallback={handleChange}
            publicationIdRow={publicationIdRow}
            messageTypeRow={messageTypeRow}
            originatingCountryRow={originatingCountryRow}
            quadTreeRow={quadTreeRow}
            label="Subscription"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <DataGrid
            columns={NewFormDataGrid}
            rows={data || []}
            onRowClick={handleOnRowClick}
            loading={isLoading}
            getRowId={(row) => row.publicationId}
            sort={{ field: "lastUpdatedTimestamp", sort: "desc" }}
            slots={{
              noRowsOverlay: CustomEmptyOverlayMatching
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewSubscription;
