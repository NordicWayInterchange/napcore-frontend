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

type Props = {
  headers: string[];
  data: Subscriptions;
};

const TableComponent = (props: Props) => {
  const { data, headers } = props;

  // TODO: Render cells based on object it receives
  return (
    <MuiTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} align="right">
                {header}
              </TableCell>
            ))}
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
                <StatusChip label={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MuiTableContainer>
  );
};

export default TableComponent;
