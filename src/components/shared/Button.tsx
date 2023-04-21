import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface Props extends ButtonProps {
  text: string;
}

const ButtonComponent = (props: Props) => {
  const { text, variant = "contained", onClick } = props;
  return (
    <Button onClick={onClick} variant={variant}>
      {text}
    </Button>
  );
};

export default ButtonComponent;
