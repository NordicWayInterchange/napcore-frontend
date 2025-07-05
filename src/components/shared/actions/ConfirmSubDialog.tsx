import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { useState } from "react";
import { IFeedback } from "@/interface/IFeedback";
import { StyledButton } from "@/components/shared/styles/StyledSelectorBuilder";

type Props = {
  actorCommonName: string;
  open: boolean;
  handleDialog: (close: boolean) => void;
  itemId: string;
  shardCount: string;
  handleMoreClose: () => void;
};

export default function ConfirmSubDialog(props: Props) {
  const {open, handleDialog, shardCount, handleMoreClose } = props;

  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const handleDeletion = async (name: string, itemId: string, text: string) => {
    handleDialog(false);
    handleMoreClose();
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
        <DialogTitle>Subscription Acknowledgment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please note that this capability contains {shardCount} shards. Do you still want to subscribe?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <StyledButton
            variant="outlined"
            color="inherit"
            onClick={() => handleDialog(false)}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            color="greenLight"
            disableElevation
          >
            Yes, subscribe
          </StyledButton>
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
