import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { signOut, useSession } from "next-auth/react";
import { Box } from "@mui/system";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <AppBar
      elevation={0}
      sx={{
        zIndex: (index) => index.zIndex.drawer + 1,
        bgcolor: "navbarBackgroundColor",
      }}
      position="fixed"
    >
      <Toolbar sx={{display: "flex", justifyContent: "flex-end"}}>
        <Typography variant="h6" noWrap component="div" sx={{marginRight: 'auto'}}>
          {process.env.NEXT_PUBLIC_THEME_PROVIDER == "trafficdata"
            ? "Trafficdata"
            : "Transportportal"}
        </Typography>
        <StyledSignOutBox sx={{marginLeft: 'auto'}}>
          <IconButton onClick={() => signOut()}>
            <PersonOutlineIcon sx={{color: "white"}} />
          </IconButton>
          <Typography>{session?.user?.name}</Typography>
        </StyledSignOutBox>
      </Toolbar>
    </AppBar>
  );
}
const StyledSignOutBox = styled(Box)(({}) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
