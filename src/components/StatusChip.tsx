import Chip from "@mui/material/Chip";
import React from "react";

type StatusChipProps = {
  label: String;
  color: String;
};

const StatusChip = ({ label, color }: StatusChipProps) => {
  return <Chip color={color} label={label} />;
};

export default StatusChip;
