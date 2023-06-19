import { IconButton, InputAdornment } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useState } from "react";
import Snackbar from "@/components/shared/feedback/Snackbar";

type Props = {
  value: string;
};

export const ContentCopy = (props: Props) => {
  const { value } = props;

  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const handleIconClick = () => {
    writeToClipboard(value);
    setOpenSnack(true);
  };

  return (
    <>
      <InputAdornment position="end">
        <IconButton onClick={handleIconClick} edge="end">
          <ContentCopyIcon />
        </IconButton>
      </InputAdornment>
      <Snackbar
        message={"Copied"}
        severity={"success"}
        open={openSnack}
        handleClose={handleSnackClose}
      />
    </>
  );
};

const writeToClipboard = (value: string) => {
  // TODO: Promise retured are ignored
  navigator.clipboard.writeText(value);
};
