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
        justifyContent: "center",
        alignItems: "center",
        width: 240,
        "&:hover": {
          boxShadow: 6,
          textDecoration: "underline"
        },
        height: "200px",
        borderBottom: "2px solid #FF9600",
        boxShadow: 1
      }}
    >
      <Avatar sx={{
        bgcolor: "avatarBackgroundColor",
        marginRight: 0,
        marginBottom: 2,
        width: 50, height: 50
      }}>
        {avatar}
      </Avatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{header}</Typography>
        <Typography>{description}</Typography>
      </Box>
    </Card>
  );
};

export default ShortcutCard;
