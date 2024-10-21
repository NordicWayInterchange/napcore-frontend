import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import { createPrivateChannel } from "@/lib/fetchers/internalFetchers";
import { IFeedback } from "@/interface/IFeedback";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { PrivateChannel } from "@/types/napcore/privateChannel";

const width = 600;

type Props = {
  privateChannel: PrivateChannel;
  open: boolean;
  handleMoreClose: () => void;
  handleDeletedItem: (deleted: boolean) => void;
};

const PrivateChannelsDrawer = ({ privateChannel, open, handleMoreClose, handleDeletedItem }: Props) => {
  const { data: session } = useSession();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
  };

  const handleClose = () => {
    setOpenMap(false);
  };

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  };

  const savePrivateChannel = async (name: string) => {
    const response = await createPrivateChannel(name);

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: `Delivery successfully created`,
        severity: "success",
      });
    } else {
      setFeedback({
        feedback: true,
        message: `Delivery could not be created, try again!`,
        severity: "warning",
      });
    }
  };

  return (
    <>
      <Drawer
        sx={{
          width: width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: width,
            boxSizing: "border-box",
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#F9F9F9",
          },
        }}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => handleMoreClose()}
      >
        <Toolbar />
        <Box sx={{ padding: 1, width: 1 }}>
          <List>
            <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                sx={{ borderRadius: 100, textTransform: "none", width: 150}}
                variant={"contained"}
                color={"buttonThemeColor"}
                disableElevation
                onClick={() =>
                  savePrivateChannel(session?.user.commonName as string)
                }
              >
                Deliver
              </Button>
              <Button
                sx={{
                  borderRadius: 100,
                  textTransform: "none",
                }}
                variant={"contained"}
                color={"redLight"}
                onClick={() => setDialogOpen(true)}
                disableElevation
              >
                Remove private channel
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {feedback.feedback && (
        <Snackbar
          message={feedback.message}
          severity={feedback.severity}
          open={feedback.feedback}
          handleClose={handleSnackClose}
        />
      )}
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={session?.user.commonName as string}
        itemId={privateChannel.id as string}
        handleDialog={handleClickClose}
        handleDeletedItem={handleDeletedItem}
        text="PrivateChannel"
      />
    </>
  );
};

export default PrivateChannelsDrawer;
