import { styled } from "@mui/material/styles";
import React from "react";
import { Box } from "@mui/system";

export const CustomEmptyOverlayMatching = () => {
  return (
    <StyledGridOverlay>
      <StyledBox>No matching capabilities for the specified input</StyledBox>
    </StyledGridOverlay>
  );
};

export const CustomEmptyOverlaySubscription = () => {
  return (
    <StyledGridOverlay>
      <StyledBox>Could not find any subscriptions, try creating one!</StyledBox>
    </StyledGridOverlay>
  );
};

export const CustomEmptyOverlayCapabilites = () => {
  return (
    <StyledGridOverlay>
      <StyledBox>No capabilities in the network</StyledBox>
    </StyledGridOverlay>
  );
};

export const CustomEmptyOverlayDeliveries = () => {
  return (
    <StyledGridOverlay>
      <StyledBox>No deliveries in the network</StyledBox>
    </StyledGridOverlay>
  );
};

const StyledGridOverlay = styled("div")(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
}));

const StyledBox = styled(Box)(({}) => ({
  mt: 1,
}));
