import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Image from "next/image";
import logo from "@/../public/nordic-way-logo.png";
import { Button, Card, Typography } from "@mui/material";

export default function login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 8,
        gap: 8,
      }}
    >
      <Image src={logo} alt="Nordic Way logo" width={200} />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button variant="contained" onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </Card>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/subscriptions" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
