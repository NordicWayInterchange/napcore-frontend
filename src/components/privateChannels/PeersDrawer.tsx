import {
  Box, Card,
  Drawer, FormControl, IconButton,
  List,
  ListItem, ListItemText, TextField,
  Toolbar, Typography
} from "@mui/material";
import React, { useState } from "react";
import { IFeedback } from "@/interface/IFeedback";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { PrivateChannelPeers } from "@/types/napcore/privateChannel";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { styled } from "@mui/material/styles";
import { timeConverter } from "@/lib/timeConverter";

const width = 600;

type Props = {
  peers: PrivateChannelPeers;
  open: boolean;
  handleMoreClose: () => void;
};

const PeersDrawer = ({ peers, open, handleMoreClose }: Props) => {
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
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
                <Typography>Subscribed private channel details</Typography>
                <Chip
                  color={
                    statusChips[
                      peers.status.toString() as keyof typeof statusChips
                      ] as any
                  }
                  label={peers.status}
                />
              </StyledHeaderBox>
            </ListItem>

            <ListItem>
              <StyledCard variant={"outlined"}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <ListItemText primary={"ID"} secondary={peers.id} />
                  </Box>
                  <Box>
                    <ListItemText
                      primary={"Last updated"}
                      secondary={timeConverter(peers.lastUpdated)}
                    />
                  </Box>
                </Box>
                <FormControl fullWidth>
                  <TextField
                    contentEditable={false}
                    value={peers.owner}
                    label={"Owner"}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={peers.owner} />
                      ),
                    }}
                  />
                </FormControl>
              </StyledCard>
            </ListItem>

            {peers.endpoint && (
              <ListItem>
                <StyledCard variant={"outlined"}>
                  <Typography>Endpoint</Typography>
                  <FormControl fullWidth>
                    <TextField
                      contentEditable={false}
                      value={peers.endpoint.host}
                      label={"Host"}
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={peers.endpoint.host} />
                        ),
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={peers.endpoint.port}
                      label="Port"
                      margin="normal"
                      InputProps={{
                        endAdornment: <ContentCopy value={peers.endpoint.port.toString()} />,
                      }}
                    />
                    <TextField
                      contentEditable={false}
                      value={peers.endpoint.queueName}
                      label="Queue name"
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <ContentCopy value={peers.endpoint.queueName} />
                        ),
                      }}
                    />
                  </FormControl>
                </StyledCard>
              </ListItem>
            )}
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



export default PeersDrawer;
