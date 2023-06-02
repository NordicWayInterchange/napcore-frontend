import {
  FormControl,
  StandardTextFieldProps,
  TextField as MuiTextField,
} from "@mui/material";
import React from "react";

interface Props extends StandardTextFieldProps {}

const TextField = (props: Props) => {
  return (
    <FormControl fullWidth>
      <MuiTextField sx={{ backgroundColor: "white" }} {...props} />
    </FormControl>
  );
};

export default TextField;
