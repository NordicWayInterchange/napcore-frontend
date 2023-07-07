import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import { deleteSubscriptions } from "@/lib/fetchers/internalFetchers";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { useState } from "react";
import { IFeedback } from "@/interface/IFeedback";

type Props = {
  actorCommonName: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
  subscriptionId: string;
};

export default function DeleteSubDialog(props: Props) {
  const { actorCommonName, open, handleDialog, subscriptionId } = props;

  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const handleDeletion = async (name: string, subscriptionId: string) => {
    const response = await deleteSubscriptions(name, subscriptionId);
    handleDialog(false);

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Subscription successfully deleted",
        severity: "success",
      });
    } else {
      setFeedback({
        feedback: true,
        message: "Subscription could not be deleted, try again!",
        severity: "warning",
      });
    }
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
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
        <Divider />
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
      {feedback.feedback && (
        <Snackbar
          message={feedback.message}
          severity={feedback.severity}
          open={feedback.feedback}
          handleClose={handleSnackClose}
        />
      )}
    </>
  );
}
