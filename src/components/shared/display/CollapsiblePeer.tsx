import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button, TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { IFeedback } from "@/interface/IFeedback";
import { addPeerToExistingPrivateChannel, deletePeerFromExistingPrivateChannel } from "@/lib/fetchers/internalFetchers";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Snackbar from "@/components/shared/feedback/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";

type Props = {
  subItems: string[];
  privateChannelId: string;
  actorCommonName: string;
  refetchPrivateChannel: any;
}

const CollapsiblePeer = ({ subItems, privateChannelId, actorCommonName, refetchPrivateChannel }: Props) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [peerItems, setPeerItems] = useState<string[]>(subItems);
  const [newSubItem, setNewSubItem] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success"
  });

  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (addButtonRef.current) {
      addButtonRef.current.focus();
    }
  });

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleDelete = async (index: number) => {
    const peerToDelete = peerItems[index];
    const response = await deletePeerFromExistingPrivateChannel(actorCommonName, privateChannelId, peerToDelete);

    if (response.ok) {
      refetchPrivateChannel();
      setPeerItems((peers) => peers.filter((_, i) => i !== index));
      setFeedback({
        feedback: true,
        message: `${peerToDelete.trim()} successfully deleted`,
        severity: "success"
      });
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || `${peerToDelete.trim()} could not be deleted, try again!`;

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning"
      });
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setFeedback({ feedback: false, message: "", severity: "success" });
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      try {
        await handleSaveClick();
      } catch (error) {
        console.warn("Could not saveClick");
      }
    }
  };

  const handleSaveClick = async () => {
    if (newSubItem.trim() === "") return;
    const response = await addPeerToExistingPrivateChannel(
      actorCommonName,
      privateChannelId,
      { peerToAdd: newSubItem.trim() }
    );

    if (response.ok) {
      setPeerItems((prevItems) => [...prevItems, newSubItem.trim()]);
      refetchPrivateChannel();
      setNewSubItem("");
      setIsAdding(false);
      setFeedback({
        feedback: true,
        message: `${newSubItem.trim()} successfully added`,
        severity: "success"
      });
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || `${newSubItem.trim()} could not be added, try again!`;

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning"
      });
    }

  };
  const handleCloseTextField = () => {
    setIsAdding(false);
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box display="flex">
          <Typography>Your peers</Typography>
        </Box>
        <IconButton onClick={handleExpandClick} size="small">
          <ExpandMoreIcon
            fontSize="small"
            sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
          />
        </IconButton>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          {peerItems.length > 0 ? peerItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%"
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "calc(100% - 32px)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {item}
                    </Box>
                  </Box>
                }
                              primaryTypographyProps={{ component: "div" }}
                              secondary={<Box sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "100%",
                                ml: "1px",
                                position: "relative",
                                top: "-13px"
                              }}><ContentCopy value={item} /></Box>}
                              secondaryTypographyProps={{ component: "div" }}
                />
                <ListItemSecondaryAction>
                  <IconButton sx={{ left: "13px" }}
                              onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon fontSize="medium" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < peerItems.length - 1 && <Divider />}
            </React.Fragment>
          )) : <Box sx={{ display: "flex", justifyContent: "center", color: "#E67600", mb: "10px" }}>
            <WarningAmberIcon sx={{ mt: "-15px", fontWeight: "small" }} />
            <Typography variant="body2" sx={{ ml: "4px", mt: "-10px" }}>No peers in the network</Typography>
          </Box>
          }

          {isAdding && (
            <ListItem sx={{ display: "flex", justifyContent: "space-between", paddingY: 1 }}>
              <>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Enter a peer"
                  value={newSubItem}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onChange={(e) => setNewSubItem(e.target.value)}
                />
                <IconButton
                  edge="end"
                  aria-label="save"
                  onClick={handleSaveClick}
                >
                  <Box sx={{ display: "flex", gap: .75 }}>
                    <SaveIcon fontSize="medium" />
                    <CloseIcon fontSize="medium" onClick={handleCloseTextField} />
                  </Box>
                </IconButton>
              </>
            </ListItem>
          )}
        </List>

        <Box textAlign="center" sx={{ paddingY: 1, color: "primary.main" }}>
          {!isAdding && (
            <StyledButton
              ref={addButtonRef}
              sx={{ my: 1, boxShadow: 2, mt: -1 }}
              startIcon={<AddIcon />}
              variant="contained"
              color="buttonThemeColor"
              disableElevation
              onClick={handleAddClick}
            >
              Add peer
            </StyledButton>
          )}
        </Box>
      </Collapse>
      {feedback.feedback && (
        <Snackbar
          message={feedback.message}
          severity={feedback.severity}
          open={feedback.feedback}
          handleClose={handleSnackClose}
        />
      )}
    </Card>
  );
};

export default CollapsiblePeer;
const StyledButton = styled(Button)(({}) => ({
  borderRadius: 100,
  textTransform: "none",
  marginLeft: 2,
  height: 40,
  width: "200px"
}));
