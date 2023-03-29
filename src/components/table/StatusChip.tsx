import Chip from "@mui/material/Chip";
import React from "react";

type StatusChipProps = {
  label: String;
  // color: ChipTypeMap;
};

const StatusChip = ({ label }: StatusChipProps) => {
  // FIXME: No overload matches this call.
  return <Chip color="default" label={label} />;
};

export default StatusChip;
