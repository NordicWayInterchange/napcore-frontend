import { styled } from "@mui/material/styles";
import { Button, Card, FormControl } from "@mui/material";

const width = 600;

export const StyledFormControl = styled(FormControl)(({}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
}));

export const StyledButton = styled(Button)(({}) => ({
  width: "200px",
  textTransform: "none",
  borderRadius: 100,
}));

export const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

export const menuItemStyles = {
  '&:hover': {
    backgroundColor: 'menuItemHoverColor',
  },
  '&.Mui-selected': {
    backgroundColor: 'menuItemBackgroundColor',
    '&:hover': {
      backgroundColor: 'menuItemHoverColor',
    },
  }
};

export const drawerStyle = {
  width: width,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: width,
    boxSizing: "border-box",
  },
}