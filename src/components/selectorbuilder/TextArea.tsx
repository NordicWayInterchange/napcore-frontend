import {
  FormControl,
  StandardTextFieldProps,
  TextField as MuiTextField,
} from "@mui/material";
import React from "react";

interface Props extends StandardTextFieldProps {}

const TextArea = (props: Props) => {
  const { name, label, onChange, value } = props;
  return (
    <FormControl fullWidth>
      <MuiTextField
        value={value}
        name={name}
        label={label}
        disabled={true}
        multiline
        rows={2}
        maxRows={4}
      />
    </FormControl>
  );
};

export default TextArea;
