import { Box, Divider } from "@mui/material";
import React from "react";
import { CertificateForm } from "@/components/profile/CertificateForm";
import { ProfileCard } from "@/components/profile/ProfileCard";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";

export default function Profile() {
  return (
    <>
      <Mainheading>Profile Settings</Mainheading>
      <Subheading>
        Your profile and information and create a new certificate with the form.
      </Subheading>
      <Divider sx={{ marginY: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <ProfileCard />
        <CertificateForm />
      </Box>
    </>
  );
}
