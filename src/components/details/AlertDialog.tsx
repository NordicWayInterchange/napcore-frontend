import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ButtonComponent from "../shared/Button";
import { deleteSubscriptions } from "@/lib/internalFetchers";

type Props = {
  actorCommonName: string;
  subscriptionId: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
};

export default function AlertDialog(props: Props) {
  const { actorCommonName, subscriptionId, open, handleDialog } = props;

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
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible and will delete the subscription with
            ID: {subscriptionId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonComponent color="inherit" text="No" onClick={handleClose} />
          <ButtonComponent
            color="error"
            text="Yes"
            onClick={() => {
              handleDeletion(actorCommonName, subscriptionId);
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
