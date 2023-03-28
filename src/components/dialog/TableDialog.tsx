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

type DialogProps = {
  open: boolean;
  data: any; // remove any type
  filters: any; // remove any type
  onClose: () => void;
  handleClear: () => void;
  handleApply: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TableDialog = (props: DialogProps) => {
  const { handleChange, handleClear, handleApply, data, filters, open } = props;

  return (
    <Dialog open={open}>
      <DialogTitle>Add filters</DialogTitle>
      <DialogContent>
        <FormGroup>
          {data.map((filterType, key) => (
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
          <Button autoFocus onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleApply} autoFocus>
            Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
