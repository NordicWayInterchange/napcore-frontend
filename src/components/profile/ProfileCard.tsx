import { Avatar, Box, Card, List, ListItem, ListItemText } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material/styles";

const widthHeight = 200;

export const ProfileCard = () => {
  const { data: session } = useSession();

  return (
    <StyledBox>
      <StyledCard variant="outlined">
        <StyledAvatar>
          <Image
            src={session?.user?.image as string}
            alt="Profile Image"
            width={widthHeight}
            height={widthHeight}
          />
        </StyledAvatar>
        <List>
          <ListItem>
            <ListItemText primary={"Name"} secondary={session?.user?.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary={"Email"} secondary={session?.user?.email} />
          </ListItem>
        </List>
      </StyledCard>
    </StyledBox>
  );
};

const StyledAvatar = styled(Avatar)(({}) => ({
  width: widthHeight,
  height: widthHeight,
}));

const StyledCard = styled(Card)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
  padding: 24,
  width: "50%",
}));

const StyledBox = styled(Box)(({}) => ({
  display: "inline-block",
}));
