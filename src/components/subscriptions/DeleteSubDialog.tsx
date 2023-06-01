import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ButtonComponent from "../shared/Button";
import { deleteSubscriptions } from "@/lib/internalFetchers";
import { ExtendedSubscription } from "@/types/subscription";

type Props = {
  actorCommonName: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
  subscription: ExtendedSubscription;
};

export default function DeleteSubDialog(props: Props) {
  const { actorCommonName, open, handleDialog, subscription } = props;

  const handleClose = () => {
    handleDialog(false);
  };

  const handleDeletion = async (name: string, subscriptionId: string) => {
    const data = await deleteSubscriptions(name, subscriptionId);
    console.log(data.json());
    handleDialog(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
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
            onClick={handleClose}
            sx={{ borderRadius: 100, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="depricatedRed"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={() => {
              /*TODO: fix promise*/
              handleDeletion(actorCommonName, subscription.id);
            }}
          >
            Yes, remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
