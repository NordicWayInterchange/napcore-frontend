import { Avatar, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface Props {
  avatar: string;
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
        padding: 2,
        width: { xs: "100%", sm: "100%", md: 260 },
        "&:hover": {
          boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.4)",
          textDecoration: "underline"
        },
        borderBottom: "2px solid orange",
        boxShadow: 2
      }}
    >
      <Avatar sx={{
        bgcolor: "avatarBackgroundColor",
        marginRight: 1,
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
