import { Dialog, DialogContent } from "@mui/material";
import Map from "./Map";

type Props = {
  quadtreeCallback?: (value: string[]) => void;
  quadtree: string[];
  open: boolean;
  onClose: () => void;
  interactive?: boolean;
};

export default function MapDialog(props: Props) {
  const {
    onClose,
    open,
    quadtreeCallback,
    quadtree,
    interactive = true,
  } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog maxWidth={"xl"} open={open} onClose={handleClose}>
      {/* <DialogTitle>Are you sure?</DialogTitle> */}
      <DialogContent>
        <Map
          quadtree={quadtree}
          quadtreeCallback={quadtreeCallback}
          interactive={interactive}
        />
      </DialogContent>
      {/* <DialogActions>
        <ButtonComponent color="inherit" text="No" onClick={handleClose} />
      </DialogActions> */}
    </Dialog>
  );
}
