import {
  Box,
  Button, Card, Divider,
  Drawer, FormControl, IconButton, InputLabel,
  List,
  ListItem, MenuItem, Select, TextField,
  Toolbar, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import { IFeedback } from "@/interface/IFeedback";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { PrivateChannel } from "@/types/napcore/privateChannel";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { styled } from "@mui/material/styles";

const width = 600;

type Props = {
  privateChannel: PrivateChannel;
  open: boolean;
  handleMoreClose: () => void;
  handleDeletedItem: (deleted: boolean) => void;
};

const PrivateChannelsDrawer = ({ privateChannel, open, handleMoreClose, handleDeletedItem }: Props) => {
  const { data: session } = useSession();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  console.log('private channel', privateChannel.endpoint);

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
              <StyledHeaderBox>
                <Typography>Private channel details</Typography>
                <Chip
                  color={
                    statusChips[
                      privateChannel.status.toString() as keyof typeof statusChips
                      ] as any
                  }
                  label={privateChannel.status}
                />
              </StyledHeaderBox>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={privateChannel.id}
                    label={"ID"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={privateChannel.id} />
                      )
                    }}
                  />
                </FormControl>
              </StyledCard>
            </ListItem>

            {privateChannel.peers && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography  sx={{ marginBottom: 2 }}>Peers</Typography>
                  <FormControl fullWidth>
                    <InputLabel>Peers</InputLabel>
                    <Select
                      MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      label="Peers"
                      multiple
                      defaultValue={privateChannel.peers.map(
                        (peer) => {
                          return peer;
                        }
                      )}
                    >
                      {privateChannel.peers.map((peer, index) => {
                        return (
                          <StyledMenuItem
                            disabled
                            key={index}
                            value={peer}
                          >
                            {peer}
                          </StyledMenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </StyledCard>
              </ListItem>
            )}
            {privateChannel.endpoint && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography>Endpoint</Typography>
                  <FormControl fullWidth>
                    <TextField
                      contentEditable={false}
                      value={privateChannel.endpoint.host}
                      label={"Host"}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={privateChannel.endpoint.host} />
                        ),
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={privateChannel.endpoint.port}
                      label="Port"
                      margin="normal"
                      InputProps={{
                        endAdornment: <ContentCopy value={privateChannel.endpoint.port.toString()} />,
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={privateChannel.endpoint.queueName}
                      label="Queue name"
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={privateChannel.endpoint.queueName} />
                        ),
                      }}
                    />
                  </FormControl>
                </StyledCard>
              </ListItem>
            )}
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Description</Typography>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    margin="normal"
                    multiline
                    value={privateChannel.description}
                    rows={4}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <ContentCopy value={privateChannel.description} />
                      ),
                    }}
                  />
                </FormControl>
              </StyledCard>
            </ListItem>
            <ListItem >
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
                Remove private channel
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
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={session?.user.commonName as string}
        itemId={privateChannel.id as string}
        handleDialog={handleClickClose}
        handleDeletedItem={handleDeletedItem}
        text="Private channel"
      />
    </>
  );
};

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%"
}));


const StyledHeaderBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

const StyledMenuItem = styled(MenuItem)(({}) => ({
  "&.MuiMenuItem-root": {
    color: "black",
    opacity: 1
  },
  "&.Mui-disabled": {
    color: "black",
    opacity: 1
  },
  "&.Mui-selected": {
    backgroundColor: "white",
    "&.Mui-focusVisible": {
      background: "white"
    }
  }
}));


export default PrivateChannelsDrawer;
