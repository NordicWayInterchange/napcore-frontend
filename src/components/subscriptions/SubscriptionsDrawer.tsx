import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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

const width = 600;

type Props = {
  subscription: ExtendedSubscription;
  open: boolean;
  handleMoreClose: () => void;
};

const SubscriptionsDrawer = ({
  subscription,
  open,
  handleMoreClose,
}: Props) => {
  console.log(subscription);

  const theme = useTheme();

  const copyPrivateKey = (value: string) => {
    // TODO: Promise retured are ignored
    navigator.clipboard.writeText(value);
  };

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
          <IconButton onClick={handleMoreClose} edge="end" color="primary">
            <CloseIcon />
          </IconButton>
          <ListItem>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 1,
              }}
            >
              <Typography>Subscription details</Typography>
              <Chip
                sx={{ borderRadius: 1 }}
                // TODO: Fix
                color={statusChips[subscription.status]}
                label={subscription.status}
              />
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <ListItemText primary={"ID"} secondary={subscription.id} />
                  <ListItemText
                    primary={"Capability matches"}
                    secondary={subscription.capabilityMatches}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={"Last updated"}
                    // TODO: Update
                    secondary={"12:46"}
                  />
                </Box>
              </Box>
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
              {/*TODO: add enpoints (currently existing)*/}
              {/*<Box>{subscription.endpoints[0].host}</Box>
          <Box>{subscription.endpoints[0].source}</Box>
          <Box>{subscription.endpoints[0].port}</Box>*/}
              <Typography>ENDPOINTS</Typography>
              <FormControl fullWidth>
                <TextField
                  contentEditable={false}
                  value={"ampqs://myserver"}
                  label={"Host"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => copyPrivateKey("ampqs://myserver")}
                          edge="end"
                          color="primary"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  contentEditable={false}
                  value={"Serviceprovider 1-1"}
                  label={"Source"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => copyPrivateKey("Serviceprovider 1-1")}
                          edge="end"
                          color="primary"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  contentEditable={false}
                  value={"5671"}
                  label={"Port"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => copyPrivateKey("5671")}
                          edge="end"
                          color="primary"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
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
              <Typography>SELECTOR</Typography>
              <FormControl fullWidth>
                <TextField multiline value={subscription.selector} rows={4} />
              </FormControl>
            </Box>
          </ListItem>
          <ListItem>
            <Button
              sx={{ borderRadius: 100 }}
              variant={"contained"}
              color={"depricatedLight"}
            >
              Remove Subscription
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SubscriptionsDrawer;
