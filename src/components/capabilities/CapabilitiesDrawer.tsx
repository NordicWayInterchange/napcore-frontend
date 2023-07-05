import {
  Box,
  Button,
  Card,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ExtendedCapability } from "@/types/capability";
import { createSubscription } from "@/lib/fetchers/internalFetchers";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { styled } from "@mui/material/styles";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import MapDialog from "@/components/map/MapDialog";

const width = 600;

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

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Subscription successfully created",
        severity: "success",
      });
    } else {
      setFeedback({
        feedback: true,
        message: "Subscription could not be created, try again!",
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
            <ListItem sx={{ justifyContent: "flex-end" }}>
              <IconButton onClick={handleMoreClose}>
                <CloseIcon />
              </IconButton>
            </ListItem>
            <ListItem>
              <Typography>Capability details</Typography>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Publisher</Typography>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={capability.publisherId}
                    label={"Publisher ID"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.publisherId} />
                      ),
                    }}
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.publicationId}
                    label={"Publication ID"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.publicationId} />
                      ),
                    }}
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.originatingCountry}
                    label={"Originating Country"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.originatingCountry} />
                      ),
                    }}
                  />
                </FormControl>
              </StyledCard>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Message</Typography>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={capability.messageType}
                    label={"Message Type"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.messageType} />
                      ),
                    }}
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.protocolVersion}
                    label={"Protocol Version"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.protocolVersion} />
                      ),
                    }}
                  />
                  {capability.causeCodesDictionary && (
                    <FormControl margin="normal">
                      <InputLabel>Cause codes</InputLabel>
                      <Select
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        label={"Cause codes"}
                        multiple
                        defaultValue={capability.causeCodesDictionary.map(
                          (cause) => {
                            return cause["value"];
                          }
                        )}
                      >
                        {capability.causeCodesDictionary.map((cause, index) => {
                          return (
                            <MenuItem key={index} value={cause.value}>
                              {cause.value}: {cause.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </FormControl>
              </StyledCard>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Quadtree</Typography>
                <FormControl
                  fullWidth
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    contentEditable={false}
                    value={capability.quadTree}
                    label={"Hash"}
                    margin="normal"
                    sx={{
                      flexGrow: 1,
                      marginRight: 1,
                    }}
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.quadTree.toString()} />
                      ),
                    }}
                  />
                  <StyledButton
                    color="buttonThemeColor"
                    variant="outlined"
                    onClick={() => setOpenMap(true)}
                  >
                    Show map
                  </StyledButton>
                </FormControl>
              </StyledCard>
            </ListItem>

            <ListItem>
              <Button
                sx={{ borderRadius: 100, textTransform: "none" }}
                variant={"contained"}
                color={"buttonThemeColor"}
                disableElevation
                onClick={() =>
                  saveSubscription(session?.user?.email as string, selector)
                }
              >
                Subscribe
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
      <MapDialog
        open={openMap}
        onClose={handleClose}
        quadtree={capability.quadTree}
        interactive={false}
      />
    </>
  );
};

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

const StyledButton = styled(Button)(({}) => ({
  width: "150px",
  textTransform: "none",
  borderRadius: 100,
}));

export default CapabilitiesDrawer;
