import {TextField} from "@mui/material";
import React from "react";

interface Props {
  searchId: string,
  setSearchId?: (value: (((prevState: string) => string) | string)) => void,
  label: string
}

const SearchBox = ({searchId, setSearchId, label}: Props) => {
  return (
    <TextField
      label={`Find ${label} by ID in table`}
      variant="standard"
      value={searchId}
      onChange={(e) => setSearchId ? setSearchId(e.target.value) : null}
      style={{ marginRight: 1, width: '250px' }}
      type="text"
      sx={textFieldSx}
    />
  );
};

const textFieldSx = {
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#444f55",
  },
  '& .MuiInput-underline:before': {
    borderBottom: '2px solid gray', // normal state
  },
  '& .MuiInput-underline:after': {
    borderBottom: '2px solid black', // focused state
  },
  position: "relative",
  top: "-10px",
  bgcolor: "white",
};

export default SearchBox;
