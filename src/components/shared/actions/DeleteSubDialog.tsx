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
import {
  deleteDeliveries,
  deletePrivateChannel,
  deletePrivateChannelPeers,
  deleteSubscriptions,
  deleteUserCapability
} from "@/lib/fetchers/internalFetchers";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { useState } from "react";
import { IFeedback } from "@/interface/IFeedback";

type Props = {
  actorCommonName: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
  itemId: string;
  handleDeletedItem: (deleted: boolean) => void;
  text: string;
};

async function deleteArtifacts(artifactType: string, name: string, itemId: string, peerId: string) {
  return await (artifactType === "Delivery" ? deleteDeliveries(name, itemId) :
    artifactType === "Subscription" ? deleteSubscriptions(name, itemId) :
      artifactType === "Private channel" ? deletePrivateChannel(name, itemId) :
      artifactType === "Peer" ? deletePrivateChannelPeers(name, itemId, peerId) :
        deleteUserCapability(name, itemId));
}

export default function DeleteSubDialog(props: Props) {
  const { actorCommonName, open, handleDialog, itemId, handleDeletedItem, text } = props;

  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const handleDeletion = async (name: string, itemId: string, text: string, peerId: string) => {
    const response = await deleteArtifacts(text, name, itemId, peerId);
    handleDialog(false);

    if (response.ok) {
      handleDeletedItem(true);
      setFeedback({
        feedback: true,
        message: `${text} successfully deleted`,
        severity: "success",
      });
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || `${text} could not be deleted, try again!`;

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning",
      });
    }
  };

  const handleSnackClose = (
    _event?: React.SyntheticEvent | Event,
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
        <DialogTitle>Remove {text}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this {text}?
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
            onClick={() => handleDeletion(actorCommonName, itemId, text, "")}
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
