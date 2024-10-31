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
//import { addPeerToExistingPrivateChannel } from "@/lib/fetchers/internalFetchers";
import { IFeedback } from "@/interface/IFeedback";
import { deletePeerFromExistingPrivateChannel } from "@/lib/fetchers/internalFetchers";

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

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleDelete = async (index: number) => {
    const peerToDelete = subItems[index];
    await deletePeerFromExistingPrivateChannel(actorCommonName, privateChannelId, peerToDelete);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveClick = async () => {
   /* if (newSubItem.trim() === '') return;
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
      }*/
  }

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
          {subItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 1 }}>
                <ListItemText primary={item} sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                }}/>
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
          ))}

        {isAdding && (
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between', paddingY: 1 }}>
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
              <SaveIcon fontSize="small" />
            </IconButton>
          </ListItem>
        )}
        </List>

        <Box textAlign="center" sx={{ paddingY: 1, color: 'primary.main' }}>
          {!isAdding && (
            <Button variant="text" color="primary" size="small" onClick={handleAddClick}>
              + add peer name
            </Button>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default CollapsiblePeerName;
