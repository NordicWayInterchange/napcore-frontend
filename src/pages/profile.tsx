import {
  Avatar,
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
import React, { useState } from "react";
import { createPKCS10 } from "@/components/csr/pkcs10Generator";
import { DeleteSubDialog } from "@/components/details";
import { ExtendedSubscription } from "@/types/subscription";
import CertificateDialog from "@/components/csr/CertificateDialog";

interface ICsr {
  csr: string;
  privateKey: string;
}

export default function Profile() {
  const { data: session } = useSession();
  const [csr, setCsr] = useState<ICsr>();
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    createPKCS10({
      commonName: "Henrik",
      organization: "Bouvet Norge AS",
      country: "NO",
    }).then((value) => {
      // @ts-ignore
      setCsr({ csr: value.csr, privateKey: value.privateKey });
      setOpen(true);
    });
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
  };

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
          <Avatar sx={{ width: 200, height: 200 }}>
            <Image
              src={session?.user?.image as string}
              alt="Profile Image"
              width={200}
              height={200}
            />
          </Avatar>
          <List>
            <ListItem>
              <ListItemText primary={"Name"} secondary={session?.user?.name} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={"Email"}
                secondary={session?.user?.email}
              />
            </ListItem>
          </List>
        </Card>
        <br /> {/*TODO: remove*/}
        <Typography variant="h5">Certificate</Typography>
        <FormControl sx={{ width: 300 }}>
          <TextField
            sx={{ backgroundColor: "white" }}
            value={""}
            label={"Country Code"}
            margin="normal"
          />
          <TextField
            sx={{ backgroundColor: "white" }}
            value={""}
            label={"Organisation name"}
            margin="normal"
          />
          <Button onClick={handleClick} variant={"contained"}>
            Generate Certificate
          </Button>
        </FormControl>
      </Box>
      <CertificateDialog
        privateKey={csr?.privateKey as string}
        handleDialog={handleClickClose}
        open={open}
      />
    </>
  );
}
