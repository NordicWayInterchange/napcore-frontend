/*
import { getEnumValues } from "@/lib/getEnumValues";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  SelectProps,
  MenuItem,
} from "@mui/material";
import React from "react";

interface Props extends SelectProps {
  data: any;
}

const Select = (props: Props) => {
  const { onChange, label, name, value, data, disabled = false } = props;
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        multiple
        sx={{ backgroundColor: "white" }}
        value={value}
        name={name}
        label={label}
        onChange={onChange}
        disabled={disabled}
      >
        {getEnumValues(data).map((value, index) => (
          <MenuItem value={value} key={index}>
            {/!* FIXME: *!/}
            {value}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
*/
