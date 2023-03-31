import { Button } from "@mui/material";
import React from "react";

type Props = {
  text: string;
  variant?: "text" | "outlined" | "contained" | undefined;
  onClick?: () => void;
};

const ButtonComponent = (props: Props) => {
  const { text, variant = "contained", onClick } = props;
  return (
    <Button onClick={onClick} variant={variant}>
      {text}
    </Button>
  );
};

export default ButtonComponent;
