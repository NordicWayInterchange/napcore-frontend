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
  const { onChange, label, name, value, data } = props;
  return (
    <FormControl sx={{ marginY: 2 }} fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        multiple
        value={value}
        name={name}
        label={label}
        onChange={onChange}
      >
        {getEnumValues(data).map((value, index) => (
          <MenuItem value={value} key={index}>
            {/* FIXME: */}
            {value}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
