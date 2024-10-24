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
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import React from "react";
import { ExtendedCapability } from "@/types/capability";
import { styled } from "@mui/material/styles";

type Props = {
  capability: ExtendedCapability;
  handleMoreClose: () => void;
  setOpenMap: (open: boolean) => void;
};
const CapabilityDrawerForm = ({ capability, handleMoreClose, setOpenMap }: Props) => {

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
              label="Publisher ID"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.publisherId} />
                )
              }}
            />
            <TextField
              contentEditable={false}
              value={capability.publicationId}
              label="Publication ID"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.publicationId} />
                )
              }}
            />
            {capability.publicationType && (
              <TextField
                contentEditable={false}
                value={capability.publicationType}
                label="Publication type"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={capability.publicationType} />
                  )
                }}
              />
            )}
            {capability.publisherName && (
              <TextField
                contentEditable={false}
                value={capability.publisherName}
                label="Publisher name"
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={capability.publisherName} />
                  )
                }}
              />
            )}
            <TextField
              contentEditable={false}
              value={capability.originatingCountry}
              label="Originating Country"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.originatingCountry} />
                )
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
              label="Message Type"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.messageType} />
                )
              }}
            />
            <TextField
              contentEditable={false}
              value={capability.protocolVersion}
              label="Protocol Version"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.protocolVersion} />
                )
              }}
            />
            {capability.causeCodesDictionary && (
              <FormControl margin="normal">
                <InputLabel>Cause codes</InputLabel>
                <Select
                  MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                  label="Cause codes"
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
      <ListItem>
        <StyledCard variant={"outlined"}>
          <Typography>Quadtree</Typography>
          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TextField
              contentEditable={false}
              value={capability.quadTree}
              label="Hash"
              margin="normal"
              sx={{
                flexGrow: 1,
                marginRight: 1
              }}
              InputProps={{
                endAdornment: (
                  <ContentCopy value={capability.quadTree.toString()} />
                )
              }}
            />
            <StyledButton
              color="buttonThemeColor"
              variant="outlined"
              onClick={() => setOpenMap(true)}
            >
              Show map
            </StyledButton>
          </FormControl>
        </StyledCard>
      </ListItem>
    </>
  );
};

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%"
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

const StyledButton = styled(Button)(({}) => ({
  width: "150px",
  textTransform: "none",
  borderRadius: 100
}));

export default CapabilityDrawerForm;