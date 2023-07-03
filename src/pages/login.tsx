import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";
import logo from "@/../public/napcore-logo.png";
import { Button, Card, Typography } from "@mui/material";
import * as React from "react";
import { Box } from "@mui/system";

export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 5,
        gap: 3,
        width: "500px",
      }}
    >
      <Box sx={{ alignSelf: "center", mb: 3 }}>
        <Image src={logo} alt="Nordic Way logo" width={150} />
      </Box>
      <Typography variant="body1">
        Access to this application is restricted to authorized users only. If
        you believe you should have access, please send an email to
        christian.berg.skjetne@vegvesen.no requesting access.
      </Typography>

      <Typography variant="body1">
        Sign in will redirect you to our authentication provider.
      </Typography>

      <Button
        variant="contained"
        color={"primary"}
        fullWidth
        sx={{ textTransform: "none" }}
        onClick={() => {
          void signIn("auth0");
        }}
      >
        <Typography>Sign in</Typography>
      </Button>
    </Card>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
