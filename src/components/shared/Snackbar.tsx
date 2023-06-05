import React, { useState } from "react";
import {
  Alert,
  AlertColor,
  AlertProps,
  Snackbar as MuiSnackbar,
  SnackbarProps,
  SnackbarOrigin,
} from "@mui/material";

interface Props extends SnackbarProps {
  severity: AlertColor;
  open: boolean;

  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
}

const Snackbar = (props: Props) => {
  const { open, handleClose, severity, message } = props;
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
