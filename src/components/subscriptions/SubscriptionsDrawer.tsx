import {
  Box,
  Button,
  Chip,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSubDialog from "@/components/subscriptions/DeleteSubDialog";
import { ContentCopy } from "@/components/shared/ContentCopy";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  };

  const handleClose = () => {
    handleMoreClose();
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
                {/*TODO: add endpoints (currently not existing)*/}
                {/*<Box>{subscription.endpoints[0].host}</Box>
          <Box>{subscription.endpoints[0].source}</Box>
          <Box>{subscription.endpoints[0].port}</Box>*/}
                <Typography>ENDPOINTS</Typography>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={"ampqs://myserver"}
                    label={"Host"}
                    margin="normal"
                    InputProps={{
                      endAdornment: <ContentCopy value={"ampqs://myserver"} />,
                    }}
                  />
                  <TextField
                    contentEditable={false}
                    value={"Serviceprovider 1-1"}
                    label={"Source"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={"Serviceprovider 1-1"} />
                      ),
                    }}
                  />
                  <TextField
                    contentEditable={false}
                    value={"5671"}
                    label={"Port"}
                    margin="normal"
                    InputProps={{
                      endAdornment: <ContentCopy value={"5671"} />,
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
                  <TextField
                    margin="normal"
                    multiline
                    value={subscription.selector}
                    rows={4}
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={subscription.selector} />
                      ),
                    }}
                  />
                </FormControl>
              </Box>
            </ListItem>
            <ListItem>
              <Button
                sx={{ borderRadius: 100, textTransform: "none" }}
                variant={"contained"}
                color={"depricatedLight"}
                onClick={() => setDialogOpen(true)}
              >
                Remove subscription
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={"anna"}
        subscriptionId={subscription.id}
        handleDialog={handleClickClose}
      />
    </>
  );
};

export default SubscriptionsDrawer;
