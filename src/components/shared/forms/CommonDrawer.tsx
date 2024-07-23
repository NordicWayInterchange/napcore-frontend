import {
  Box, Card,
  FormControl,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@/components/shared/display/Chip";
import { statusChips } from "@/lib/statusChips";
import { timeConverter } from "@/lib/timeConverter";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import React from "react";
import { ExtendedDelivery } from "@/types/delivery";
import { styled } from "@mui/material/styles";
import { ExtendedSubscription } from "@/types/subscription";

type Props = {
  artifact: ExtendedDelivery | ExtendedSubscription;
  handleMoreClose: () => void;
  formLabel: string;
};

const CommonDrawer = ({ artifact, handleMoreClose, formLabel }: Props) => {

  return (
    <>
      <ListItem sx={{ justifyContent: "flex-end" }}>
        <IconButton onClick={handleMoreClose}>
          <CloseIcon />
        </IconButton>
      </ListItem>
      <ListItem>
        <StyledHeaderBox>
          <Typography>{formLabel} details</Typography>
          <Chip
            color={
              statusChips[
                artifact.status.toString() as keyof typeof statusChips
                ] as any
            }
            label={artifact.status}
          />
        </StyledHeaderBox>
      </ListItem>
      <ListItem>
        <StyledCard variant={"outlined"}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <ListItemText primary={"ID"} secondary={artifact.id} />
              <ListItemText
                primary={"Capability matches"}
                secondary={artifact.capabilityMatches}
              />
            </Box>
            <Box>
              <ListItemText
                primary={"Last updated"}
                secondary={timeConverter(
                  formLabel === "Delivery" ?  artifact.lastUpdatedTimeStamp :  artifact.lastUpdatedTimestamp
                )}
              />
            </Box>
          </Box>
        </StyledCard>
      </ListItem>
      {artifact.endpoints.length > 0 && (
        <ListItem>
          <StyledCard variant={"outlined"}>
            <Typography>Endpoints</Typography>
            <FormControl fullWidth>
              <TextField
                contentEditable={false}
                value={artifact.endpoints[0].host}
                label={"Host"}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={artifact.endpoints[0].host} />
                  ),
                }}
              />
              <TextField
                contentEditable={false}
                value={formLabel === "Delivery" ? artifact.endpoints[0].target: artifact.endpoints[0].source}
                label={formLabel === "Delivery" ? "target" : "source"}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <ContentCopy value={artifact.endpoints[0].target} />
                  ),
                }}
              />
              <TextField
                contentEditable={false}
                value={"5671"}
                label={artifact.endpoints[0].port}
                margin="normal"
                InputProps={{
                  endAdornment: <ContentCopy value={"5671"} />,
                }}
              />
            </FormControl>
          </StyledCard>
        </ListItem>
      )}
      <ListItem>
        <StyledCard variant={"outlined"}>
          <Typography>Selector</Typography>
          <FormControl fullWidth>
            <TextField
              margin="normal"
              multiline
              value={artifact.selector}
              rows={4}
              InputProps={{
                endAdornment: (
                  <ContentCopy value={artifact.selector} />
                ),
              }}
            />
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

const StyledHeaderBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));


export default CommonDrawer;