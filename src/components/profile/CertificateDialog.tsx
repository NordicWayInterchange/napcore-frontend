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
import { downloadKey } from "@/lib/downloadTxt";

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
                      onClick={() => downloadKey(privateKey)}
                      edge="end"
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
            onClick={() => console.log("Close")}
            disableElevation
          >
            Close
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            color="greenDark"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={() => console.log("Downloaded cert")}
            disableElevation
          >
            Download certificate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
