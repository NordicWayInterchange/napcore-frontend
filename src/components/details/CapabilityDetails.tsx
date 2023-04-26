import React from "react";
import { ExtendedCapability } from "@/types/capability";
import { InformationText } from "./index";
import { ButtonComponent } from "../shared";
import { createSubscription } from "@/lib/internalFetchers";
import { generateSelector } from "@/lib/generateSelector";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

type Props = {
  extendedCapability?: ExtendedCapability;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  if (!extendedCapability) return <InformationText text="capability" />;

  const capability = Object.keys(extendedCapability);

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);
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
    </Box>
  );
}
