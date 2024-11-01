import React, { useState } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import { IFeedback } from "@/interface/IFeedback";
import { addPeerToExistingPrivateChannel, deletePeerFromExistingPrivateChannel } from "@/lib/fetchers/internalFetchers";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Snackbar from "@/components/shared/feedback/Snackbar";
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
interface Props {
  subItems: string[];
  privateChannelId: string;
  actorCommonName: string;
}

const CollapsiblePeerName: React.FC<Props> = ({ subItems: initialSubItems, privateChannelId, actorCommonName }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [subItems, setSubItems] = useState<string[]>(initialSubItems);
  const [newSubItem, setNewSubItem] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const [isVisible, setIsVisible] = useState(true);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleDelete = async (index: number) => {
    const peerToDelete = subItems[index];
    const response = await deletePeerFromExistingPrivateChannel(actorCommonName, privateChannelId, peerToDelete);

    setFeedback({
      feedback: true,
      message: response.ok
        ? `${peerToDelete.trim()} successfully deleted`
        : `${peerToDelete.trim()} could not be deleted, try again!`,
      severity: response.ok ? "success" : "warning"
    });

  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsVisible(true);
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleSaveClick = async () => {
    if (newSubItem.trim() === '') return;
      const response = await addPeerToExistingPrivateChannel(
        actorCommonName,
        privateChannelId,
        newSubItem.trim()
      );

      setFeedback({
        feedback: true,
        message: response.ok
          ? `${newSubItem.trim()} successfully added`
          : `${newSubItem.trim()} could not be added, try again!`,
        severity: response.ok ? "success" : "warning"
      });

      if (response.ok) {
        setSubItems((prevItems) => [...prevItems, newSubItem.trim()]);
        setNewSubItem('');
        setIsAdding(false);
      }
  }
  const handleCloseTextField = () => {
    setIsVisible(false);
    setIsAdding(false);
  };

  return (
    <Card variant="outlined" >
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex">
          <Typography>Peer names</Typography>
        </Box>
        <IconButton onClick={handleExpandClick} size="small">
          <ExpandMoreIcon
            fontSize="small"
            sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
          />
        </IconButton>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          {subItems.length > 0 ? subItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ display: "flex", justifyContent: "space-between", paddingY: 1 }}>
                <ListItemText primary={item} sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal"
                }} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < subItems.length - 1 && <Divider />}
            </React.Fragment>
          )) : <StyledGridOverlay>
            <IconButton
              edge="end"
            >
              <HourglassEmptyIcon />
            </IconButton>
            <StyledBox>No peers in the network</StyledBox>
          </StyledGridOverlay>
          }

        {isAdding && (
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 1 }}>
            {isVisible && (
              <>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Enter a peer name"
                  value={newSubItem}
                  onChange={(e) => setNewSubItem(e.target.value)}
                />
                <IconButton
                  edge="end"
                  aria-label="save"
                  onClick={handleSaveClick}
                >
                  <Box sx={{ display: 'flex', gap:.75}}>
                  <SaveIcon fontSize="small" />
                  <CloseIcon fontSize="small" onClick={handleCloseTextField} />
                  </Box>
                </IconButton>
              </>
            )}
          </ListItem>
        )}
        </List>

        <Box textAlign="center" sx={{ paddingY: 1, color: 'primary.main' }}>
          {!isAdding && (
            <StyledButton
              sx={{ my: 1, boxShadow: 2 }}
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

export default CollapsiblePeerName;
const StyledButton = styled(Button)(({}) => ({
  borderRadius: 100,
  textTransform: "none",
  marginLeft: 2,
  height: 40,
  width: "200px"
}));

const StyledGridOverlay = styled("div")(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
}));

const StyledBox = styled(Box)(({}) => ({
  mt: 100,
}));
