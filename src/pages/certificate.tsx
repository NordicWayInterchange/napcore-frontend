import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Typography,
} from "@mui/material";
import { createPKCS10 } from "@/components/csr/pkcs10Generator";
import { TextArea, TextField } from "@/components/shared";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ICsr {
  csr: string;
  privateKey: string;
}

export default function Certificate() {
  const [open, setOpen] = useState<boolean>(false);
  const [csr, setCsr] = useState<ICsr>();

  const handleClick = () => {
    createPKCS10({
      enrollmentID: "user1",
      organizationUnit: "Marketing",
      organization: "Farmer Market",
      state: "M",
      country: "V",
    }).then((value) => {
      // @ts-ignore
      setCsr({ csr: value.csr, privateKey: value.privateKey });
    });
  };

  const copyPrivateKey = () => {
    setOpen(true);
    // TODO: Promise retured are ignored
    navigator.clipboard.writeText(csr?.privateKey as string);
  };

  return (
    <>
      <Typography variant="h4">Certificate</Typography>
      <Divider sx={{ marginY: 3 }} />
      <Button variant={"contained"} onClick={handleClick}>
        Generate certificate
      </Button>
      {csr && <TextArea rows={10} value={csr?.csr} />}
      {csr && (
        <TextField
          contentEditable={false}
          value={csr?.privateKey}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={copyPrivateKey} edge="end" color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
}
