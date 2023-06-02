import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

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
    <>
      <Typography variant="h4">Profile settings</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Box display={"inline-block"}>
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "row",
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
          <List>
            <ListItem>
              <ListItemText primary={"Name"} secondary={session.user?.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary={"Email"} secondary={session.user?.email} />
            </ListItem>
          </List>
        </Card>
        <br /> {/*TODO: remove*/}
        <Typography variant="h5">Certificate</Typography>
        <FormControl>
          <TextField value={""} label={"Country Code"} margin="normal" />
          <TextField value={""} label={"Organisation name"} margin="normal" />
          <Button variant={"contained"}>Generate Certificate</Button>
        </FormControl>
      </Box>
    </>
  );
}
