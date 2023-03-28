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
import React from "react";

type Props = {};

const DialogComponent = (props): Props => {
  const {} = props;
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
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
