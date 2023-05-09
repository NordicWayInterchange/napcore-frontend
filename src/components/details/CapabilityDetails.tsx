import React, { useState } from "react";
import { ExtendedCapability } from "@/types/capability";
import { InformationText } from "./index";
import { ButtonComponent } from "../shared";
import { createSubscription } from "@/lib/internalFetchers";
import { generateSelector } from "@/lib/generateSelector";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import MapDialog from "../leaflet/MapDialog";

type Props = {
  extendedCapability?: ExtendedCapability;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  if (!extendedCapability) return <InformationText text="capability" />;

  const capability = Object.keys(extendedCapability);

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <List>
        {capability.map((key, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText
              primary={key}
              secondary={
                extendedCapability[key as keyof typeof extendedCapability]
              }
            />
          </ListItem>
        ))}
      </List>
      <ButtonComponent
        text="Subscribe"
        onClick={() =>
          saveSubscription("anna", generateSelector(extendedCapability))
        }
      />
      {extendedCapability.quadTree && (
        <ButtonComponent text="Map" onClick={handleClickOpen} />
      )}
      <MapDialog
        open={open}
        onClose={handleClose}
        quadtree={extendedCapability.quadTree}
        interactive={false}
      />
    </Box>
  );
}
