import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { left } from "@popperjs/core";
import { ExtendedCapability } from "@/types/capability";
import { OriginatingCountry } from "@/types/originatingCountry";
import Map from "@/components/map/Map";
import { createSubscription } from "@/lib/internalFetchers";
import Snackbar from "@/components/shared/Snackbar";

const width = 750;

type Props = {
  capability: ExtendedCapability;
  open: boolean;
  handleMoreClose: () => void;
};

const CapabilitiesDrawer = ({ capability, open, handleMoreClose }: Props) => {
  const [viewMap, setViewMap] = useState(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const selector = `(publicationId = '${capability.publicationId}')`;

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);

    setOpenSnack(true);
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
        //TODO: change to persistent
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
              <Box
                sx={{
                  backgroundColor: "#FFFFFF",
                  padding: 2,
                  borderRadius: 2,
                  width: 1,
                }}
              >
                {/*TODO: add endpoints (currently not existing)*/}
                {/*<Box>{subscription.endpoints[0].host}</Box>
          <Box>{subscription.endpoints[0].source}</Box>
          <Box>{subscription.endpoints[0].port}</Box>*/}
                <Typography>DETAILS</Typography>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={capability.messageType}
                    label={"Message Type"}
                    margin="normal"
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.publisherId}
                    label={"Publisher ID"}
                    margin="normal"
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.publicationId}
                    label={"Publication ID"}
                    margin="normal"
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.originatingCountry}
                    label={"Originating Country"}
                    margin="normal"
                  />
                  <TextField
                    contentEditable={false}
                    value={capability.protocolVersion}
                    label={"Originating Country"}
                    margin="normal"
                  />
                  {/*TODO: Cause Codes*/}
                  {capability.causeCodesDictionary && (
                    <FormControl margin="normal">
                      <InputLabel>Cause codes</InputLabel>
                      <Select label={"Cause codes"}>
                        {capability.causeCodesDictionary.map((cause) => {
                          if (cause.message != undefined) {
                            return (
                              <MenuItem key={cause.code} value={cause.message}>
                                {`${cause.code}: ${cause.message}`}
                              </MenuItem>
                            );
                          }
                        })}
                      </Select>
                    </FormControl>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <TextField
                      contentEditable={false}
                      value={capability.quadTree}
                      label={"Quadtree"}
                      sx={{
                        flexGrow: 1,
                        marginRight: 1,
                      }}
                    />
                    <Button
                      sx={{
                        borderRadius: 100,
                        width: 150,
                      }}
                      variant={"outlined"}
                      onClick={() => setViewMap((current) => !current)}
                    >
                      {viewMap ? "Show map" : "Hide map"}
                    </Button>
                  </Box>
                </FormControl>
                {viewMap && (
                  <Map
                    quadtree={capability.quadTree}
                    interactive={false}
                    width={"100%"}
                    height={400}
                  />
                )}
              </Box>
            </ListItem>

            <ListItem>
              <Button
                sx={{ borderRadius: 100, textTransform: "none" }}
                variant={"contained"}
                color={"greenDark"}
                disableElevation
                onClick={() => saveSubscription("anna", selector)}
              >
                Subscribe
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Snackbar
        message={"Successfully subscribed to capability"}
        severity={"success"}
        open={openSnack}
        handleClose={handleSnackClose}
      />
    </>
  );
};

export default CapabilitiesDrawer;
