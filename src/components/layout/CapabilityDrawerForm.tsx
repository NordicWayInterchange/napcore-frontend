import {
  Card,
  FormControl,
  IconButton, InputAdornment,
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
import { StyledButton } from "@/components/shared/styles/StyledSelectorBuilder";

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
              value={capability.publisherId}
              label="Publisher ID"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopy value={capability.publisherId} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              value={capability.publicationId}
              label="Publication ID"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopy value={capability.publicationId} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {capability.publicationType && (
              <TextField
                value={capability.publicationType}
                label="Publication type"
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <ContentCopy value={capability.publicationType} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            {capability.publisherName && (
              <TextField
                value={capability.publisherName}
                label="Publisher name"
                margin="normal"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <ContentCopy value={capability.publisherName} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            <TextField
              value={capability.originatingCountry}
              label="Originating Country"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopy value={capability.originatingCountry} />
                    </InputAdornment>
                  ),
                },
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
              value={capability.messageType}
              label="Message Type"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopy value={capability.messageType} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              value={capability.protocolVersion}
              label="Protocol Version"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <ContentCopy value={capability.protocolVersion} />
                    </InputAdornment>
                  ),
                },
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
              value={capability.quadTree}
              label="Hash"
              margin="normal"
              sx={{
                flexGrow: 1,
                marginRight: 1
              }}
            />
            <StyledButton
              sx={{mt:2.75}}
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

export default CapabilityDrawerForm;