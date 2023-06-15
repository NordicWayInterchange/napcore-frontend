import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Map from "./Map";
import React, { useEffect, useState } from "react";

type Props = {
  quadtreeCallback?: (value: string[]) => void;
  quadtree: string[];
  open: boolean;
  interactive?: boolean;
  onClose: () => void;
};

export default function MapDialog(props: Props) {
  const {
    onClose,
    open,
    quadtreeCallback,
    quadtree,
    interactive = true,
  } = props;

  const [discard, setDiscard] = useState(false);

  const handleDiscard = () => {
    quadtreeCallback ? quadtreeCallback([]) : quadtreeCallback;
    setDiscard((current) => !current);
  };

  /*
  Wait for handleDiscard before closing dialog
  */
  useEffect(() => {
    onClose();
  }, [discard]);

  return (
    <Dialog fullWidth maxWidth={"xl"} open={open} onClose={onClose}>
      <DialogTitle>Quadtree</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Select a quadtree by clicking on tiles. You can remove a tile by
          selecting it again, discard all entered tiles or save tiles to the
          form.
        </DialogContentText>
        <Map
          quadtree={quadtree}
          quadtreeCallback={quadtreeCallback}
          interactive={interactive}
        />
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={handleDiscard}>
          Discard
        </Button>
        <Button variant={"contained"} onClick={onClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
