import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableContainer as MuiTableContainer } from "@mui/material/";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatusChip from "./StatusChip";
import { Subscriptions } from "@/interfaces/subscription";

type dataProps = {
  data: Subscriptions;
};

// TODO: Receive headers as props
const TableComponent = ({ data }: dataProps) => {
  return (
    <MuiTableContainer component={Paper}>
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
          {data.map((row) => (
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
    </MuiTableContainer>
  );
};

export default TableComponent;
