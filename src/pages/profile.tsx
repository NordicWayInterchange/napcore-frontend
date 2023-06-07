import {
  Avatar,
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { CertificateForm } from "@/components/profile/CertificateForm";
import { MainHeading } from "@/components/shared/display/heading/MainHeading";
import { ProfileCard } from "@/components/profile/ProfileCard";

export default function Profile() {
  return (
    <>
      <MainHeading heading={"Profile Settings"} />
      <Divider sx={{ marginY: 3 }} />
      <ProfileCard />
      <CertificateForm />
    </>
  );
}
