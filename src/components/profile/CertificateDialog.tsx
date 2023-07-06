import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { CertificateSignResponse } from "@/types/napcore/certificate";

type Props = {
  privateKey: string;
  chain: CertificateSignResponse;
  open: boolean;
  handleDialog: (close: boolean) => void;
};

export default function CertificateDialog(props: Props) {
  const { privateKey, open, handleDialog, chain } = props;

  const handleClose = () => {
    handleDialog(false);
  };

  /*TODO: Theme colors*/

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Certificate generated</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginY: 1 }}>
            The certificate was successfully created.
          </DialogContentText>
          <DialogContentText sx={{ marginY: 1 }}>
            Please download your private key and .cert file before closing this
            window.
          </DialogContentText>
          <FormControl fullWidth>
            <TextField
              contentEditable={false}
              value={privateKey}
              margin="normal"
              label={"Private key"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        privateKey
                      )}`}
                      download={"privateKey.txt"}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: 2,
          }}
        >
          <Button
            variant="text"
            color="greenDark"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={handleClose}
            disableElevation
          >
            Close
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            color="greenDark"
            sx={{ borderRadius: 100, textTransform: "none" }}
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(chain)
            )}`}
            download={"encodedCertChain.json"}
            disableElevation
          >
            Download certificate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
