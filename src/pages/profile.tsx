import { Box, Button, Card, Typography } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const { data: session } = useSession();

  const handleClick = () => {
    signOut();
  };

  if (!session) {
    return (
      <Button variant="contained" onClick={handleClick}>
        Sign out
      </Button>
    );
  }

  return (
    <Box display={"inline-block"}>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          p: 3,
        }}
      >
        <Image
          src={session.user?.image as string}
          alt="Profile Image"
          width={200}
          height={200}
        />
        <Typography variant="body1">{session.user?.name}</Typography>
        <Typography variant="body1">{session.user?.email}</Typography>
        <Button variant="contained" onClick={handleClick}>
          Sign out
        </Button>
      </Card>
    </Box>
  );
}
