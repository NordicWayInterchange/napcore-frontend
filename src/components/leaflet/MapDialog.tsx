import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ButtonComponent from "../shared/Button";
import { useState } from "react";
import { deleteSubscriptions } from "@/lib/internalFetchers";
import { MapContainer } from "react-leaflet";
import MapMemo from "./MapMemo";

type Props = {
  quadtreeCallback: (value: string[]) => void;
  quadtree: string[];
  open: boolean;
  onClose: (value: string) => void;
};

export default function MapDialog(props: Props) {
  const { onClose, open, quadtreeCallback, quadtree } = props;

  const handleClose = () => {
    onClose("quadtree");
  };

  return (
    <Dialog maxWidth={"xl"} open={open} onClose={handleClose}>
      {/* <DialogTitle>Are you sure?</DialogTitle> */}
      <DialogContent>
        <MapMemo quadtree={quadtree} quadtreeCallback={quadtreeCallback} />
      </DialogContent>
      {/* <DialogActions>
        <ButtonComponent color="inherit" text="No" onClick={handleClose} />
      </DialogActions> */}
    </Dialog>
  );
}
