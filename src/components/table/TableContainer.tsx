import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { mockData } from "../../mock/subs";
import { Subscriptions, Subscription } from "@/interfaces/subscription";
import TableComponent from "./TableComponent";
import TableDialog from "./TableDialog";
import { filterMockData } from "../../mock/filters";

export default function TableContainer() {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

  const handleClear = () => {
    setFilters([]);
    handleClose();
  };

  const handleApply = () => {
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchColumns = (rows: Subscriptions) => {
    const columns = rows[0] && Object.keys(rows[0]);
    return rows.filter((row) =>
      columns.some(
        // Element implicitly has an 'any'
        (column) =>
          row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
          -1
      )
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const selected = event.target.value;

    if (checked) {
      setFilters([...filters, selected]);
    } else {
      setFilters(filters.filter((p) => p !== selected));
    }
  };

  return (
    <Box>
      <Box sx={{ flexDirection: "row" }}>
        <Button variant="contained">Create Subscription</Button>
        <Button onClick={handleClickOpen} variant="contained">
          Filter +
        </Button>
        <TableDialog
          filters={filters}
          handleChange={handleChange}
          handleApply={handleApply}
          handleClear={handleClear}
          data={filterMockData}
          open={open}
          onClose={handleClose}
        />
        <TextField
          sx={{ width: 400 }}
          id="outlined-basic"
          size="small"
          label="Search ..."
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <TableComponent data={searchColumns(mockData)} />
    </Box>
  );
}
