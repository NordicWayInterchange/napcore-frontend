import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { deleteSubscriptions } from "@/lib/internalFetchers";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { useState } from "react";

type Props = {
  actorCommonName: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
  subscriptionId: string;
};

export default function DeleteSubDialog(props: Props) {
  const { actorCommonName, open, handleDialog, subscriptionId } = props;

  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const handleDeletion = async (name: string, subscriptionId: string) => {
    const data = await deleteSubscriptions(name, subscriptionId);
    console.log(data.json());
    handleDialog(false);
    setOpenSnack(true);
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleDialog(false)}>
        <DialogTitle>Remove subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this subscription?
          </DialogContentText>
          <DialogContentText>This action can not be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => handleDialog(false)}
            sx={{ borderRadius: 100, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="depricatedLight"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={() => handleDeletion(actorCommonName, subscriptionId)}
            disableElevation
          >
            Yes, remove
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        message={"Your subscription was successfully removed"}
        severity={"success"}
        open={openSnack}
        handleClose={handleSnackClose}
      />
    </>
  );
}
