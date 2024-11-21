import {
  Box,
  Button, Card,
  Drawer, FormControl, IconButton, InputAdornment,
  List,
  ListItem, ListItemText, TextField,
  Toolbar, Typography
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedSubscription } from "@/types/subscription";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import { useSession } from "next-auth/react";
import { ExtendedDelivery } from "@/types/delivery";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { timeConverter } from "@/lib/timeConverter";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { styled } from "@mui/material/styles";

const width = 600;

type Props = {
  item: ExtendedSubscription | ExtendedDelivery;
  open: boolean;
  handleMoreClose: () => void;
  handleDeletedItem: (deleted: boolean) => void;
  label: string;
};

const CommonDrawer = ({item, open, handleMoreClose, handleDeletedItem, label }: Props) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  };

  const getAttribute = () => {
      return label == "Delivery" ? item.endpoints[0].target: item.endpoints[0].source;
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
                <Typography>{label} details</Typography>
                <Chip
                  color={
                    statusChips[
                      item.status.toString() as keyof typeof statusChips
                      ] as any
                  }
                  label={item.status}
                />
              </StyledHeaderBox>
            </ListItem>
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <ListItemText primary={"ID"} secondary={item.id} />
                    <ListItemText
                      primary={"Capability matches"}
                      secondary={item.capabilityMatches}
                    />
                  </Box>
                  <Box>
                    <ListItemText
                      primary={"Last updated"}
                      secondary={timeConverter(item.lastUpdatedTimestamp)}
                    />
                  </Box>
                </Box>
              </StyledCard>
            </ListItem>
            {item.endpoints.length > 0 && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography>Endpoints</Typography>
                  <FormControl fullWidth>
                    <TextField
                      value={item.endpoints[0].host || ""}
                      label="Host"
                      margin="normal"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <ContentCopy value={item.endpoints[0].host} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      value={getAttribute() || ""}
                      label={label == "Delivery" ? "Target" : "Source"}
                      margin="normal"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <ContentCopy value={getAttribute()} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      value={item.endpoints[0].port || ""}
                      label="Port"
                      margin="normal"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <ContentCopy value={item.endpoints[0].port.toString()} />,
                            </InputAdornment>
                          ),
                        },
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
                    value={item.selector || ""}
                    rows={4}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <ContentCopy value={item.selector} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </FormControl>
              </StyledCard>
            </ListItem>
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Description</Typography>
                <div>
                  <FormControl fullWidth>
                    <TextField
                      margin="normal"
                      multiline
                      value={item.description || ""}
                      rows={4}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <ContentCopy value={item.description} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </FormControl>
                </div>
              </StyledCard>
            </ListItem>
            <ListItem>
              <Button
                sx={{
                  textTransform: "none",
                }}
                variant={"contained"}
                color={"redLight"}
                onClick={() => setDialogOpen(true)}
                disableElevation
              >
                Remove {label}
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={session?.user.commonName as string}
        itemId={item.id}
        handleDialog={handleClickClose}
        handleDeletedItem={handleDeletedItem}
        text={label}
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


export default CommonDrawer;
