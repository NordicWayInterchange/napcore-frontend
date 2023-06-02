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
import ButtonComponent from "../shared/Button";
import { deleteSubscriptions } from "@/lib/internalFetchers";
import { ExtendedSubscription } from "@/types/subscription";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";

type Props = {
  privateKey: string;
  // TODO: certificate
  open: boolean;
  handleDialog: (close: boolean) => void;
};

export default function CertificateDialog(props: Props) {
  const { privateKey, open, handleDialog } = props;

  const handleClose = () => {
    handleDialog(false);
  };

  const handleDeletion = async (name: string, subscriptionId: string) => {
    const data = await deleteSubscriptions(name, subscriptionId);
    console.log(data.json());
    handleDialog(false);
  };

  const copyPrivateKey = (value: string) => {
    // TODO: Promise retured are ignored
    navigator.clipboard.writeText(value);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Certificate generated</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The certificate was successfully created.
          </DialogContentText>
          <DialogContentText>
            Please copy your private key and download your .cert file.
          </DialogContentText>
          <FormControl fullWidth>
            <TextField
              type="password"
              contentEditable={false}
              value={privateKey}
              label={"Private key"}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => copyPrivateKey(privateKey)}
                      edge="end"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            color="greenDark"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={() => console.log("Downloaded cert")}
          >
            Download certificate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
