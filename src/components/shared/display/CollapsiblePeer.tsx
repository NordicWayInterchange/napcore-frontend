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
import { escapeString } from "@/lib/escapeString";

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

  const handleSnackClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
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
    const cleanPeer = escapeString(newSubItem.trim());
    if (cleanPeer === "") return;
    const response = await addPeerToExistingPrivateChannel(
      actorCommonName,
      privateChannelId,
      { peerToAdd: cleanPeer }
    );

    if (response.ok) {
      setPeerItems((prevItems) => [...prevItems, cleanPeer]);
      refetchPrivateChannel();
      setNewSubItem("");
      setIsAdding(false);
      setFeedback({
        feedback: true,
        message: `${cleanPeer} successfully added`,
        severity: "success"
      });
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || `${cleanPeer} could not be added, try again!`;

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
          <Box sx={expandMoreStyle}>
            <ExpandMoreIcon
              fontSize="small"
              sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
            />
          </Box>
        </IconButton>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          <Box sx={peerListStyle} />
          {peerItems.length > 0 ? peerItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={<Box sx={primaryTextStyle}>{item}</Box>}
                              primaryTypographyProps={{ component: "div" }}
                              secondary={<Box sx={secondaryContainerStyle}><ContentCopy value={item} /></Box>}
                              secondaryTypographyProps={{ component: "div" }} />
                <ListItemSecondaryAction>
                  <IconButton sx={{ left: "13px", position: "relative", top: "-13px" }}
                              onClick={() => handleDelete(index)}>
                    <DeleteIcon fontSize="medium" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < peerItems.length - 1 && <Divider
                sx={{ borderStyle: "dashed", borderWidth: 1, marginX: 2, position: "relative", top: "-13px" }} />}
            </React.Fragment>
          )) : <Box sx={warningStyle}>
            <WarningAmberIcon sx={{ mr: "6px", mt: "-7px" }} />
            <Typography variant="body2" sx={{ fontWeight: "500" }}>There is no peer for this private channel</Typography>
          </Box>}

          {isAdding && (
            <ListItem sx={{ display: "flex", justifyContent: "space-between", paddingY: 1 }}>
              <>
                <TextField
                  fullWidth
                  label="Enter a peer"
                  size="small"
                  variant="outlined"
                  value={newSubItem}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  aria-hidden="false"
                  inputProps={{ maxLength: 255 }}
                  onChange={(e) => setNewSubItem(e.target.value)}
                  InputProps={textFieldInputProps}
                  sx={textFieldSx}
                />
                <Box sx={{
                  display: "flex",
                  position: "relative",
                  right: "-13px",
                  top: "-11px",
                  alignItems: "center"
                }}>
                  <IconButton onClick={handleSaveClick} sx={{ marginRight: "-8px" }}>
                    <SaveIcon fontSize="medium" />
                  </IconButton>
                  <IconButton onClick={handleCloseTextField}>
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                </Box>
              </>
            </ListItem>
          )}
        </List>

        <Box textAlign="center" sx={{ paddingY: 1, color: "primary.main" }}>
          {!isAdding && (
            <StyledButton
              ref={addButtonRef}
              sx={{
                my: 1, boxShadow: 2, mt: -1, position: "relative",
                top: "-13px"
              }}
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

const primaryTextStyle = {
  maxWidth: "calc(100% - 32px)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  position: "relative",
  top: "-13px"
};

const expandMoreStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 35,
  height: 35,
  borderRadius: "50%",
  border: "1px solid gray",
  transition: "#gray 0.3s, border 0.3s",
  position: "relative",
  right: "-8px"
};

const secondaryContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  ml: "1px",
  position: "relative",
  top: "-25px"
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "gray"
    },
    "&:hover": {
      boxShadow: "1"
    }
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#444f55"
  },
  position: "relative",
  top: "-10px"
};

const textFieldInputProps = {
  style: {
    color: "sidebarBorderColor",
    backgroundColor: "#f9f9f9",
    padding: "5px 12px",
    borderRadius: "8px",
    boxShadow: "5"
  }
};

const warningStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#E67600",
  padding: "4px 12px",
  borderRadius: "6px",
  boxShadow: 1,
  height: "40px",
  backgroundColor: "#FFF7E6",
  position: "relative", top: "-20px"
};

const peerListStyle = {
  height: "1.5px",
  flexGrow: 1,
  backgroundColor: "#E67600",
  marginX: 2,
  position: "relative",
  top: "-15px"
};
