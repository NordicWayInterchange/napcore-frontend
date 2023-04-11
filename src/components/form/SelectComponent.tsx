import { getEnumValues } from "@/lib/getEnumValues";
import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  MenuItem,
} from "@mui/material";
import React from "react";

interface Props extends SelectProps {
  data: any;
  isDisabled?: boolean;
};

const SelectComponent = (props: Props) => {
  const { onChange, label, name, value, data, isDisabled } = props;
  return (
    <FormControl disabled={isDisabled} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} name={name} label={label} onChange={onChange}>
        {getEnumValues(data).map((value, index) => (
          <MenuItem value={value} key={index}>
            {/* FIXME: */}
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
