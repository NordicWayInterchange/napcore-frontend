import { Divider, Grid } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import Subheading from "@/components/shared/display/typography/Subheading";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import UserCapabilitiesCreator from "@/components/userCapabilities/UserCapabilitiesCreator";
import { BreadcrumbNavigation } from "@/components/shared/actions/BreadcrumbNavigation";
const NewUserCapability = () => {

  return (
    <Box flex={1}>
      <Mainheading>Add my capability</Mainheading>
      <Subheading>
        Add a user capability with the form.
      </Subheading>
      <Divider sx={{ marginY: 1 }} />
      <BreadcrumbNavigation text="My capabilities" />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <UserCapabilitiesCreator />
        </Grid>
        </Grid>
    </Box>
  );
};

export default NewUserCapability;
