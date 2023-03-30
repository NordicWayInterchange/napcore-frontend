import { FormControl, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

type Props = {
  name: string;
  label: string;
  value: string;
  isDisabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputComponent = (props: Props) => {
  const { name, label, onChange, value, isDisabled } = props;
  return (
    <FormControl fullWidth>
      <TextField
        disabled={isDisabled}
        value={value}
        name={name}
        label={label}
        onChange={onChange}
      />
    </FormControl>
  );
};

export default InputComponent;
