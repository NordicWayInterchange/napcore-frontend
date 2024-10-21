import { Divider, Grid } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import Subheading from "@/components/shared/display/typography/Subheading";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import { BreadcrumbNavigation } from "@/components/shared/actions/BreadcrumbNavigation";
import PrivateChannelsSelectorBuilder from "@/components/privateChannels/PrivateChannelsSelectorBuilder";
const NewUserCapability = () => {

  return (
    <Box flex={1}>
      <Mainheading>Add private channel</Mainheading>
      <Subheading>
        Add a private channel with the form.
      </Subheading>
      <Divider sx={{ marginY: 1 }} />
      <BreadcrumbNavigation text="Private channels" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <PrivateChannelsSelectorBuilder />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewUserCapability;
