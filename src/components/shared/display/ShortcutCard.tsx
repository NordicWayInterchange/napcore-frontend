import { Avatar, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactElement } from "react";

interface Props {
  avatar: ReactElement;
  header: string;
  description: string;
}

const ShortcutCard = (props: Props) => {
  const { avatar, header, description } = props;

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        width: { xs: "100%", sm: "100%", md: 250 },
        "&:hover": {
          boxShadow: 6,
          textDecoration: "underline"
        },
        height: "190px",
        borderBottom: "2px solid #FF9600",
        boxShadow: 1
      }}
    >
      <Avatar sx={{
        bgcolor: "avatarBackgroundColor",
        marginRight: 0,
        marginBottom: 2
      }}>
        {avatar}
      </Avatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography sx={{
          marginLeft: 1,
        }}>
          {header}</Typography>
        <Typography>{description}</Typography>
      </Box>
    </Card>
  );
};

export default ShortcutCard;
