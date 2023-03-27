import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { filterMockData } from "../../mock/filters";

const TableDialog = (props) => {
  const { onClose, selectedValue, open } = props;
  const [filters, setFilters] = useState([]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  // console.log(filterMockData);

  // const handleListItemClick = (value: string) => {
  //   onClose(value);
  // };

  const handleChange = (event) => {
    const checked = event.target.checked;
    const selected = event.target.value;

    if (checked) {
      setFilters([...filters, selected]);
    } else {
      setFilters(filters.filter((p) => p !== selected));
    }
  };

  // FIXME: renders twice
  console.log(filters);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add filters</DialogTitle>
      <DialogContent>
        <FormGroup>
          {/* TODO: Optimize */}
          {filterMockData.map((filterType, key) => (
            <Box key={key}>
              <Typography>{filterType.header}</Typography>
              {filterType.filter?.map((filterData) => (
                <FormControlLabel
                  key={filterData}
                  label={filterData}
                  control={
                    <Checkbox
                      checked={filters.includes(filterData)}
                      value={filterData}
                      onChange={handleChange}
                    />
                  }
                />
              ))}
            </Box>
          ))}
        </FormGroup>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Clear
          </Button>
          <Button onClick={handleClose} autoFocus>
            Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
