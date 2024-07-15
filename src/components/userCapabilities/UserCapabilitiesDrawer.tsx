import {
  Box,
  Button,
  Card,
  Drawer,
  FormControl,
  List,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedCapability } from "@/types/capability";
import {deleteUserCapability } from "@/lib/fetchers/internalFetchers";
import { styled } from "@mui/material/styles";
import { ContentCopy } from "@/components/shared/actions/ContentCopy";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import DrawerForm from "@/components/layout/DrawerForm";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import Snackbar from "@/components/shared/feedback/Snackbar";
import MapDialog from "@/components/map/MapDialog";

const width = 600;

type Props = {
  capability: ExtendedCapability;
  open: boolean;
  handleMoreClose: () => void;
};

const UserCapabilitiesDrawer = ({ capability, open, handleMoreClose }: Props) => {
  const { data: session } = useSession();
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });

  const selector = `(publicationId = '${capability.publicationId}')`;
  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
  };

  const handleClose = () => {
    setOpenMap(false);
  };

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  };


  const RemoveCapability = async (name: string, selector: string) => {
    const response = await deleteUserCapability(name, selector);

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Capability successfully deleted",
        severity: "success",
      });
    } else {
      setFeedback({
        feedback: true,
        message: "Capability could not be deleted, try again!",
        severity: "warning",
      });
    }
  };

  return (
    <>
      <Drawer
        sx={{
          width: width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: width,
            boxSizing: "border-box",
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#F9F9F9",
          },
        }}
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => handleMoreClose()}
      >
        <Toolbar />
        <Box sx={{ padding: 1, width: 1 }}>
          <List>
            <DrawerForm capability={capability} handleMoreClose={handleMoreClose}/>
            <ListItem>
              <StyledCard variant={"outlined"}>
                <Typography>Quadtree</Typography>
                <FormControl
                  fullWidth
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    contentEditable={false}
                    value={capability.quadTree}
                    label={"Hash"}
                    margin="normal"
                    sx={{
                      flexGrow: 1,
                      marginRight: 1,
                    }}
                    InputProps={{
                      endAdornment: (
                        <ContentCopy value={capability.quadTree.toString()} />
                      ),
                    }}
                  />
                  <StyledButton
                    color="buttonThemeColor"
                    variant="outlined"
                    onClick={() => setOpenMap(true)}
                  >
                    Show map
                  </StyledButton>
                </FormControl>
              </StyledCard>
            </ListItem>
            <ListItem>
              <Button
                sx={{
                  borderRadius: 100,
                  textTransform: "none",
                }}
                variant={"contained"}
                color={"redLight"}
                onClick={() => setDialogOpen(true)}
                disableElevation
              >
                Remove capability
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <DeleteSubDialog
        open={dialogOpen}
        actorCommonName={session?.user.commonName as string}
        itemId={capability.id as string}
        handleDialog={handleClickClose}
        text="Capability"
      />
      <MapDialog
        open={openMap}
        onClose={handleClose}
        quadtree={capability.quadTree}
        interactive={false}
      />
    </>
  );
};

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

const StyledButton = styled(Button)(({}) => ({
  width: "150px",
  textTransform: "none",
  borderRadius: 100,
}));


export default UserCapabilitiesDrawer;
