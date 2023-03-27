import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, TextField, Box } from "@mui/material";
import StatusChip from "./StatusChip";
import { mockData } from "../../mock/subs";
import { Subscriptions } from "@/interfaces/subscription";

export default function SubscriptionTable() {
  const [search, setSearch] = useState("");

  const searchFunc = (rows: Subscriptions) => {
    const columns = rows[0] && Object.keys(rows[0]);
    return rows.filter((row) =>
      columns.some(
        (column) => row[column].toString().toLowerCase().indexOf(search) > -1
      )
    );
  };

  return (
    <div>
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
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">Message Type</TableCell>
                <TableCell align="right">Originating Country</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchFunc(mockData).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.id}</TableCell>
                  <TableCell align="right">{row.messageType}</TableCell>
                  <TableCell align="right">{row.originatingCountry}</TableCell>
                  <TableCell align="right">
                    <StatusChip label={row.status} color={row.color} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
