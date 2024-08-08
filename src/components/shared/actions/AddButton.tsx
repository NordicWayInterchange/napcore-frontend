import { Button } from "@mui/material";
import React from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

type Props = {
  text: string;
  labelUrl: string;
};

export default function AddButton(props: Props) {
  const {text, labelUrl} = props;

   const getUrl = () => {
     return labelUrl === 'subscription' ? "/subscriptions/new-subscription" : labelUrl ==='capability' ?
       '/capabilities/new-user-capability' : '/deliveries/new-delivery';
  };

  return (
    <>
    <Link
      href={getUrl()} style={{ textDecoration: "none" }}
    >
      <StyledButton
        sx={{ my: 1, boxShadow: 2 }}
        startIcon={<AddIcon />}
        variant="contained"
        color="buttonThemeColor"
        disableElevation
      >
        {text}
      </StyledButton>
    </Link>
    </>
  );
}

const StyledButton = styled(Button)(({}) => ({
  borderRadius: 100,
  textTransform: "none",
  marginLeft: 2,
  height: 40,
  width: "200px"
}));