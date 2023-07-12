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
        flexDirection: "row",
        alignItems: "center",
        padding: 2,
        width: { xs: "100%", sm: "100%", md: 400 },
        ":hover": {
          bgcolor: "cardBackgroundColor",
        },
      }}
    >
      <Avatar sx={{ bgcolor: "avatarBackgroundColor", marginRight: 3 }}>
        {avatar}
      </Avatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>{header}</Typography>
        <Typography>{description}</Typography>
      </Box>
    </Card>
  );
};

export default ShortcutCard;
