import { FormControl, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputComponent = (props: Props) => {
  const { name, label, onChange, value } = props;
  return (
    <FormControl fullWidth>
      <TextField value={value} name={name} label={label} onChange={onChange} />
    </FormControl>
  );
};

export default InputComponent;
