import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, TextField, Box } from "@mui/material";
import StatusChip from "./StatusChip";

const mockData = [
  {
    id: 1,
    messageType: "DATEX",
    originatingCountry: "NO",
    status: "CREATED",
    color: "primary",
  },
  {
    id: 2,
    messageType: "DENM",
    originatingCountry: "DK",
    status: "REQUESTED",
    color: "secondary",
  },
  {
    id: 3,
    messageType: "DATEX",
    originatingCountry: "NO",
    status: "TEAR DOWN",
    color: "info",
  },
  {
    id: 4,
    messageType: "DATEX",
    originatingCountry: "NO",
    status: "RESUBSCRIBE",
    color: "warning",
  },
  {
    id: 5,
    messageType: "DATEX",
    originatingCountry: "NO",
    status: "ILLEGAL",
    color: "error",
  },
];

export default function SubscriptionTable() {
  return (
    <div>
      <div className="flex justify-evenly m-2">
        {/* contained buttons not working */}
        <Button variant="outlined">Create Subscription</Button>
        <Button variant="outlined">Filter +</Button>
        <TextField
          sx={{ width: 400 }}
          id="outlined-basic"
          size="small"
          label="Search ..."
          variant="outlined"
        />
      </div>
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
              {mockData.map((row) => (
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
