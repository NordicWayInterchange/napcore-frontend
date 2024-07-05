import {
  Box,
  Button,
  Card,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem, ListItemText,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { useSession } from "next-auth/react";
import { ExtendedDelivery } from "@/types/delivery";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { timeConverter } from "@/lib/timeConverter";
import DeleteSubDialog from "@/components/subscriptions/DeleteSubDialog";


const width = 600;

type Props = {
  delivery: ExtendedDelivery;
  open: boolean;
  handleMoreClose: () => void;
};

const DeliveriesDrawer = ({
  delivery,
  open,
  handleMoreClose
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
                <Typography>Delivery details</Typography>
                <Chip
                  color={
                    statusChips[
                      delivery.status.toString() as keyof typeof statusChips
                      ] as any
                  }
                  label={delivery.status}
                />
              </StyledHeaderBox>
            </ListItem>
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <ListItemText primary={"ID"} secondary={delivery.id} />
                    <ListItemText
                      primary={"Capability matches"}
                      secondary={delivery.capabilityMatches}
                    />
                  </Box>
                  <Box>
                    <ListItemText
                      primary={"Last updated"}
                      secondary={timeConverter(
                        delivery.lastUpdatedTimeStamp
                      )}
                    />
                  </Box>
                </Box>
              </StyledCard>
            </ListItem>
            {delivery.endpoints.length > 0 && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography>Endpoints</Typography>
                  <FormControl fullWidth>
                    <TextField
                      contentEditable={false}
                      value={delivery.endpoints[0].host}
                      label={"Host"}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={delivery.endpoints[0].host} />
                        ),
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={"5671"}
                      label={delivery.endpoints[0].port}
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
                    value={delivery.selector}
                    rows={4}
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={delivery.selector} />
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
                color={"redLight"}
                onClick={() => setDialogOpen(true)}
                disableElevation
              >
                Remove Delivery
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={session?.user.commonName as string}
        elementId={delivery.id}
        handleDialog={handleClickClose}
        text="delivery"
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

export default DeliveriesDrawer;
