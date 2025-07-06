import {
  Box,
  Drawer, FormControl,
  List,
  ListItem, TextField,
  Toolbar, Typography
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedCapability } from "@/types/capability";
import { createSubscription } from "@/lib/fetchers/internalFetchers";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import MapDialog from "@/components/map/MapDialog";
import CapabilityDrawerForm from "@/components/layout/CapabilityDrawerForm";
import { drawerStyle, StyledCard } from "@/components/shared/styles/StyledSelectorBuilder";
import { handleDescription } from "@/lib/handleDescription";
import { StyledButton } from "@/components/shared/styles/StyledSelectorBuilder";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import { ConfirmationNumber } from "@mui/icons-material";
import ConfirmSubDialog from "@/components/shared/actions/ConfirmSubDialog";

type Props = {
  capability: ExtendedCapability;
  open: boolean;
  handleMoreClose: () => void;
};

const CapabilitiesDrawer = ({ capability, open, handleMoreClose }: Props) => {
  const { data: session } = useSession();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const [descriptionError, setDescriptionError] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const selector = `(publicationId = '${capability.publicationId}')`;

  const handleSnackClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
  };

  const handleClose = () => {
    setOpenMap(false);
  };

  const removeDescriptionError = () => {
    setDescription("");
    setDescriptionError(false);
  }

  const saveSubscription = async (name: string, selector: string) => {
    setDialogMessage("true");
    if (capability.shardCount == 1) return;
    if (description.length > 255 ) return ;
    const bodyData = {
      selector: selector,
      description: description
    };

    const response = await createSubscription(name, bodyData);

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Subscription successfully created",
        severity: "success",
      });
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Subscription could not be created, try again!";

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning",
      });
    }
    handleMoreClose();
  };

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  }

  return (
    <>
      <Drawer
        sx={drawerStyle}
        PaperProps={{ sx: { backgroundColor: "#F9F9F9" } }}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => {
          handleMoreClose();
          removeDescriptionError();
        }}
      >
        <Toolbar />
        <Box sx={{ padding: 1, width: 1 }}>
          <List>
            <CapabilityDrawerForm
              capability={capability}
              handleMoreClose={handleMoreClose}
              setOpenMap={setOpenMap}
              removeDescriptionError={removeDescriptionError}
              setDialogOpen={() => {}}
              type="subscription"
            />
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography sx={{ mb: 2 }}>
                  Description for Subscription
                </Typography>
                <div>
                  <FormControl fullWidth>
                    <TextField
                      name="description"
                      label="Enter a description to create subscription"
                      multiline
                      rows={4}
                      onChange={(event) =>
                        handleDescription(
                          event,
                          setDescription,
                          setDescriptionError
                        )
                      }
                      error={descriptionError}
                      helperText={
                        descriptionError
                          ? "Description exceeds maximum length of 255 characters"
                          : ""
                      }
                      fullWidth
                    />
                  </FormControl>
                </div>
              </StyledCard>
            </ListItem>
            <ListItem>
              <StyledButton
                variant={"contained"}
                color={"buttonThemeColor"}
                disableElevation
                onClick={() => {
                  setDialogOpen(true);
                  saveSubscription(
                    session?.user.commonName as string,
                    selector
                  );
                }}
              >
                Subscribe
              </StyledButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {dialogMessage && (
        <ConfirmSubDialog
          open={dialogOpen}
          actorCommonName={session?.user.commonName as string}
          itemId={capability.id as string}
          shardCount={capability.shardCount.toString()}
          handleMoreClose={handleMoreClose}
          handleDialog={handleClickClose}
          selector={selector}
          description={description}
        />
      )}
      {feedback.feedback && (
        <Snackbar
          message={feedback.message}
          severity={feedback.severity}
          open={feedback.feedback}
          handleClose={handleSnackClose}
        />
      )}
      <MapDialog
        open={openMap}
        onClose={handleClose}
        quadtree={capability.quadTree}
        interactive={false}
      />
    </>
  );
};

export default CapabilitiesDrawer;
