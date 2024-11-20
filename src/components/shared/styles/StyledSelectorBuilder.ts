import { styled } from "@mui/material/styles";
import { Button, Card, FormControl } from "@mui/material";

export const StyledFormControl = styled(FormControl)(({}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
}));

export const StyledButton = styled(Button)(({}) => ({
  textTransform: 'none',
  marginLeft: 2,
  height: 40,
  width: '200px',
  borderColor: 'buttonThemeColor',
  paddingBottom: '10px', // Ensures there’s enough space at the bottom
  position: 'relative',
  '&:hover': {
    // On hover, show the bottom border using the ::after pseudo-element
    '&::after': {
      content: '""', // Creates an empty content for the pseudo-element
      position: 'absolute',
      bottom: 0, // Places it at the bottom of the button
      left: 0,
      width: '100%', // Full width of the button
      height: '3px', // Thickness of the border
      backgroundColor: '#FF9600', // The color of the border
    },
  },
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