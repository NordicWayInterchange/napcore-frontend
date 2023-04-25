import {
  FormControl,
  StandardTextFieldProps,
  TextField as MuiTextField,
} from "@mui/material";
import React from "react";

interface Props extends StandardTextFieldProps {}

const TextField = (props: Props) => {
  const { name, label, onChange, value, disabled = false } = props;
  return (
    <FormControl fullWidth>
      <MuiTextField
        value={value}
        name={name}
        label={label}
        onChange={onChange}
        disabled={disabled}
      />
    </FormControl>
  );
};

export default TextField;
