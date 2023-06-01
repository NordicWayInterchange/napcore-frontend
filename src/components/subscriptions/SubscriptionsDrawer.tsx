import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import { ExtendedSubscription } from "@/types/subscription";
import { statusChips } from "@/lib/statusChips";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

const width = 400;

type Props = {
  subscription: ExtendedSubscription;
  open: boolean;
  handleMoreClose: () => void;
};

const SubscriptionsDrawer = ({
  subscription,
  open,
  handleMoreClose,
}: Props) => {
  console.log(subscription);

  const theme = useTheme();

  const copyPrivateKey = (value: string) => {
    // TODO: Promise retured are ignored
    navigator.clipboard.writeText(value);
  };

  const handleClose = () => {
    handleMoreClose();
  };

  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
        },
      }}
      //TODO: change to persistent
      variant="permanent"
      anchor="right"
      open={open}
      onClose={handleClose}
    >
      <Toolbar />
      <Box sx={{ padding: 2 }}>
        {/*        <IconButton onClick={handleMoreClose} edge="end" color="primary">
          <CloseIcon />
        </IconButton>*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Subscription details</Typography>
          <Chip
            sx={{ borderRadius: 1 }}
            // TODO: Fix
            color={statusChips[subscription.status]}
            label={subscription.status}
          />
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.mainBackgroundColor,
            padding: 1,
            borderRadius: 2,
          }}
        >
          <Box>{subscription.id}</Box>
          <Box>{subscription.capabilityMatches}</Box>
          <Box>{subscription.lastUpdatedTimeStamp}</Box>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.mainBackgroundColor,
            padding: 1,
            borderRadius: 2,
          }}
        >
          {/*TODO: add enpoints (currently existing)*/}
          {/*<Box>{subscription.endpoints[0].host}</Box>
          <Box>{subscription.endpoints[0].source}</Box>
          <Box>{subscription.endpoints[0].port}</Box>*/}
          <Typography>ENDPOINTS</Typography>
          <FormControl fullWidth>
            <TextField
              contentEditable={false}
              value={"ampqs://myserver"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => copyPrivateKey("ampqs://myserver")}
                      edge="end"
                      color="primary"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              contentEditable={false}
              value={"Serviceprovider 1-1"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => copyPrivateKey("Serviceprovider 1-1")}
                      edge="end"
                      color="primary"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              contentEditable={false}
              value={"5671"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => copyPrivateKey("5671")}
                      edge="end"
                      color="primary"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.mainBackgroundColor,
            padding: 1,
            borderRadius: 2,
          }}
        >
          <Typography>SELECTOR</Typography>
          <FormControl fullWidth>
            <TextField value={subscription.selector} rows={4} />
          </FormControl>
        </Box>
        <Button sx={{ borderRadius: 100 }} variant={"contained"}>
          Remove Subscription
        </Button>
      </Box>
    </Drawer>
  );
};

export default SubscriptionsDrawer;
