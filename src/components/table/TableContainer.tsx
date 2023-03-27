import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableContainer as MuiTableContainer } from "@mui/material/";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, TextField, Box } from "@mui/material";
import StatusChip from "./StatusChip";
import { mockData } from "../../mock/subs";
import { Subscriptions } from "@/interfaces/subscription";
import TableComponent from "./TableComponent";

export default function TableContainer() {
  const [search, setSearch] = useState("");

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
        {/* contained buttons not working */}
        <Button variant="contained">Create Subscription</Button>
        <Button variant="contained">Filter +</Button>
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
