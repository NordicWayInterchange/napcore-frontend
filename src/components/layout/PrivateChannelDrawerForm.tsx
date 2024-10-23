import {
  Box,
  Card,
  FormControl,
  IconButton,
  ListItem, MenuItem,
  TextField,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import React from "react";
import { styled } from "@mui/material/styles";
import { PrivateChannel } from "@/types/napcore/privateChannel";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";

type Props = {
  privateChannel: PrivateChannel;
  handleMoreClose: () => void;
};
const CapabilityDrawerForm = ({ privateChannel, handleMoreClose }: Props) => {

  return (
    <>
      <ListItem sx={{ justifyContent: "flex-end" }}>
        <IconButton onClick={handleMoreClose}>
          <CloseIcon />
        </IconButton>
      </ListItem>
      <ListItem>
        <StyledHeaderBox>
        <Typography>Private channel details</Typography>
        <Chip
          color={
            statusChips[
              privateChannel.status.toString() as keyof typeof statusChips
              ] as any
          }
          label={privateChannel.status}
        />
        </StyledHeaderBox>
      </ListItem>

      <ListItem>
        <StyledCard variant={"outlined"}>
          <FormControl fullWidth>
            <TextField
              contentEditable={false}
              value={privateChannel.id}
              label={"ID"}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <ContentCopy value={privateChannel.id} />
                )
              }}
            />
          </FormControl>
        </StyledCard>
      </ListItem>
      {privateChannel.endpoint?.length > 0 && (
        <ListItem>
          <StyledCard variant={"outlined"}>
            <Typography>Endpoints</Typography>
            <FormControl fullWidth>
              <TextField
                contentEditable={false}
                value={privateChannel.endpoint[0].host}
                label={"Host"}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={privateChannel.endpoint[0].host} />
                  ),
                }}
              />
              <TextField
                contentEditable={false}
                value={"5671"}
                label={privateChannel.endpoint[0].port}
                margin="normal"
                InputProps={{
                  endAdornment: <ContentCopy value={"5671"} />,
                }}
              />
              <TextField
                contentEditable={false}
                value={"Queue"}
                label={privateChannel.endpoint[0].queueName}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={privateChannel.endpoint[0].queueName} />
                  ),
                }}
              />
            </FormControl>
          </StyledCard>
        </ListItem>
      )}
      <ListItem>
        <StyledCard variant={"outlined"}>
              <Typography>Description</Typography>
              <FormControl fullWidth>
                <TextField
                  contentEditable={false}
                  margin="normal"
                  multiline
                  value={privateChannel.description}
                  rows={4}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <ContentCopy value={privateChannel.description} />
                    ),
                  }}
                />
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


const StyledHeaderBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

export default CapabilityDrawerForm;