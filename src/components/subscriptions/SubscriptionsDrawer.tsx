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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSubDialog from "@/components/subscriptions/DeleteSubDialog";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { Chip } from "@/components/shared/display/Chip";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { timeConverter } from "@/lib/timeConverter";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { data: session } = useSession();

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
                  color={
                    statusChips[
                      subscription.status.toString() as keyof typeof statusChips
                    ] as any
                  }
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
                      secondary={timeConverter(
                        subscription.lastUpdatedTimestamp
                      )}
                    />
                  </Box>
                </Box>
              </StyledCard>
            </ListItem>
            {subscription.endpoints.length > 0 && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography>Endpoints</Typography>
                  <FormControl fullWidth>
                    <TextField
                      contentEditable={false}
                      value={subscription.endpoints[0].host}
                      label={"Host"}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={subscription.endpoints[0].host} />
                        ),
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={subscription.endpoints[0].source}
                      label={"Source"}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={subscription.endpoints[0].source} />
                        ),
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={"5671"}
                      label={subscription.endpoints[0].port}
                      margin="normal"
                      InputProps={{
                        endAdornment: <ContentCopy value={"5671"} />,
                      }}
                    />
                  </FormControl>
                </StyledCard>
              </ListItem>
            )}
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Selector</Typography>
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
                color={"buttonThemeColor"}
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
        actorCommonName={session?.user.commonName as string}
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
