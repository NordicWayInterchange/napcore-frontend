import * as React from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider, IconButton, Tooltip
} from "@mui/material";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { useState } from "react";
import { IFeedback } from "@/interface/IFeedback";
import { StyledButton } from "@/components/shared/styles/StyledSelectorBuilder";
import Link from "next/link";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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
            Please note that this capability contains {shardCount} shards. Do
            you want to subscribe?
            <Tooltip
              title={
                <span style={{ fontSize: ".88rem"}}>
                  A sharded capability has defined shardCount greater than one
                  and a sharded subscription has defined shardId in the selector
                </span>
              }
              arrow
              placement="right"
            >
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" sx={{ mt: -1 }} />
              </IconButton>
            </Tooltip>
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
          <StyledButton variant="contained" color="greenLight" disableElevation>
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
