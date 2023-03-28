import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { mockData } from "../../mock/subs";
import { Subscriptions, Subscription } from "@/interfaces/subscription";
import TableComponent from "./TableComponent";
import TableDialog from "./TableDialog";

export default function TableContainer() {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState("");

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
        // FIXME: Element implicitly has an 'any'
        (column) =>
          row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
          -1
      )
    );
  };

  return (
    <Box>
      <Box sx={{ flexDirection: "row" }}>
        <Button variant="contained">Create Subscription</Button>
        <Button onClick={handleClickOpen} variant="contained">
          Filter +
        </Button>
        <TableDialog open={open} onClose={handleClose} />
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
