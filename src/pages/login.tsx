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
        //alignItems: "center",
        padding: 5,
        gap: 3,
        width: "35vh",
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
        you can contact [name]
      </Typography>

      {Object.values(providers).map((provider) => (
        <div style={{ alignSelf: "center" }} key={provider.name}>
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
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
