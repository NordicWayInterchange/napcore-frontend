import {
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import React, { useState } from "react";
import { ExtendedCapability } from "@/types/capability";
import { styled } from "@mui/material/styles";

const width = 600;

type Props = {
  capability: ExtendedCapability;
  handleMoreClose: () => void;
};
const DrawerForm = ({ capability, handleMoreClose }: Props) => {

  return (
  <>

    <ListItem sx={{ justifyContent: "flex-end" }}>
      <IconButton onClick={handleMoreClose}>
        <CloseIcon />
      </IconButton>
    </ListItem>
    <ListItem>
      <Typography>Capability details</Typography>
    </ListItem>

    <ListItem>
      <StyledCard variant={"outlined"}>
        <Typography>Publisher</Typography>
        <FormControl fullWidth>
          <TextField
            contentEditable={false}
            value={capability.publisherId}
            label={"Publisher ID"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <ContentCopy value={capability.publisherId} />
              ),
            }}
          />
          <TextField
            contentEditable={false}
            value={capability.publicationId}
            label={"Publication ID"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <ContentCopy value={capability.publicationId} />
              ),
            }}
          />
          <TextField
            contentEditable={false}
            value={capability.originatingCountry}
            label={"Originating Country"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <ContentCopy value={capability.originatingCountry} />
              ),
            }}
          />
        </FormControl>
      </StyledCard>
    </ListItem>

    <ListItem>
      <StyledCard variant={"outlined"}>
        <Typography>Message</Typography>
        <FormControl fullWidth>
          <TextField
            contentEditable={false}
            value={capability.messageType}
            label={"Message Type"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <ContentCopy value={capability.messageType} />
              ),
            }}
          />
          <TextField
            contentEditable={false}
            value={capability.protocolVersion}
            label={"Protocol Version"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <ContentCopy value={capability.protocolVersion} />
              ),
            }}
          />
          {capability.causeCodesDictionary && (
            <FormControl margin="normal">
              <InputLabel>Cause codes</InputLabel>
              <Select
                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                label={"Cause codes"}
                multiple
                defaultValue={capability.causeCodesDictionary.map(
                  (cause) => {
                    return cause["value"];
                  }
                )}
              >
                {capability.causeCodesDictionary.map((cause, index) => {
                  return (
                    <StyledMenuItem
                      disabled
                      key={index}
                      value={cause.value}
                    >
                      {cause.value}: {cause.label}
                    </StyledMenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </FormControl>
      </StyledCard>
    </ListItem>
  </>
);
}

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

const StyledButton = styled(Button)(({}) => ({
  width: "150px",
  textTransform: "none",
  borderRadius: 100,
}));

const StyledMenuItem = styled(MenuItem)(({}) => ({
  "&.MuiMenuItem-root": {
    color: "black",
    opacity: 1,
  },
  "&.Mui-disabled": {
    color: "black",
    opacity: 1,
  },
  "&.Mui-selected": {
    backgroundColor: "white",
    "&.Mui-focusVisible": {
      background: "white",
    },
  },
}));

export default DrawerForm;