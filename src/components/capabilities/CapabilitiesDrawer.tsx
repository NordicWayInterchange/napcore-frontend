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
import React from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { left } from "@popperjs/core";
import { ExtendedCapability } from "@/types/capability";
import { OriginatingCountry } from "@/types/originatingCountry";

const width = 600;

type Props = {
  capability: ExtendedCapability;
  open: boolean;
  handleMoreClose: () => void;
};

const SubscriptionsDrawer = ({ capability, open, handleMoreClose }: Props) => {
  const handleClose = () => {
    handleMoreClose();
  };

  return (
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
      onClose={handleClose}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 1,
              }}
            >
              <Typography>Capability details</Typography>
            </Box>
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
                  <FormControl>
                    <InputLabel>Cause codes</InputLabel>
                    <Select contentEditable={false} value={"Cause codes"}>
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
                <TextField
                  contentEditable={false}
                  value={capability.quadTree}
                  label={"Quadtree"}
                  margin="normal"
                />
              </FormControl>
            </Box>
          </ListItem>

          <ListItem>
            <Button
              sx={{ borderRadius: 100, textTransform: "none" }}
              variant={"contained"}
              color={"depricatedLight"}
            >
              Subscribe
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SubscriptionsDrawer;
