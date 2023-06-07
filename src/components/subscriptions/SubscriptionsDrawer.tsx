import {
  Box,
  Button,
  Card,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField as MuiTextField,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSubDialog from "@/components/subscriptions/DeleteSubDialog";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { Chip } from "@/components/shared/display/Chip";
import { styled } from "@mui/material/styles";

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
        onClose={handleMoreClose}
      >
        <Toolbar />
        <Box sx={{ padding: 1 }}>
          <List>
            <ListItem sx={{ justifyContent: "flex-end" }}>
              <IconButton onClick={handleMoreClose}>
                <CloseIcon />
              </IconButton>
            </ListItem>
            <ListItem>
              <StyledHeaderBox>
                <Typography>Subscription details</Typography>
                <Chip
                  color={statusChips[subscription.status]}
                  label={subscription.status}
                />
              </StyledHeaderBox>
            </ListItem>
            <ListItem>
              <StyledCard variant={"outlined"}>
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
              </StyledCard>
            </ListItem>
            <ListItem>
              <StyledCard variant={"outlined"}>
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
              </StyledCard>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
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
              </StyledCard>
            </ListItem>
            <ListItem>
              <Button
                sx={{
                  borderRadius: 100,
                  textTransform: "none",
                }}
                variant={"contained"}
                color={"depricatedLight"}
                onClick={() => setDialogOpen(true)}
                disableElevation
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

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

const StyledHeaderBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

export default SubscriptionsDrawer;
