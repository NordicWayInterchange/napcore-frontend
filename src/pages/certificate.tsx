import { Box, Divider } from "@mui/material";
import React from "react";
import { CertificateForm } from "@/components/profile/CertificateForm";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";

export default function Certificate() {
  return (
    <>
      <Mainheading>Certificate</Mainheading>
      {/*TODO: Change text*/}
      <Subheading>
        Your profile and information and create a new certificate with the form.
      </Subheading>
      <Divider sx={{ marginY: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <CertificateForm />
      </Box>
    </>
  );
}
