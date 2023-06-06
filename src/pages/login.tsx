import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";
import logo from "@/../public/napcore-logo.png";
import { Button, Card, SvgIcon, Typography } from "@mui/material";
import * as React from "react";
import Google from "@/../public/icons8-google.svg";

export default function login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        //alignItems: "center",
        padding: 5,
        gap: 3,
        width: "45vh",
      }}
    >
      <Image
        style={{ alignSelf: "center" }}
        src={logo}
        alt="Nordic Way logo"
        width={200}
      />

      <Typography variant="h6">Welcome to Napcore</Typography>
      <Typography variant="body1">
        Napcore is restricted to users in the organization. If you want access,
        you can contact christian.berg.skjetne@vegvesen.no.
      </Typography>

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            startIcon={
              <SvgIcon
                sx={{
                  width: "inherit",
                  height: "inherit",
                }}
                component={Google}
                inheritViewBox
              />
            }
            variant="outlined"
            fullWidth
            sx={{ borderColor: "gray", color: "black", textTransform: "none" }}
            onClick={() => signIn(provider.id)}
          >
            <Typography>Sign in with {provider.name}</Typography>
          </Button>
        </div>
      ))}
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
