import { Divider, Grid } from "@mui/material";
import React from "react";
import { useSession } from "next-auth/react";
import { Box } from "@mui/system";
import Subheading from "@/components/shared/display/typography/Subheading";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import UserCapabilitiesSelectorBuilder from "@/components/userCapabilities/UserCapabilitiesSelectorBuilder";
import { usePublicationIds } from "@/hooks/usePublicationIds";

const NewUserCapability = () => {
  const { data: session } = useSession();
  const { data } = usePublicationIds(
    session?.user.commonName as string,
  );

  return (
    <Box flex={1}>
      <Mainheading>Add my capability</Mainheading>
      <Subheading>
        Add a user capability with the form.
      </Subheading>
      <Divider sx={{ marginY: 3 }} />

        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <UserCapabilitiesSelectorBuilder
            publicationids={data || []}
          />
        </Grid>

    </Box>
  );
};

export default NewUserCapability;
