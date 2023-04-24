import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { deleteSubscription } from "@/lib/fetchers";
import ButtonComponent from "../shared/Button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  actorCommonName: string;
  subscriptionId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AlertDialog(props: Props) {
  const { actorCommonName, subscriptionId, setOpen, open } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeletion = async (name: string, subscriptionId: string) => {
    const data = await deleteSubscription(name, subscriptionId);
    console.log(data.json());
    setOpen(false);
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
