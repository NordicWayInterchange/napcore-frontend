import {
  Box,
  Button,
  Card,
  Drawer,
  FormControl,
  List,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedCapability } from "@/types/capability";
import { styled } from "@mui/material/styles";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { useSession } from "next-auth/react";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import MapDialog from "@/components/map/MapDialog";
import CapabilityDrawerForm from "@/components/layout/CapabilityDrawerForm";
import { createDelivery, createSubscription } from "@/lib/fetchers/internalFetchers";
import { IFeedback } from "@/interface/IFeedback";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { router } from "next/client";

const width = 600;

type Props = {
  capability: ExtendedCapability;
  open: boolean;
  handleMoreClose: () => void;
  handleDeletedItem: (deleted: boolean) => void;
};

const UserCapabilitiesDrawer = ({ capability, open, handleMoreClose, handleDeletedItem }: Props) => {
  const { data: session } = useSession();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const selector = `(publicationId = '${capability.publicationId}')`;

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

  const saveDelivery = async (name: string, selector: Object) => {
    const response = await createDelivery(name, selector);

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
            <CapabilityDrawerForm capability={capability} handleMoreClose={handleMoreClose} setOpenMap={setOpenMap}/>
            <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                sx={{ borderRadius: 100, textTransform: "none", width: 150}}
                variant={"contained"}
                color={"buttonThemeColor"}
                disableElevation
                onClick={() =>
                  saveDelivery(session?.user.commonName as string, {selector})
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
                Remove Capability
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
        itemId={capability.id as string}
        handleDialog={handleClickClose}
        handleDeletedItem={handleDeletedItem}
        text="Capability"
      />
      <MapDialog
        open={openMap}
        onClose={handleClose}
        quadtree={capability.quadTree}
        interactive={false}
      />
    </>
  );
};

export default UserCapabilitiesDrawer;
