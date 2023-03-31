import React from "react";
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
import ButtonComponent from "../ButtonComponent";

type DialogProps = {
  open: boolean;
  data: any; // remove any type
  filters: any; // remove any type
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
          <ButtonComponent text={"Clear"} onClick={handleClear} />
          <ButtonComponent text={"Apply"} onClick={handleApply} />
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
