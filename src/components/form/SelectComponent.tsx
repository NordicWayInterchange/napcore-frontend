import { getEnumValues } from "@/lib/getEnumValues";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

type Props = {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  label: string;
  name: string;
  enumData: any;
  isDisabled: boolean;
};

const SelectComponent = (props: Props) => {
  const { onChange, label, name, value, enumData, isDisabled } = props;
  return (
    <FormControl disabled={isDisabled} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} name={name} label={label} onChange={onChange}>
        {getEnumValues(enumData).map((key, index) => (
          <MenuItem value={key} key={index}>
            {/* FIXME: */}
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
